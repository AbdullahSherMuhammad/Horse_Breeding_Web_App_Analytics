// models/Country.js

const BaseModel = require('./BaseModel');

class Country extends BaseModel {
  constructor() {
    super('countries');
  }

  /**
   * Processes and prepares country data for insertion.
   * @param {object} rawData - The raw country data.
   * @returns {object} - The processed country data.
   */
  prepareData(rawData) {
    return {
      iso_code: rawData.iso_code,
      country_name: rawData.country_name || rawData.iso_code // Adjust as necessary
    };
  }

  /**
   * Retrieves a country by ISO code or creates it if it doesn't exist.
   * @param {string} iso_code - The ISO code of the country.
   * @param {object} rawData - The raw country data to process and insert if not found.
   * @returns {object} - The country record.
   */
  async getOrCreate(iso_code, rawData) {
    let country = await this.getByUniqueField('iso_code', iso_code);
    if (!country) {
      const countryData = this.prepareData(rawData);
      country = await this.create(countryData);
    }
    return country;
  }
}

module.exports = new Country();
