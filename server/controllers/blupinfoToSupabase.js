const BlupInfo = require("../models/blupModel")

exports.blupInfo = async (rawDataArray) => {
  try {
    const blupModel = new BlupInfo();
    
    const insertedBlups = await blupModel.getOrCreate(rawDataArray);
    
    console.log(insertedBlups.length, 'BLUP info records inserted/upserted successfully.');
    return insertedBlups;
  } catch (error) {
    console.error('Error inserting BLUP info data:', error.message);
    return error.message;
  }
};
