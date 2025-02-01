// horseModel.js
const BaseModel = require('./BaseModel');
const { supabase } = require('../config/supabase'); 
const { logMessage } = require('../utils/logger'); 
const deduplicateData = require('../utils/duplicate');
const { parseDate } = require('../utils/dateChanger'); 

class Horse extends BaseModel {
  constructor() {
    super('horse');
  }

  static async create() {
    const instance = new Horse();
    await instance.lookupHelper.loadInitialData();
    return instance;
  }

  extractIdAndName(inputString) {
    if (!inputString) return { id: null, name: null };
    const [id, name] = inputString.split(" - ");
    return { feif_id: id ? id.trim() : null, name: name ? name.trim() : null };
  }

  checkNameFormat(name, farmname) {
    if (name.includes('frá') && name.split(' ').length >= 3) {
      return name;
    }

    if (name.trim().length > 0) {
      return `${name} ${farmname}`;
    }

    if (!farmname.includes('frá') && name.split(' ').length <= 2) {
      return `${name} frá ${farmname}`;
    }
  }

  async prepareData(horsesData) {
    const horsesToInsert = [];
    const siresToInsert = [];
    const damsToInsert = [];
    const skippedHorses = [];
    const skippedSires = [];
    const skippedDams = [];
    const parentMappings = []; 

    horsesData = this.removeDuplicatesAdvanced(horsesData, ["FEIF ID"], {
      caseInsensitive: true, 
      keep: 'first',        
    });

    // const horseFeifIds = horsesData.map(horse => horse["FEIF ID"]).filter(id => id);
    // const sireFeifIds = horsesData.map(horse => this.extractIdAndName(horse["Sire"]).id).filter(id => id);
    // const damFeifIds = horsesData.map(horse => this.extractIdAndName(horse["Dam"]).id).filter(id => id);

    // const { data: existingHorsesRes } = await this.get('horse', ['feif_id'], {
    //   filters: { place_holder: true } 
    // });

    // const { data: existingSiresRes } = await this.get('horse', ['feif_id'], {
    //   filters: { feif_id: sireFeifIds }
    // });

    // const { data: existingDamsRes } = await this.get('horse', ['feif_id'], {
    //   filters: { feif_id: damFeifIds }
    // });

    // console.log(existingHorsesRes.length, "existing horses");

    // const existingHorseFeifIds = new Set(existingHorsesRes.map(horse => horse.feif_id));
    // const existingSireFeifIds = new Set(existingSiresRes.map(sire => sire.feif_id));
    // const existingDamFeifIds = new Set(existingDamsRes.map(dam => dam.feif_id));

    for (const rawData of horsesData) {
      const horseFeifId = rawData["FEIF ID"];

      const genderId = await this.getOrCreateGender(rawData["Gender"], horseFeifId);
      const countryId = await this.getOrCreateCountry(rawData["Country of current location"], horseFeifId);

      const sire = this.extractIdAndName(rawData["Sire"]);
      const dam = this.extractIdAndName(rawData["Dam"]);

      const horseData = {
        name: this.checkNameFormat(rawData["Name"], rawData["Name of the farm (stud)"]),
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
      siresToInsert.push(sire);
      damsToInsert.push(dam);
      parentMappings.push({
        offspring_feif_id: horseFeifId,
        sire_feif_id: sire.feif_id,
        dam_feif_id: dam.feif_id
      });
    }
    const uniqueSires = this.removeDuplicatesAdvanced(siresToInsert, ['feif_id'])
    const uniqueDams = this.removeDuplicatesAdvanced(damsToInsert, ['feif_id'])

    return { horsesToInsert, siresToInsert: uniqueSires, damsToInsert: uniqueDams, skippedHorses, skippedSires, skippedDams, parentMappings };
  }

  async getOrCreate(rawDataArray) {
    try {
      console.log(`Processing ${rawDataArray.length} horse records.`);
      const { horsesToInsert, siresToInsert, damsToInsert, skippedHorses, skippedSires, skippedDams, parentMappings } = await this.prepareData(rawDataArray);
      const selectColumns = "horse_id, feif_id";
      console.log(`Preparing to upsert ${siresToInsert.length} unique sires.`);
      
      let upsertedSires = [];
      if (siresToInsert.length > 0) {
        upsertedSires = await this.upsert(siresToInsert, ['feif_id'], selectColumns);
        console.log(`Successfully upserted ${upsertedSires.length} sires.`);
      }

      console.log(`Preparing to upsert ${damsToInsert.length} unique dams.`);
      let upsertedDams = [];
      if (damsToInsert.length > 0) {
        upsertedDams = await this.upsert(damsToInsert, ['feif_id'], selectColumns);
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

      console.log('Populating parent_offspring relationships.');
      this.populateParentOffspring(parentMappings);
      if (skippedHorses.length > 0) {
        console.log(`${skippedHorses.length} horses were skipped due to duplicates.`);
      }
      if (skippedSires.length > 0) {
        console.log(`${skippedSires.length} sires were skipped due to duplicates.`);
      }
      if (skippedDams.length > 0) {
        console.log(`${skippedDams.length} dams were skipped due to duplicates.`);
      }

      return { horses: upsertedHorses, sires: upsertedSires, dams: upsertedDams };
    } catch (error) {
      console.error('Error in getOrCreate:', error);
      throw error;
    }
  }

  async populateParentOffspring(parentMappings) {
    try {
      if (!parentMappings || parentMappings.length === 0) {
        console.log('No parent-offspring relationships to insert.');
        return;
      }
      console.log(parentMappings)
      const relationshipsToInsert = [];

      const feifIds = [
        ...new Set(parentMappings.flatMap(mapping => [mapping.sire_feif_id, mapping.dam_feif_id, mapping.offspring_feif_id]))
      ];
      
      const {  data:horseData, error:horseError } = await this.get("horse", ["horse_id", "feif_id"]);

      const feifIdToHorseIdMap = new Map();
      horseData.forEach(horse => {
        feifIdToHorseIdMap.set(horse.feif_id, horse.horse_id);
      });

      parentMappings.forEach(mapping => {
        const { offspring_feif_id, sire_feif_id, dam_feif_id } = mapping;

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
            });
          }
        }

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
            });
          }
        }
      });
      console.log(relationshipsToInsert.length);
      const deduplicatedRelationships = this.removeDuplicatesAdvanced(relationshipsToInsert, ['parent_feif_id', 'offspring_feif_id', 'relationship_type']);
      if (deduplicatedRelationships.length === 0) {
        console.log('No new parent_offspring relationships to insert.');
        return;
      }

      const { data: insertedRelationships, error: insertError } = await supabase
        .from('parent_offspring')
        .upsert(deduplicatedRelationships, { onConflict: ['parent_id', 'offspring_id', 'relationship_type'] })
        .select("parent_offspring_id");

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
