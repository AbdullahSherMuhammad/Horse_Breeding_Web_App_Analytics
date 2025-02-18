const Farm = require('../models/farmModel')

exports.farms = async(rawDataArray) => {
  try {
      const FarmModel = await Farm.create();
      const insertedfarms = await FarmModel.getOrCreate(rawDataArray);
    } catch (error) {
      console.error('Error inserting Farm data:', error.message);
      return error.message;
    }
  }