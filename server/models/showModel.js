const BaseModel = require('./BaseModel');
const { parseDate } = require('../utils/dateChanger');
const chalk = require('chalk');



class Show extends BaseModel {
  constructor() {
    super('show');
  }

  static async create() {
    const instance = new Show();
    await instance.lookupHelper.loadInitialData();
    return instance;
  }

  async prepareData(breedingInfoArray) {
    const showsToInsert = [];

    try {
      const flattenedBreedingInfo = breedingInfoArray.flat();
      for (const rawdata of flattenedBreedingInfo) {
        const showName = rawdata.Assessment.Show.Name; 
        const startDateStr = rawdata.Assessment.Show.Date.Start; 
        const endDateStr = rawdata.Assessment.Show.Date.End; 
        const code = rawdata.Assessment.Show.Iceland_FIZO_FEIF?.Code || null; 
        const ratio = rawdata.Assessment.Show.Iceland_FIZO_FEIF?.Ratio || null; 

        const startDate = parseDate(startDateStr);
        const endDate = parseDate(endDateStr);

        const countryId = await this.getOrCreateCountry("IS"); 
        const locationId = await this.getOrCreateLocation(countryId);

        showsToInsert.push({
          show_name: showName, 
          start_date: startDate, 
          end_date: endDate, 
          code: code, 
          ratio: ratio, 
          location_id: locationId, 
        });
      }

      const uniqueShows = this.removeDuplicatesAdvanced(showsToInsert, ['show_name', 'start_date'], { caseInsensitive: true, keep: 'first' });

      return uniqueShows;

    } catch (error) {
      console.error('Error in prepareData:', error);
      throw error; 
    }
  }

  /**
   * Retrieves a show by show_name and start_date or creates it if it doesn't exist.
   * @param {Array} rawDataArray - Array containing breeding_info.
   * @returns {Array} - Array of upserted show records.
   */
  async getOrCreate(rawDataArray) {
    try {
      const showsToInsert = await this.prepareData(rawDataArray);
      console.log(chalk.blue (`Number of shows to upsert: ${showsToInsert.length}`));

      const upsertedShows = await this.upsert(showsToInsert, ['show_name', 'start_date'], '*');

      return upsertedShows;
    } catch (error) {
      console.error('Error in getOrCreate:', error);
      throw error;
    }
  }

  /**
   * Retrieves or creates a country record.
   * @param {string} countryCode - The country code (e.g., "IS" for Iceland).
   * @returns {number} - The ID of the country.
   */
  
  
}

module.exports = Show;
