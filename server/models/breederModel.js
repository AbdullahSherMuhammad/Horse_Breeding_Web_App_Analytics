// models/Breeder.js

const BaseModel = require('./BaseModel');

class Breeder extends BaseModel {
  constructor() {
    super('breeders');
  }

  /**
   * Processes and prepares breeder data for insertion.
   * @param {object} rawData - The raw breeder data.
   * @returns {object} - The processed breeder data.
   * 
   */
  prepareData(rawData) {
    return {
      breeder_name: rawData.Name,
      country_id: rawData.country_id || null
    };
  }

  /**
   * Retrieves a breeder by name or creates it if it doesn't exist.
   * @param {string} breederName - The name of the breeder.
   * @param {object} rawData - The raw breeder data to process and insert if not found.
   * @returns {object} - The breeder record.
   */
  async getOrCreate(breederName, rawData) {
    let breeder = await this.getByUniqueField('breeder_name', breederName);
    if (!breeder) {
      const breederData = this.prepareData(rawData);
      breeder = await this.create(breederData);
    }
    return breeder;
  }
}

module.exports = new Breeder();
