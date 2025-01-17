const csvFilePath = "./data/FEIF.csv"; 
require('dotenv').config()
const fetchFeifIdsFromCSV = require("./fetchFeifId");
const fetchHorseData = require("./fetchHorseData");
const { insertDataToSupabase } = require('../controllers/insertDataToSupabase');

const start = async (csvFilePath) => {
  try {
    const feifIds = await fetchFeifIdsFromCSV(csvFilePath);
    console.log(`Fetched ${feifIds.length} FEIF IDs from the CSV.`);
    let counter = 0;
    // for (counter; counter < 20; counter++) {
    //   const horseData = await fetchHorseData(feifIds[counter]); // Fetch data from API
    //   if (horseData) {
    //     await insertDataToSupabase(horseData); // Insert into Supabase
    //   }
    // }
    const horseData = await fetchHorseData(feifIds[counter])
    if(!horseData){
      console.log("No Data")
    }
    await insertDataToSupabase(horseData);
    console.log("All FEIF IDs processed successfully.");
  } catch (error) {
    console.error("Error processing horse data:", error.message);
  }
};
// Here I have sent counter to 20, So it will push first 20 elements, you can push based on your requirement, For production I will make it foreach so it will push all the feifIDs. 
start(csvFilePath)
