const Horse_Show = require('../models/HorseShowModel')

exports.horse_show = async (rawDataArray) => {
  try {
    console.log("here")
    const horse_showInstance = new Horse_Show();

    const insertedHorse_Show = await horse_showInstance.getOrCreate(rawDataArray);

    console.log(`${insertedHorse_Show.length} horse_show associations inserted/upserted successfully.`);
    return `${insertedHorse_Show.length} horse_show associations inserted/upserted successfully.`;
  } catch (error) {
    console.error('Error inserting horse_show data:', error.message);
    return `Error inserting horse_show data: ${error.message}`;
  }
}