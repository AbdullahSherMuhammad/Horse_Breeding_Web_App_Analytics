//This is join table between horse and Farm.

const Horse_Farm = require('../models/HorseFarmModel')

exports.horse_farm = async (rawDataArray) => {
  try {
    // Instantiate the Horse_Farm model
    const horseFarmInstance = new Horse_Farm();

    // Perform getOrCreate operation
    const insertedHorse_Farm = await horseFarmInstance.getOrCreate(rawDataArray);

    console.log(`${insertedHorse_Farm.length} Horse_Farm associations inserted/upserted successfully.`);
    return `${insertedHorse_Farm.length} Horse_Farm associations inserted/upserted successfully.`;
  } catch (error) {
    console.error('Error inserting horse_farm data:', error.message);
    return `Error inserting horse_farm data: ${error.message}`;
  }
}