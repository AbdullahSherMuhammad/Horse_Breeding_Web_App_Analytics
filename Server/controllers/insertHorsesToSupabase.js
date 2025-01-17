const Horse = require("../models/horseModel");

exports.horses = async(rawDataArray) => {
    try {
        const horseModel = await Horse.create();
    
        const insertedHorses = await horseModel.getOrCreate(rawDataArray);
        // console.log('All horses inserted/upserted successfully:', insertedHorses);
      } catch (error) {
        // Handle errors during insertion
        console.error('Error inserting what data data:', error.message);
        return error.message;
      }
    }