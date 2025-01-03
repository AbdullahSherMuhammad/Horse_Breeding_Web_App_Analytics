// models/Farm.js

const BaseModel = require('./BaseModel');
const { parseDate } = require('../utils/dateChanger');

class Farm extends BaseModel {
  constructor() {
    super('farms');
  }

  /**
   * Processes and prepares farm data for insertion.
   * @param {object} rawData - The raw farm data.
   * @returns {object} - The processed farm data.
   */
  prepareData(rawData) {
    return {
      farm_number: rawData["Farm ID number"],
      farm_name: rawData["Name of the farm (stud)"],
      area: rawData["Area"] ? parseInt(rawData["Area"], 10) : null
    };
  }

  /**
   * Retrieves a farm by farm number or creates it if it doesn't exist.
   * @param {string} farmNumber - The unique farm number.
   * @param {object} rawData - The raw farm data to process and insert if not found.
   * @returns {object} - The farm record.
   */
  async getOrCreate(farmNumber, rawData) {
    let farm = await this.getByUniqueField('farm_number', farmNumber);
    if (!farm) {
      const farmData = this.prepareData(rawData);
      farm = await this.create(farmData);
    }
    return farm;
  }
}

module.exports = new Farm();
