// models/Gender.js

const BaseModel = require('./BaseModel');

class Gender extends BaseModel {
  constructor() {
    super('genders');
  }

  /**
   * Processes and prepares gender data for insertion.
   * @param {string} genderDescription - The description of the gender.
   * @returns {object} - The processed gender data.
   */
  prepareData(genderDescription) {
    return {
      gender_description: genderDescription
    };
  }

  /**
   * Retrieves a gender by description or creates it if it doesn't exist.
   * @param {string} genderDescription - The description of the gender.
   * @returns {object} - The gender record.
   */
  async getOrCreate(genderDescription) {
    let gender = await this.getByUniqueField('gender_description', genderDescription);
    if (!gender) {
      const genderData = this.prepareData(genderDescription);
      gender = await this.create(genderData);
    }
    return gender;
  }
}

module.exports = new Gender();
