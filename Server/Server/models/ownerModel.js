// models/Owner.js

const BaseModel = require('./BaseModel');

class Owner extends BaseModel {
  constructor() {
    super('owners');
  }

  /**
   * Processes and prepares owner data for insertion.
   * @param {object} rawData - The raw owner data.
   * @returns {object} - The processed owner data.
   */
  prepareData(rawData) {
    return {
      owner_name: rawData.Name,
      country_id: rawData.country_id || null
    };
  }

  /**
   * Retrieves an owner by name or creates it if it doesn't exist.
   * @param {string} ownerName - The name of the owner.
   * @param {object} rawData - The raw owner data to process and insert if not found.
   * @returns {object} - The owner record.
   */
  async getOrCreate(ownerName, rawData) {
    let owner = await this.getByUniqueField('owner_name', ownerName);
    if (!owner) {
      const ownerData = this.prepareData(rawData);
      owner = await this.create(ownerData);
    }
    return owner;
  }
}

module.exports = new Owner();
