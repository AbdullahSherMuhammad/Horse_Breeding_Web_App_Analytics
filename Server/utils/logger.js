// logger.js
const fs = require('fs');
const path = require('path');

/**
 * Appends a message to the specified log file.
 * @param {string} logType - The type/category of the log (e.g., 'duplicate').
 * @param {string} message - The message to log.
 */
function logMessage(logType, message) {
  const logDirectory = path.join(__dirname, 'logs');

  // Ensure the logs directory exists
  if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
  }

  const logFilePath = path.join(logDirectory, `${logType}.log`);
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${message}\n`;

  fs.appendFile(logFilePath, logEntry, (err) => {
    if (err) {
      console.error(`Failed to write to ${logType}.log:`, err);
    }
  });
}

module.exports = { logMessage };
