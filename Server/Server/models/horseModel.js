const BaseModel = require('./BaseModel');
const { parseDate } = require('../utils/dateChanger');

class Horse extends BaseModel {
  constructor() {
    super('horse');
  }


  prepareData(rawData) {
    return {
      name: rawData["Name"],
      feif_id: rawData["FEIF ID"],
      ueln: rawData["UELN"],
      farm_id: rawData.farm_id || null,
      gender_id: rawData.gender_id || null,
      colour_code: rawData["Colour code"],
      colour_description: rawData["Colour Description"],
      date_of_birth: parseDate(rawData["Date of birth"]),
      microchip: rawData["Microchip"],
      date_of_death: parseDate(rawData["Date of death"]),
      colour_name: rawData["Colour name"],
      exports_date: parseDate(rawData["Export’s date"]),
      fate: rawData["Fate"],
      castration: rawData["Castration"] || null,
      breeder_id: rawData.breeder_id || null,
      farm_name: rawData["Name of the farm (stud)"] || null,
      country_id: rawData.country_id || null
    };
  }

  async getOrCreate(feif_id, rawData) {
    let horse = await this.getByUniqueField('feif_id', feif_id);
    if (!horse) {
      const horseData = this.prepareData(rawData);
      horse = await this.create(horseData);
    }
    return horse;
  }
}

module.exports = new Horse();
