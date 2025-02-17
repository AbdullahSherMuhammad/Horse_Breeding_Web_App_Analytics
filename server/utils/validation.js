const { logMessage } = require("./logger");

function validateData(data) {
  const entries = Array.isArray(data) ? data : [data];

  const expectedKeyCounts = {
    basic_info: 20, 
    owner_info: 4, 
    breeder_info: 3,
    breeding_info: 8, 
    blup_info: 30, 
    offspring_info: 2,
  };

  entries.forEach((entry, index) => {
    const entryLogPrefix = `Horse ${index + 1}`;
    Object.entries(entry).forEach(([key, value]) => {
      if (key === 'metadata') return;

      if (!value || (typeof value === 'object' && Object.keys(value).length === 0)) {
        logMessage(`${entryLogPrefix}-${key}`, `Section "${key}" is empty.`);
        return;
      }

      if (expectedKeyCounts[key] && Object.keys(value).length !== expectedKeyCounts[key]) {
        logMessage(
          `${entryLogPrefix}-${key}`,
          `Section "${key}" has an incorrect number of keys. Expected: ${expectedKeyCounts[key]}, Found: ${Object.keys(value).length}.`
        );
      }

      if (key === 'basic_info' && (!value['FEIF ID'] || value['FEIF ID'].trim() === '')) {
        logMessage(`${entryLogPrefix}-basic_info`, `"FEIF ID" is missing or empty.`);
      }
    });
  });
}


module.exports = { validateData };
