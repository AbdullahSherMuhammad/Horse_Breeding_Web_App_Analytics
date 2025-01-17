const BlupInfo = require("../models/blupModel")

exports.blupInfo = async (rawDataArray) => {
  try {
    // Create an instance of the BlupInfo model (which might load any lookup data if needed)
    const blupModel = new BlupInfo();
    
    const insertedBlups = await blupModel.getOrCreate(rawDataArray);
    
    console.log(insertedBlups.length, 'BLUP info records inserted/upserted successfully.');
    return insertedBlups;
  } catch (error) {
    console.error('Error inserting BLUP info data:', error.message);
    return error.message;
  }
};
