// horseModel.js
const BaseModel = require('./BaseModel');
const { supabase } = require('../config/supabase'); // Adjust the path as needed
const { logMessage } = require('../utils/logger'); // Adjust the path as needed
const deduplicateData = require('../utils/duplicate'); // Adjust the path as needed
const { parseDate } = require('../utils/dateChanger'); // Ensure correct path
/**
 * @class Horse - This class will insert Horses, and Parent_Offsprings. 
 */ 
class Horse extends BaseModel {
  constructor() {
    super('horse'); // Ensure table name matches your database
  }

/**
 * This is a factory function, basically a static method that creates an instance of the Horse class and loads the initial data.
 * It will load Gender and Country data from the database. So We don't have to make a new request for each horse.
 * @returns {return {gender and Country}} 
 */ 
  static async create() {
    const instance = new Horse();
    await instance.lookupHelper.loadInitialData();
    return instance;
  } 

  
  extractIdAndName(inputString) {
    if (!inputString) return { id: null, name: null };
    const [id, name] = inputString.split(" - ");
    return { id: id ? id.trim() : null, name: name ? name.trim() : null };
  }

  
  async prepareData(horsesData) {
    const horsesToInsert = [];
    const siresToInsert = [];
    const damsToInsert = [];
    const skippedHorses = [];
    const skippedSires = [];
    const skippedDams = [];
    const parentMappings = []; // To store offspring to parents mappings

    // Step 1: Extract feif_ids
    const horseFeifIds = horsesData.map(horse => horse["FEIF ID"]).filter(id => id);
    const sireFeifIds = horsesData.map(horse => this.extractIdAndName(horse["Sire"]).id).filter(id => id);
    const damFeifIds = horsesData.map(horse => this.extractIdAndName(horse["Dam"]).id).filter(id => id);

    // Step 2: Fetch existing feif_ids from the database
    const [existingHorsesRes, existingSiresRes, existingDamsRes] = await Promise.all([
      supabase
      .from('horse')
      .select('feif_id')
      .in('feif_id', horseFeifIds)
      .eq('place_holder', true),
      supabase.from('horse').select('feif_id').in('feif_id', sireFeifIds),
      supabase.from('horse').select('feif_id').in('feif_id', damFeifIds),
    ]);
    console.log(existingHorsesRes.data.length, "existing horses")

    if (existingHorsesRes.error) {
      console.error('Error fetching existing horses:', existingHorsesRes.error.message);
      throw existingHorsesRes.error;
    }

    if (existingSiresRes.error) {
      console.error('Error fetching existing sires:', existingSiresRes.error.message);
      throw existingSiresRes.error;
    }

    if (existingDamsRes.error) {
      console.error('Error fetching existing dams:', existingDamsRes.error.message);
      throw existingDamsRes.error;
    }

    const existingHorseFeifIds = new Set(existingHorsesRes.data.map(horse => horse.feif_id));
    const existingSireFeifIds = new Set(existingSiresRes.data.map(sire => sire.feif_id));
    const existingDamFeifIds = new Set(existingDamsRes.data.map(dam => dam.feif_id));

    // Step 3: Iterate and prepare insertion arrays
    for (const rawData of horsesData) {
      const genderId = await this.getOrCreateGender(rawData["Gender"]);
      const countryId = await this.getOrCreateCountry(rawData["Country of current location"]);

      const sire = this.extractIdAndName(rawData["Sire"]);
      const dam = this.extractIdAndName(rawData["Dam"]);

      const horseFeifId = rawData["FEIF ID"];

      // Validation: Check if horse_feif_id already exists
      if (existingHorseFeifIds.has(horseFeifId)) {
        const message = `Horse with FEIF ID ${horseFeifId} already exists. Skipping insertion.`;
        console.warn(message);
        logMessage('duplicate', message);
        skippedHorses.push({ horse: rawData, reason: 'Duplicate FEIF ID' });
        continue; // Skip this horse
      }

      // Prepare sire data
      if (sire.id && sire.name) {
        if (!existingSireFeifIds.has(sire.id)) {
          siresToInsert.push({ feif_id: sire.id, name: sire.name });
        } else {
          const message = `Sire with FEIF ID ${sire.id} already exists. Skipping insertion.`;
          console.warn(message);
          logMessage('duplicate', message);
          skippedSires.push({ sire, reason: 'Duplicate FEIF ID' });
        }
      } else {
        const message = `Invalid sire data for horse FEIF ID ${horseFeifId}. Skipping sire insertion.`;
        console.warn(message);
        logMessage('error', message);
      }

      // Prepare dam data
      if (dam.id && dam.name) {
        if (!existingDamFeifIds.has(dam.id)) {
          damsToInsert.push({ feif_id: dam.id, name: dam.name });
        } else {
          const message = `Dam with FEIF ID ${dam.id} already exists. Skipping insertion.`;
          console.warn(message);
          logMessage('duplicate', message);
          skippedDams.push({ dam, reason: 'Duplicate FEIF ID' });
        }
      } else {
        const message = `Invalid dam data for horse FEIF ID ${horseFeifId}. Skipping dam insertion.`;
        console.warn(message);
        logMessage('error', message);
      }

      // Prepare horse data
      const horseData = {
        name: rawData["Name"],
        feif_id: horseFeifId,
        ueln: rawData["UELN"],
        colour_code: rawData["Colour code"],
        colour_description: rawData["Colour Description"],
        date_of_birth: parseDate(rawData["Date of birth"]),
        microchip: rawData["Microchip"],
        date_of_death: parseDate(rawData["Date of death"]),
        colour_name: rawData["Colour name"],
        exports_date: parseDate(rawData["Export’s date"]),
        fate: rawData["Fate"],
        castration: rawData["Castration"] || null,
        gender_id: genderId,
        country_id: countryId,
        place_holder: true
      };


      horsesToInsert.push(horseData);

      // Store parent mappings
      parentMappings.push({
        offspring_feif_id: horseFeifId,
        sire_feif_id: sire.id,
        dam_feif_id: dam.id
      });
    }

    // Deduplicate sires and dams based on 'feif_id' to prevent duplicates within the same insertion
    const uniqueSires = deduplicateData(siresToInsert, ['feif_id']);
    const uniqueDams = deduplicateData(damsToInsert, ['feif_id']);

    return { horsesToInsert, siresToInsert: uniqueSires, damsToInsert: uniqueDams, skippedHorses, skippedSires, skippedDams, parentMappings };
  }



