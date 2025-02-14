const Horse_Farm = require('../models/HorseFarmModel')

exports.horse_farm = async (rawDataArray) => {
  try {
    const horseFarmInstance = new Horse_Farm();

    const insertedHorse_Farm = await horseFarmInstance.getOrCreate(rawDataArray);

    console.log(`${insertedHorse_Farm.length} Horse_Farm associations inserted/upserted successfully.`);
    return `${insertedHorse_Farm.length} Horse_Farm associations inserted/upserted successfully.`;
  } catch (error) {
    console.error('Error inserting horse_farm data:', error.message);
    return `Error inserting horse_farm data: ${error.message}`;
  }
}