const fs = require('fs');

const records = require('./logs/successful_horse_data.json');

const essentialFields = [
  "FEIF ID",
  "Name",
  "Name of the farm (stud)",
  "Sire",
  "Dam"
];

const feifIdCounts = {};

const validRecords = [];
const faultyIds = [];

records.forEach((record) => {
  const basicInfo = record.basic_info || {};
  let allFieldsPresent = true;

  for (const field of essentialFields) {
    const value = basicInfo[field];
    if (
      value === undefined ||
      value === null ||
      (typeof value === "string" && value.trim() === "")
    ) {
      allFieldsPresent = false;
      break;
    }
  }

  if (allFieldsPresent) {
    const feifId = basicInfo["FEIF ID"];
    
    feifIdCounts[feifId] = (feifIdCounts[feifId] || 0) + 1;

    if (feifIdCounts[feifId] === 1) {
      validRecords.push(record);
    }
  } else {
    faultyIds.push(basicInfo["FEIF ID"] || "Unknown");
  }
});

fs.writeFileSync(
  './src/logs/valid_records.json',
  JSON.stringify(validRecords, null, 2),
  'utf8'
);

fs.writeFileSync(
  './src/logs/faulty_ids.json',
  JSON.stringify(faultyIds, null, 2),
  'utf8'
);

const duplicates = Object.entries(feifIdCounts)
  .filter(([_, count]) => count > 1) 
  .map(([feifId, count]) => `${feifId} -> ${count}`);

console.log("Valid records count:", validRecords.length);
console.log("Faulty IDs count:", faultyIds.length);
console.log("Duplicates (FEIF ID => total occurrences):", duplicates);
