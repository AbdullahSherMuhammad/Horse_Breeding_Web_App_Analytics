// fetchHorseData.js
const axios = require("axios");
require('dotenv').config(); 
const { logMessage } = require('../utils/logger'); // Adjust the path as necessary

/**
 * Fetches horse data for a given FEIF ID with a timeout.
 * Logs successes and failures accordingly.
 * @param {string} feifId - The FEIF ID to fetch data for
 * @returns {Object|null} - The fetched horse data or null if skipped.
 */
const fetchHorseData = async (feifId) => {
  const apiUrl = `${process.env.PYTHONANYWHEREURL}${feifId}&access_token=${process.env.ACCESSTOKEN1}`;

  try {
    const response = await axios.get(apiUrl, { timeout: 15000 }); // 30,000 ms = 30 seconds
    const data = response.data;
    return data;
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      logMessage('skipped_requests_cron_job', `Timeout for FEIF ID: ${feifId}`);
    } else {
      logMessage('skipped_requests_cron_job', `Error for FEIF ID: ${feifId} - ${error.message}`);
    }
    return null; // Indicate that the request was skipped or failed
  }
};

module.exports = fetchHorseData;
