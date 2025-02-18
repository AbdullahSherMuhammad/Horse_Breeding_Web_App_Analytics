const BaseModel = require('./BaseModel');
const { parseDate } = require('../utils/dateChanger');
const chalk = require('chalk');

class Horse_Show extends BaseModel {
    constructor() {
      super('horse_show'); 
    }
  
  
    async getOrCreate(rawDataArray) {
      try {
        const horseShowsToInsert = await this.prepareData(rawDataArray);
        console.log(chalk.blue(`Preparing to insert/upsert ${horseShowsToInsert.length} horse_shows assosiations.`));
        if (horseShowsToInsert.length === 0) {
          console.log('No valid associations to insert/upsert.');
          return [];
        }

        const upsertedShows = await this.upsert(
          horseShowsToInsert,
          ["horse_id", "show_id"], 
          '*' 
        );
        return upsertedShows;
      } catch (error) {
        console.error('Error in getOrCreate:', error.message);
        throw error; 
      }
    }
    async prepareData(assessmentData) {
        const flattenedBreedingInfo = assessmentData.flat();
      try {
        const horsesResult = await this.get("horse", ["horse_id", "feif_id"]);
        const horses = horsesResult.data;
        console.log(chalk.blue(`Fetched ${horses.length} horses.`));

        const showsResult = await this.get("show", ["show_id", "show_name"]);
        const shows = showsResult.data;
        console.log(chalk.blue(`Fetched ${shows.length} shows.`));

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
          
          showsToInsert.push({
            horse_id, 
            show_id,  
          });
        }
        const array = this.removeDuplicatesAdvanced(showsToInsert, ["horse_id", "show_id"], { caseInsensitive: true, keep: 'first' })


        return array; 
      }
      catch(error)
      {
        console.error("Got an error in prepareData:", error.message);
        throw error; 
      }
    }

    
  
}

module.exports = Horse_Show;
