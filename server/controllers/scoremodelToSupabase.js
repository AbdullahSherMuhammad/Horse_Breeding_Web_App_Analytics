const ScoreModel = require("../models/scoreModel"); 

exports.scoremodel = async (rawDataArray) => {
  try {
      const scoreModel = new ScoreModel();
      const insertedScores = await scoreModel.getOrCreate(rawDataArray);
      console.log(`${insertedScores.length} assessment scores inserted/upserted successfully.`); 
  } catch (error) {
      console.error('Error inserting assessment scores:', error.message);
      return error.message;
  }
}
