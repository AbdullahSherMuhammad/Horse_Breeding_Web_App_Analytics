const fs = require("fs");
const csvParser = require("csv-parser");

const fetchFeifIdsFromCSV = (csvFilePath) => {
  return new Promise((resolve, reject) => {
    const feifIds = [];
    const uniqueFeifIds = new Set();

    fs.createReadStream(csvFilePath)
      .pipe(csvParser())
      .on("data", (row) => {
        if (row["FEIF ID"]) {
          const feifId = row["FEIF ID"].trim();
          if (!uniqueFeifIds.has(feifId)) {
            uniqueFeifIds.add(feifId);
            feifIds.push(feifId);
          }
        }
      })
      .on("end", () => {
        resolve(feifIds); // Sends the array with duplicates removed
      })
      .on("error", (err) => {
        reject(err);
      });
  });
};

module.exports = fetchFeifIdsFromCSV;
