// models/HorseFarmModel.js

const BaseModel = require('./BaseModel');
const { parseDate } = require('../utils/dateChanger');

class Horse_Farm extends BaseModel {
    constructor() {
      super('horse_farm');
    }
  
    /**
     * Retrieves existing associations or creates new ones based on raw data.
     *
     * @param {Array<Object>} rawDataArray - 
     * @returns {Promise<Array<Object>>} -
     */
    async getOrCreate(rawDataArray) {
      try {
        const horsefarmsToInsert = await this.prepareData(rawDataArray);
        console.log(`Preparing to insert/upsert ${horsefarmsToInsert.length} associations.`)

        const upsertedFarms = await this.upsert(
          horsefarmsToInsert,
          ["horse_id", "farm_id"],
          '*' 
        );

        return upsertedFarms;
      } catch (error) {
        console.error('Error in getOrCreate:', error.message);
        throw error; 
      }
    }
  
    /**
     * Prepares data for insertion into the horse_farm table by mapping horse_feif_id
     * to horse_id and farm_name to farm_id, then creates associations.
     *
     * @param {Array<Object>} farmData - Array of farm data objects containing FEIF ID and Name of the farm.
     * @returns {Array<Object>} - Array of unique associations ready to be inserted into horse_farm.
     */
    async prepareData(farmData) {
      try {
        
        let horsesResult = await this.get("horse", ["horse_id", "feif_id"]);
        let horses = horsesResult.data;
        console.log(horses.length);

        let farmsResult = await this.get("farm", ["farm_id", "farm_name"]);
        let farms = farmsResult.data;
        console.log(farms.length);

        const feifIdToHorseIdMap = new Map();
        horses.forEach(horse => {
          if (horse.feif_id && horse.horse_id) {
            feifIdToHorseIdMap.set(horse.feif_id, horse.horse_id);
          }
        });
    
        const farmNameToFarmIdMap = new Map();
        farms.forEach(farm => {
          if (farm.farm_name && farm.farm_id) {
            farmNameToFarmIdMap.set(farm.farm_name, farm.farm_id);
          }
        });
        const farmsToInsert = [];
    
        for (const rawdata of farmData) {
          const horseFeifId = rawdata["FEIF ID"];
          const farmName = rawdata["Name of the farm (stud)"];
    
    
          const horse_id = feifIdToHorseIdMap.get(horseFeifId);
        
          const farm_id = farmNameToFarmIdMap.get(farmName);
    
          farmsToInsert.push({
            horse_id, 
            farm_id,  
          });
        }    
        console.log(farmsToInsert[179]);
        return farmsToInsert; // Ensure data is returned
      }
      catch(error)
      {
        console.error("Got an error in prepareData:", error.message);
        throw error; 
      }
    }
}

module.exports = Horse_Farm;
