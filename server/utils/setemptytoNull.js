const chalk = require("chalk");
const { logMessage } = require("./logger");

function handleNullFields(assessmentsArray) {
    assessmentsArray.forEach((assessment, index) => {
        Object.keys(assessment).forEach((key) => {
            if (key === "remarks") {
                return;
            }
            if (assessment[key] === "") {
                assessment[key] = null;
                const logMsg = `Assessment at index ${index}: Field '${assessmentsArray[index]}' was empty and has been set to null.`;
                logMessage("nullentries_in_scores", logMsg);
            }
        });
    });
    console.log(chalk.black(`A log message has been made at utils/logs/nullentries_in_scores you can check out if some data issue`));
    return assessmentsArray;
}

module.exports = { handleNullFields };
