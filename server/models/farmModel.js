const BaseModel = require('./BaseModel');
const { parseDate } = require('../utils/dateChanger');
const chalk = require('chalk');

class Farm extends BaseModel {
  constructor() {
    super('farm');
  }

  /**
   * Processes and prepares farm data for insertion.
   * @param {array} farmData - Array containing all the basic_info.
   * @returns {array} - an array of objects that are ready to inserted into the database.
   */ 
  static async create() {
    const instance = new Farm();
    await instance.lookupHelper.loadInitialData();
    return instance;
  } 
  
  async prepareData(farmData) {
    const farmstoInsert = [];
  
    try {
      for (const rawdata of farmData) {
        const countryId = await this.getOrCreateCountry(rawdata["Country of current location"]);
        const locationId = await this.getOrCreateLocation(countryId);   
  
        farmstoInsert.push({
          farm_number: rawdata["Farm ID number"],
          farm_name: rawdata["Name of the farm (stud)"],
          location_id: locationId,
          area: rawdata["Area"] ? parseInt(rawdata["Area"], 10) : null
        });
      }
      return (this.removeDuplicatesAdvanced(farmstoInsert, ["farm_number", "farm_name"], { caseInsensitive: true, keep: 'first' }))
  
    } catch (error) {
      console.error('Error in prepareData:', error);
      throw error; 
    }
  }
  

  /**
   * Retrieves a farm by farm number or creates it if it doesn't exist.
   * @param {string} farmNumber - The unique farm number.
   * @param {object} rawData - The raw farm data to process and insert if not found.
   * @returns {object} - The farm record.
   */
  async getOrCreate(rawDataArray) {
    const farmstoInsert = await this.prepareData(rawDataArray)
    console.log(chalk.blue (`Preparing to upsert ${farmstoInsert.length} farms`));
    const upsertedfarms = await this.upsert(farmstoInsert, ['farm_number', 'farm_name'], '*');
    console.log(chalk.green(`Successfully upserted ${farmstoInsert.length} farms`));

    return upsertedfarms;
  }
  
}






module.exports = Farm;
