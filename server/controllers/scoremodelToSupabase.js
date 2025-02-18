const chalk = require("chalk");
const ScoreModel = require("../models/scoreModel"); 

exports.scoremodel = async (rawDataArray) => {
  try {
      const scoreModel = new ScoreModel();
      const insertedScores = await scoreModel.getOrCreate(rawDataArray);
  } catch (error) {
      console.error('Error inserting assessment scores:', error.message);
      return error.message;
  }
}
