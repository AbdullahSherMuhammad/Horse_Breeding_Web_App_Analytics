const BlupInfo = require("../models/blupModel")

exports.blupInfo = async (rawDataArray) => {
  try {
    const blupModel = new BlupInfo();
    
    const insertedBlups = await blupModel.getOrCreate(rawDataArray);
    
  } catch (error) {
    console.error('Error inserting BLUP info data:', error.message);
    return error.message;
  }
};