  /**
   * Handles the upsert operations for sires, dams, and horses, and populates parent_offspring relationships.
   * @param {Array<Object>} rawDataArray - The raw horse data array.
   * @returns {Object} - An object containing upserted horses, sires, dams.
   */
  async getOrCreate(rawDataArray) {
    try {
      console.log(`Processing ${rawDataArray.length} horse records.`);
      const { horsesToInsert, siresToInsert, damsToInsert, skippedHorses, skippedSires, skippedDams, parentMappings } = await this.prepareData(rawDataArray);
      const selectColumns = "horse_id, feif_id"
      console.log(`Preparing to upsert ${siresToInsert.length} unique sires.`);
      let upsertedSires = [];
      if (siresToInsert.length > 0) {
        upsertedSires = await this.upsert(siresToInsert, ['feif_id'], selectColumns);
        console.log(`Successfully upserted ${upsertedSires.length} sires.`);
      }

      console.log(`Preparing to upsert ${damsToInsert.length} unique dams.`);
      let upsertedDams = [];
      if (damsToInsert.length > 0) {
        upsertedDams = await this.upsert(damsToInsert, ['feif_id'],selectColumns);
        console.log(`Successfully upserted ${upsertedDams.length} dams.`);
      }

      console.log(`Preparing to upsert ${horsesToInsert.length} unique horses.`);
      let upsertedHorses = [];
      if (horsesToInsert.length > 0) {
        upsertedHorses = await this.upsert(horsesToInsert, ['feif_id']);
        console.log(`Successfully upserted ${upsertedHorses.length} horses.`);
      } else {
        console.log('No new horses to upsert.');
      }

      // Populate parent_offspring relationships
      console.log('Populating parent_offspring relationships.');
      await this.populateParentOffspring(parentMappings);

      // Optionally, handle skipped entries (e.g., notify, further logging)
      if (skippedHorses.length > 0) {
        console.log(`${skippedHorses.length} horses were skipped due to duplicates.`);
      }
      if (skippedSires.length > 0) {
        console.log(`${skippedSires.length} sires were skipped due to duplicates.`);
      }
      if (skippedDams.length > 0) {
        console.log(`${skippedDams.length} dams were skipped due to duplicates.`);
      }
      const { data: horseslength , error: lengtherror } = await supabase.from("horse").select("place_holder");
      console.log(horseslength.length, "horses length");
      return { horses: upsertedHorses, sires: upsertedSires, dams: upsertedDams };
    } catch (error) {
      console.error('Error in getOrCreate:', error);
      throw error;
    }
  }

