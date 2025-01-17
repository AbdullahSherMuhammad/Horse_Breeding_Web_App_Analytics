const axios = require("axios");
require('dotenv').config(); 

const fetchHorseData = async (feifId) => {
  const apiUrl = `${process.env.PYTHONANYWHEREURL}${feifId}`;
  console.log(apiUrl)
  try {
    console.log(`Fetching data for FEIF ID: ${feifId}`);
    const response = await axios.get(apiUrl);
    return response.data;
  } catch (error) {
    console.error(`Error fetching data for FEIF ID ${feifId}:`, error.message);
    return null;
  }
};

module.exports = fetchHorseData;
