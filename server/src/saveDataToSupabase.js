const fs = require('fs');
const path = require('path');
require('dotenv').config();
const { insertDataToSupabase } = require('../controllers/insertDataToSupabase');



const start = async() => {

  try {
    const logsDirectory = path.join(__dirname, 'logs');
    const successfulHorseDataPath = path.join(logsDirectory, 'successful_horse_data.json');

    if (fs.existsSync(successfulHorseDataPath)) {
      const fetchedData = JSON.parse(fs.readFileSync(successfulHorseDataPath, 'utf-8'));
      console.log(fetchedData.length, "fetched data length");
      if (fetchedData.length > 0) {
        await insertDataToSupabase(fetchedData);
        console.log("All successfully fetched FEIF IDs have been inserted to Supabase.");
      } else {
        console.log("No successful data to insert.");
      }
    } else {
      console.log("No successful_horse_data.json file found.");
    }

    console.log("All FEIF IDs processed successfully.");

  
    
  } catch (error) {
    console.error("Error processing horse data:", error.message);
  }
};

start();
