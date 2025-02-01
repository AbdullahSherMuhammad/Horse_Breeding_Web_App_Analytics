const Horse = require("../models/horseModel");

exports.horses = async(rawDataArray) => {
    try {
        const horseModel = await Horse.create();
    
        const insertedHorses = await horseModel.getOrCreate(rawDataArray);
      } catch (error) {
        console.error('Error inserting what data data:', error.message);
        return error.message;
      }
    }