  /**
   * Populates the parent_offspring table with relationships.
   * @param {Array<Object>} parentMappings - The array of parent-offspring mappings.
   */
  async populateParentOffspring(parentMappings) {
    try {
      if (!parentMappings || parentMappings.length === 0) {
        console.log('No parent-offspring relationships to insert.');
        return;
      }

      const relationshipsToInsert = [];

      // Step 1: Fetch all relevant horse_ids based on feif_ids
      const feifIds = [
        ...new Set(parentMappings.flatMap(mapping => [mapping.sire_feif_id, mapping.dam_feif_id, mapping.offspring_feif_id]))
      ];

      const { data: horsesData, error: fetchError } = await supabase
        .from('horse')
        .select('horse_id, feif_id')
        .in('feif_id', feifIds);

      if (fetchError) {
        console.error('Error fetching horses for parent_offspring:', fetchError.message);
        throw fetchError;
      }

      const feifIdToHorseIdMap = new Map();
      horsesData.forEach(horse => {
        feifIdToHorseIdMap.set(horse.feif_id, horse.horse_id);
      });

      // Step 2: Prepare parent_offspring entries
      parentMappings.forEach(mapping => {
        const { offspring_feif_id, sire_feif_id, dam_feif_id } = mapping;

        // Sire relationship
        if (sire_feif_id) {
          const parentId = feifIdToHorseIdMap.get(sire_feif_id);
          const offspringId = feifIdToHorseIdMap.get(offspring_feif_id);

          if (!parentId) {
            const message = `Sire with FEIF ID ${sire_feif_id} not found in horse table. Skipping parent_offspring entry.`;
            console.warn(message);
            logMessage('error', message);
          }

          if (!offspringId) {
            const message = `Offspring with FEIF ID ${offspring_feif_id} not found in horse table. Skipping parent_offspring entry.`;
            console.warn(message);
            logMessage('error', message);
          }

          if (parentId && offspringId) {
            relationshipsToInsert.push({
              parent_id: parentId,
              offspring_id: offspringId,
              parent_feif_id: sire_feif_id,
              offspring_feif_id: offspring_feif_id,
              relationship_type: 'sire',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });
          }
        }

        // Dam relationship
        if (dam_feif_id) {
          const parentId = feifIdToHorseIdMap.get(dam_feif_id);
          const offspringId = feifIdToHorseIdMap.get(offspring_feif_id);

          if (!parentId) {
            const message = `Dam with FEIF ID ${dam_feif_id} not found in horse table. Skipping parent_offspring entry.`;
            console.warn(message);
            logMessage('error', message);
          }

          if (!offspringId) {
            const message = `Offspring with FEIF ID ${offspring_feif_id} not found in horse table. Skipping parent_offspring entry.`;
            console.warn(message);
            logMessage('error', message);
          }

          if (parentId && offspringId) {
            relationshipsToInsert.push({
              parent_id: parentId,
              offspring_id: offspringId,
              parent_feif_id: dam_feif_id,
              offspring_feif_id: offspring_feif_id,
              relationship_type: 'dam',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });
          }
        }
      });

      // Step 3: Deduplicate relationships based on parent_feif_id, offspring_feif_id, and relationship_type
      const deduplicatedRelationships = deduplicateData(relationshipsToInsert, ['parent_feif_id', 'offspring_feif_id', 'relationship_type']);

      if (deduplicatedRelationships.length === 0) {
        console.log('No new parent_offspring relationships to insert.');
        return;
      }

      // Step 4: Insert relationships into parent_offspring table
      const { data: insertedRelationships, error: insertError } = await supabase
        .from('parent_offspring')
        .insert(deduplicatedRelationships)
        .select();

      if (insertError) {
        console.error('Error inserting parent_offspring relationships:', insertError.message);
        throw insertError;
      }

      console.log(`Successfully inserted ${insertedRelationships.length} parent_offspring relationships.`);
    }
    catch (error) {
      console.error('Error populating parent_offspring:', error);
      throw error;
    }

}
}  
module.exports = Horse;
