//This is join table between horse and Farm.

const Horse_Show = require('../models/HorseShowModel')

exports.horse_show = async (rawDataArray) => {
  try {
    console.log("here")
    // Instantiate the Horse_Show model
    const horse_showInstance = new Horse_Show();

    // Perform getOrCreate operation
    const insertedHorse_Show = await horse_showInstance.getOrCreate(rawDataArray);

    console.log(`${insertedHorse_Show.length} horse_show associations inserted/upserted successfully.`);
    return `${insertedHorse_Show.length} horse_show associations inserted/upserted successfully.`;
  } catch (error) {
    console.error('Error inserting horse_show data:', error.message);
    return `Error inserting horse_show data: ${error.message}`;
  }
}