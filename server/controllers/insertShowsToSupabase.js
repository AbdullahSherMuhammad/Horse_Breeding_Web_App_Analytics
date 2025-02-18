const chalk = require("chalk");
const Show = require("../models/showModel");

exports.shows = async(rawDataArray) => {
  try {
      const ShowModel = await Show.create();
      const insertedshows = await ShowModel.getOrCreate(rawDataArray);
      console.log(chalk.green (insertedshows.length, ' shows inserted/upserted successfully.'));
    } catch (error) {
      console.error('Error inserting shows data:', error.message);
      return error.message;
    }
  }