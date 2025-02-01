const fs = require('fs');
const path = require('path');
const csvFilePath = "./data/FEIF.csv"; 
require('dotenv').config();
const fetchFeifIdsFromCSV = require("./fetchFeifId");
const fetchHorseData = require("./fetchHorseData");
const { insertDataToSupabase } = require('../controllers/insertDataToSupabase');
const { logMessage } = require('../utils/logger'); 
const pLimit = require('p-limit');

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const CONCURRENT_REQUESTS = 10; // Sir Abdullah recommendation I wanted to do parallel Processing.
const MAX_RETRIES = 3;  //I have capitalized we might make them environment variables.

const writeDataToJson = (filePath, data) => {
  // Read existing data
  let existingData = [];
  if (fs.existsSync(filePath)) {
    const fileData = fs.readFileSync(filePath, 'utf-8');
    try {
      existingData = JSON.parse(fileData);
    } catch (err) {
      console.error(`Error parsing JSON from ${filePath}:`, err);
      existingData = [];
    }
  }

  existingData.push(data);

  fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2));
};

/**
 * Starts the horse data fetching process.
 * @param {string} csvFilePath - Path to the FEIF IDs CSV file.
 */
const start = async (csvFilePath) => {
  try {
    const feifIds = await fetchFeifIdsFromCSV(csvFilePath);
     console.log(`Fetched ${feifIds.length} FEIF IDs from the CSV.`);
    
    // // Initialize paths
    const logsDirectory = path.join(__dirname, 'logs');
    const outputJsonPath = path.join(logsDirectory, 'successful_horse_data.json');

    // Ensure the logs directory exists
    if (!fs.existsSync(logsDirectory)) {
      fs.mkdirSync(logsDirectory, { recursive: true });
    }

    const successfulHorseDataPath = outputJsonPath;
    const skippedFeifIds = []; // To store skipped FEIF IDs for manual processing

    const limit = pLimit(CONCURRENT_REQUESTS);

    // Define tasks with controlled concur5rency
    const tasks = feifIds.map(feifId => limit(async () => {
      const data = await fetchHorseData(feifId);
      if (data) {
        // Write successful data incrementally to JSON
        writeDataToJson(successfulHorseDataPath, data);
        console.log(`Successfully fetched data for FEIF ID: ${feifId}`);
      } else {
        console.log(`Skipped FEIF ID: ${feifId}`);
        skippedFeifIds.push(feifId); // Collect skipped FEIF IDs
      }
    }));

    // Execute all tasks
    await Promise.all(tasks);

    // Insert successful data to Supabase
    if (fs.existsSync(successfulHorseDataPath)) {
      const fetchedData = JSON.parse(fs.readFileSync(successfulHorseDataPath, 'utf-8'));
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

    // Handle skipped requests for manual processing
    //handleSkippedRequests(skippedFeifIds);
    //initiateRetries(skippedFeifIds);
    
  } catch (error) {
    console.error("Error processing horse data:", error.message);
  }
};

/**
 * Handles skipped FEIF IDs by logging and writing them to a JSON file.
 * @param {Array<string>} skippedFeifIds - Array of skipped FEIF IDs.
 */
const handleSkippedRequests = (skippedFeifIds) => {
  if (skippedFeifIds.length > 0) {
    console.log(`Total Skipped FEIF IDs: ${skippedFeifIds.length}`);
    console.log("Skipped FEIF IDs:", skippedFeifIds.join(', '));

    // Write skipped FEIF IDs to a separate JSON file for manual processing
    const skippedJsonPath = path.join(__dirname, 'logs', 'skipped_feif_ids.json');
    fs.writeFileSync(skippedJsonPath, JSON.stringify(skippedFeifIds, null, 2));
    console.log(`Skipped FEIF IDs have been written to ${skippedJsonPath}`);
  } else {
    console.log("No skipped FEIF IDs.");
  }
};

/**
 * Retries fetching data for skipped FEIF IDs.
 * @param {Array<string>} feifIds - Array of FEIF IDs to retry.
 * @param {number} attempt - Current attempt number.
 */
const retrySkippedRequests = async (feifIds, attempt = 1) => {
  if (attempt > MAX_RETRIES) {
    console.log(`Reached maximum retry attempts for skipped requests.`);
    return;
  }

  console.log(`Retrying skipped requests - Attempt ${attempt}`);

  const logsDirectory = path.join(__dirname, 'logs');
  const outputJsonPath = path.join(logsDirectory, 'successful_horse_data.json');
  const newSkippedFeifIds = [];

  const limit = pLimit(CONCURRENT_REQUESTS);

  const tasks = feifIds.map(feifId => limit(async () => {
    const data = await fetchHorseData(feifId);
    if (data) {
      // Write successful data incrementally to JSON
      writeDataToJson(outputJsonPath, data);
      console.log(`Successfully fetched data for FEIF ID: ${feifId} on attempt ${attempt}`);
    } else {
      console.log(`Skipped FEIF ID: ${feifId} on attempt ${attempt}`);
      newSkippedFeifIds.push(feifId);
    }
  }));

  // Execute all tasks
  await Promise.all(tasks);

  if (newSkippedFeifIds.length > 0) {
    const waitTime = Math.pow(2, attempt) * 1000; // Exponential backoff
    console.log(`Attempt ${attempt} - Skipped FEIF IDs: ${newSkippedFeifIds.length}. Waiting for ${waitTime / 1000} seconds before retrying.`);
    await sleep(waitTime);
    await retrySkippedRequests(newSkippedFeifIds, attempt + 1);
  } else {
    console.log("All previously skipped FEIF IDs have been successfully fetched.");
  }
};

/**
 * Initiates retries for skipped FEIF IDs.
 * @param {Array<string>} skippedFeifIds - Array of skipped FEIF IDs.
 */
const initiateRetries = async (skippedFeifIds) => {
  if (skippedFeifIds.length > 0) {
    await retrySkippedRequests(skippedFeifIds);
  }
};

// Start the process
start(csvFilePath);
