const fs = require('fs');
const path = require('path');
const pLimit = require('p-limit');
const fetchFeifIdsFromCSV = require('./fetchFeifId');  
const fetchHorseData = require('./fetchHorseData');   
// const { retrySkippedRequests } = require('./retryLogic'); // example
const CONCURRENT_REQUESTS = 5;

const logsDirectory = path.join(__dirname, 'logs');
const successfulDataPath = path.join(logsDirectory, 'successful_horse_data.json');
const skippedDataPath = path.join(logsDirectory, 'skipped_feif_ids.json');
const feifidsPath = path.join(logsDirectory, 'feif_ids.json');

/**  
 * Writes data incrementally to JSON file.
 * @param {string} filePath
 * @param {Object} data
 */



const writeDataToJson = (filePath, data) => {
  let existingData = [];
  if (fs.existsSync(filePath)) {
    try {
      existingData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (err) {
      console.error(`Error parsing existing JSON in ${filePath}:`, err);
    }
  }
  existingData.push(data);
  fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2));
};

/**
 * Saves an array of IDs to a JSON file (overwrite).
 * @param {string} filePath
 * @param {string[]} ids
 */
const saveIdsToJson = (filePath, ids) => {
  fs.writeFileSync(filePath, JSON.stringify(ids, null, 2));
};

const writeSuccessfulSummary = (logDirectory, count) => {
  const summaryFilePath = path.join(logDirectory, 'successful_summary.log');
  const timestamp = new Date().toLocaleString('en-US', {
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  
  const summaryEntry = `[${timestamp}] ${count} records successfully saved.\n`;
  fs.appendFileSync(summaryFilePath, summaryEntry);
};

/**
 * Fetch horse data from a list of FEIF IDs, store successful results, log skipped IDs.
 * @param {string} csvFilePath - Path to CSV containing FEIF IDs.
 */
const fetchHorseDataModule = async (csvFilePath) => {
  try {
    if (!fs.existsSync(logsDirectory)) {
      fs.mkdirSync(logsDirectory, { recursive: true });
    }

    let feifIds = [];
    if (!fs.existsSync(feifidsPath)) {
      feifIds = await fetchFeifIdsFromCSV(csvFilePath);
      saveIdsToJson(feifidsPath, feifIds);
    } else {
      feifIds = JSON.parse(fs.readFileSync(feifidsPath, 'utf8'));
      console.log(`Fetched ${feifIds.length} FEIF IDs from ${csvFilePath}.`);
    }

    const limit = pLimit(CONCURRENT_REQUESTS);
    const skippedFeifIds = [];
    let successfulCounter = 0;
    let skippedCount = 0;

    const tasks = feifIds.map(feifId =>
      limit(async () => {
        if (skippedCount > 10) {
          skippedFeifIds.push(feifId);
          return;
        }
        const data = await fetchHorseData(feifId);
        if (data) {
          successfulCounter++;
          writeDataToJson(successfulDataPath, data);
        } else {
          skippedFeifIds.push(feifId);
          skippedCount++;
        }
      })
    );

    await Promise.all(tasks);

    if (skippedFeifIds.length > 0) {
      console.log(`Skipped ${skippedFeifIds.length} FEIF IDs. Saving them...`);
      saveIdsToJson(skippedDataPath, skippedFeifIds);
      saveIdsToJson(feifidsPath, skippedFeifIds);
    }

     
    // Write summary
    writeSuccessfulSummary(logsDirectory, successfulCounter);

    console.log("=== Fetching Module Completed Successfully ===");
    console.log(`Successful horse data saved in: ${successfulCounter}`);
    console.log(`Skipped FEIF IDs (if any) saved in: ${skippedDataPath}`);
  } catch (error) {
    console.error("Error in fetchHorseDataModule:", error.message);
  }
};

module.exports = {
  fetchHorseDataModule
};
