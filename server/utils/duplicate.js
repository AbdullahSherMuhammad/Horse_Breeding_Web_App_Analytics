// utils/deduplicate.js

/**
 * Removes duplicate objects from an array based on specified key fields.
 * @param {Array<Object>} dataArray - The array of objects to deduplicate.
 * @param {Array<string>} keyFields - The fields to base duplication on.
 * @returns {Array<Object>} - The deduplicated array.
 */
function deduplicateData(dataArray, keyFields) {
    const uniqueMap = new Map();
  
    dataArray.forEach(item => {
      // Create a unique key based on the specified fields
      const key = keyFields.map(field => item[field]).join('|');
      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, item);
      } else {
        console.warn(`Duplicate detected for key: ${key}. Skipping duplicate entry.`);
      }
    });
  
    return Array.from(uniqueMap.values());
  }
  
  module.exports = deduplicateData;
  