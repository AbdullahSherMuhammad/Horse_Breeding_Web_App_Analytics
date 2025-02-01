const BaseModel = require('./BaseModel');
const { parseDate } = require('../utils/dateChanger');

class Horse_Show extends BaseModel {
    constructor() {
      super('horse_show'); // Specify the table name
    }
  
    /**
     * Retrieves existing associations or creates new ones based on raw data.
     *
     * @param {Array<Object>} rawDataArray - Array of raw assessment data objects.
     * @returns {Promise<Array<Object>>} - Array of upserted associations.
     */
    async getOrCreate(rawDataArray) {
      try {
        const horseShowsToInsert = await this.prepareData(rawDataArray);
        console.log(`Preparing to insert/upsert ${horseShowsToInsert.length} horse_shows assosiations.`)
        if (horseShowsToInsert.length === 0) {
          console.log('No valid associations to insert/upsert.');
          return [];
        }

        const upsertedShows = await this.upsert(
          horseShowsToInsert,
          ["horse_id", "show_id"], // Conflict columns
          '*' 
        );
        return upsertedShows;
      } catch (error) {
        console.error('Error in getOrCreate:', error.message);
        throw error; // Re-throw the error after logging
      }
    }
    /**
     * Prepares data for insertion into the horse_show table by mapping horse_feif_id
     * to horse_id and processed show_name to show_id, then creates associations.
     *
     * @param {Array<Object>} assessmentData - Array of assessment data objects containing FEIF ID and Show Name.
     * @returns {Array<Object>} - Array of unique associations ready to be inserted into horse_show.
     */
    async prepareData(assessmentData) {
        const flattenedBreedingInfo = assessmentData.flat();
        console.log(flattenedBreedingInfo.length);
      try {
        const horsesResult = await this.get("horse", ["horse_id", "feif_id"]);
        const horses = horsesResult.data;
        console.log(`Fetched ${horses.length} horses.`);

        const showsResult = await this.get("show", ["show_id", "show_name"]);
        const shows = showsResult.data;
        console.log(`Fetched ${shows.length} shows.`);

        const feifIdToHorseIdMap = new Map();
        horses.forEach(horse => {
          if (horse.feif_id && horse.horse_id) {
            feifIdToHorseIdMap.set(horse.feif_id, horse.horse_id);
          }
        });

        const showIdToShowNameMap = new Map();
        shows.forEach(show => {
          if (show.show_id && show.show_name) {
            showIdToShowNameMap.set(show.show_name, show.show_id);
          }
        });



        // Step 3: Process each assessmentData entry to create associations
        const showsToInsert = [];

        for (const rawdata of flattenedBreedingInfo) {
          const horseFeifId = rawdata["Assessment"].Horse.ID;
          const rawShowName = rawdata["Assessment"].Show.Name;
       

          const horse_id = feifIdToHorseIdMap.get(horseFeifId);
          if (!horse_id) {
            console.warn(`Horse with FEIF ID "${rawdata["Assessment"].Horse.ID}" not found. Skipping entry.`);
          }
          const show_id = showIdToShowNameMap.get(rawShowName);
          if (!show_id) {
            console.warn(`Show with name "${processedShowName}" not found. Skipping entry.`);
          }
          if(horse_id == 824 && show_id == 15)
          {
            console.log(horseFeifId,rawShowName)
          }
          showsToInsert.push({
            horse_id, // Integer
            show_id,  // Integer
          });
        }
        const array = this.removeDuplicatesAdvanced(showsToInsert, ["horse_id", "show_id"], { caseInsensitive: true, keep: 'first' })


        return showsToInsert; // Ensure data is returned
      }
      catch(error)
      {
        console.error("Got an error in prepareData:", error.message);
        throw error; // Re-throw the error after logging
      }
    }

    removeDuplicatesAdvanced(array, fields, options = {}) {
      const { caseInsensitive = false, keep = 'first' } = options;
      const seenKeys = new Map();
      const duplicates = []; // Array to store duplicate items
    
      array.forEach(item => {
        const key = fields.map(field => {
          let value = item[field] || '';
          value = String(value).trim();
          return caseInsensitive ? value.toLowerCase() : value;
        }).join('_');
    
        if (seenKeys.has(key)) {
          duplicates.push(item);
    
          if (keep === 'last') {
            seenKeys.set(key, item);
          }
        } else {
          seenKeys.set(key, item);
        }
      });
    
      // Log duplicates for quick inspection
      if (duplicates.length > 0) {
        console.log(`Found ${duplicates.length} duplicate(s):`, duplicates);
      } else {
        console.log('No duplicates found.');
      }
    
      // Return the deduplicated array
      return Array.from(seenKeys.values());
    }
    
  
}

module.exports = Horse_Show;
