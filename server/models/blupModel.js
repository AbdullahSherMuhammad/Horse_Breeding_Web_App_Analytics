const BaseModel = require('./BaseModel');

const { parseDate, parseDecimal } = require('../utils/dateChanger');
const chalk = require('chalk');

class BlupInfo extends BaseModel {
  constructor() {
    super('blup_info');
  }

  /**
   * Prepares BLUP info data for insertion by:
   * 1. Fetching horses (horse_id, feif_id).
   * 2. Creating a map of feif_id --> horse_id.
   * 3. Renaming object keys to match your DB columns.
   * 4. Parsing values with helper functions (heightToInt, parseDecimal, dateToParse).
   * @param {Array} rawBlupInfo - Array of BLUP objects (missing horse_id).
   * @returns {Array} - Array of objects with the correct columns & types.
   */
  async prepareData(rawBlupInfo) {
    const blupToInsert = [];
  
    try {
      const horsesResult = await this.get('horse', ['horse_id', 'feif_id']);
      const horses = horsesResult.data;
      console.log(`Fetched ${horses.length} horses.`);

      const feifIdToHorseIdMap = new Map();
      horses.forEach(horse => {
        if (horse.feif_id && horse.horse_id) {
          feifIdToHorseIdMap.set(horse.feif_id, horse.horse_id);
        }
      });
  
      for (const item of rawBlupInfo) {
        const feifId = item['FEIF ID'];
        const horseId = feifIdToHorseIdMap.get(feifId) || null;
  
        const renamed = {
          horse_id: horseId,
          feif_id: feifId,

          head: item['Head'],
          tolt: item['Tölt'],
          neck: item['Neck'],
          trot: item['Trot'],
          back: item['Back'],
          pace: item['Pace'],
          proportions: item['Proportions'],
          gallop: item['Gallop'],
          legs: item['Legs'],
          canter: item['Canter'],
          joints: item['Joints'],
          rideability: item['Rideability'],
          hooves: item['Hooves'],
          general_impression: item['General impression'],
          mane_and_tail: item['Mane and tail'],
          walk: item['Walk'],
          conformation: item['Conformation'],
          slow_tolt: item['Slow tölt'],

          total_score: parseDecimal(item['Total score']),
          ridden_abilities_wo_pace: parseDecimal(item['Ridden abilities w/o pace']),
          total_wo_pace: parseDecimal(item['Total w/o pace']),

   
          height_at_withers: parseDecimal(item['Height at withers']),

          'Accuracy (%)': item['Accuracy (%)'],

          standard_deviation: item['Standard deviation (+/-)'],
          blup_for_attendance_to_breeding_show: item['BLUP for attendance to breeding show'],
          number_of_offspring_registered_to_date: item['Number of offspring registered to date'],
          number_of_fully_assessed_offspring: item['Number of fully-assessed offspring'],
          number_of_daughters_aged_6_yrs_or_older: item['Number of daughters aged 6 yrs or older'],
          number_of_assessed_daughters_aged_6_yrs_or_older: item['Number of assessed daughters aged 6 yrs or older'],
          number_of_assessed_daughters: item['Number of assessed daughters'],
          
          ratio_of_assessed_daughters_aged_6_yrs_or_older_percent: parseDecimal(item['Ratio of assessed daughters aged 6 yrs or older (%)']),
          ratio_of_assessed_daughters_percent: parseDecimal(item['Ratio of assessed daughters (%)']),
          inbreeding_coefficient_percent: parseDecimal(item['Inbreeding coefficient (%)']),

          number_of_assessed_parents: item['Number of assessed parents'],
          assessed_in: item['Assessed in'],
          year_of_the_assessment: item['Year of the assessment'],

          latest_update: parseDate(item['Latest update'])
        };
  
        blupToInsert.push(renamed);
      }
  
      return blupToInsert;
    } catch (error) {
      console.error('Error in prepareData:', error);
      throw error; 
    }
  }
  
  /**
   * Inserts or upserts BLUP data by [horse_id, feif_id].
   * @param {Array} rawDataArray - Array of raw BLUP objects.
   * @returns {Array} - Array of upserted BLUP records.
   */
  async getOrCreate(rawDataArray) {
    try {
      const blupToInsert = await this.prepareData(rawDataArray);
      console.log(chalk.blue(`Number of blups to upsert: ${blupToInsert.length}`));

      const upsertedBlups = await this.upsert(blupToInsert, ['horse_id', 'feif_id'], '*');
      console.log(chalk.green('Successful Upserted Blups:', upsertedBlups.length));

    } catch (error) {
      console.error('Error in getOrCreate:', error);
      throw error;
    }
  }
}

module.exports = BlupInfo;
