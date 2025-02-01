const fetchFeifIdsFromCSV = require("./fetchFeifId");
const { fetchHorseDataModule } = require("./fetchHorseDataModule");


const csvFilePath = "./data/FEIF.csv";
const start = async() => {
const feifIds = await fetchHorseDataModule(csvFilePath);
}

start();