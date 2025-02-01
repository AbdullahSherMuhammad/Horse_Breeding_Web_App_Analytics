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
                console.log("nullentries in scores", logMsg);
                logMessage("nullentries in scores", logMsg);
            }
        });
    });
    return assessmentsArray;
}

module.exports = { handleNullFields };
