const share_participant = require('../models/share_participant')

exports.share_participant = async (rawDataArray) => {
  try {
    console.log("here")

    const share_participant = await share_participant.create();

    const share_participantresult = await share_participant.getOrCreate(rawDataArray);

    console.log(`${share_participantresult.length} show_participant associations inserted/upserted successfully.`);
    return `${share_participantresult.length} show_participant associations inserted/upserted successfully.`;
  } catch (error) {
    console.error('Error inserting show_participant data:', error.message);
    return `Error inserting show_participant data: ${error.message}`;
  }
}