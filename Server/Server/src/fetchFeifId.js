const fs = require("fs");
const csvParser = require("csv-parser");

const fetchFeifIdsFromCSV = (csvFilePath) => {
  return new Promise((resolve, reject) => {
    const feifIds = []
    fs.createReadStream(csvFilePath)
      .pipe(csvParser())
      .on("data", (row) => {
        if (row["FEIF ID"]) feifIds.push(row["FEIF ID"].trim()); // Match your CSV column name
      })
      .on("end", () => {
        resolve(feifIds);
      })
      .on("error", (err) => {
        reject(err);
      });
  });
};

module.exports = fetchFeifIdsFromCSV;
