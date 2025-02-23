const chalk = require('chalk');
const Show_participant = require('../models/showParticipant')

exports.show_participant = async (rawDataArray) => {
  try {

    const show_participantInstance = await Show_participant.create();

    const insertedshow_participant = await show_participantInstance.getOrCreate(rawDataArray);

    console.log(chalk.green (`${insertedshow_participant} show_participant associations inserted/upserted successfully.`));
  } catch (error) {
    console.error('Error inserting show_participant data:', error.message);
    return `Error inserting show_participant data: ${error.message}`;
  }
}