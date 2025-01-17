// Show_participant.js (or similarly named)
const BaseModel = require('./BaseModel');
const { parseDate } = require('../utils/dateChanger');
const { logMessage } = require('../utils/logger');

class Show_participant extends BaseModel {
  constructor() {
    super('show_participant');
  }

  static async create() {
    const instance = new Show_participant();
    await instance.lookupHelper.loadInitialData(); // or any other init logic
    return instance;
  }

  async getOrCreate(rawDataArray) {
    try {
      const showParticipantsData = await this.prepareData(rawDataArray);

      console.log(
        `Preparing to insert/upsert ${showParticipantsData.length} show_participant associations.`
      );

      if (showParticipantsData.length === 0) {
        console.log('No valid associations to insert/upsert.');
        return [];
      }

      const upserted = await this.upsert(
        showParticipantsData,
        ['person_role_id', 'show_id', 'horse_id'],
        '*'
      );
      return upserted;
    } catch (error) {
      console.error('Error in getOrCreate:', error.message);
      throw error;
    }
  }

  async prepareData(assessmentData) {
    const flattenedData = assessmentData.flat();
    console.log(`Flattened data length: ${flattenedData.length}`);

    const showParticipantRiders = [];
    const showParticipantTrainers = [];
    const showParticipantJudges = [];

    const horsesResult = await this.get('horse', ['horse_id', 'feif_id']);
    const horses = horsesResult.data || [];
    console.log(`Fetched ${horses.length} horses.`);

    const showsResult = await this.get('show', ['show_id', 'show_name']);
    const shows = showsResult.data || [];
    console.log(`Fetched ${shows.length} shows.`);

    const feifIdToHorseIdMap = new Map();
    horses.forEach((horse) => {
      if (horse.feif_id && horse.horse_id) {
        feifIdToHorseIdMap.set(horse.feif_id, horse.horse_id);
      }
    });

    const showIdToShowNameMap = new Map();
    shows.forEach((show) => {
      if (show.show_id && show.show_name) {
        showIdToShowNameMap.set(show.show_name, show.show_id);
      }
    });

    for (const raw of flattenedData) {
      const assessment = raw.Assessment;
      if (!assessment) continue;

      const showName = assessment.Show?.Name;
      const show_id = showIdToShowNameMap.get(showName);
      if (!show_id) {
        console.warn(
          `Show with name "${showName}" not found. Skipping entry.`
        );
        continue;
      }

      const horseFeif = assessment.Horse?.ID;
      const horse_id = feifIdToHorseIdMap.get(horseFeif);
      if (horseFeif && !horse_id) {
        console.warn(
          `Horse with FEIF ID "${horseFeif}" not found. Skipping entry.`
        );
      }

      const riderID = assessment.Rider?.ID;   
      const riderName = assessment.Rider?.Name;
      if (riderID && riderName) {
        const riderRole = await this.getOrCreatePersonRole(
          riderName,    
          riderID,     
          'IS',        
          'rider'       
        );
        console.log(riderRole)
        if (riderRole && riderRole.person_role_id && horse_id) {
          showParticipantRiders.push({
            show_id,
            horse_id,
            person_role_id: riderRole.person_role_id
          });
          console.log("rider inserted")
        }
      }

      const trainerID = assessment.Trainer?.ID;   
      const trainerName = assessment.Trainer?.Name;
      if(!trainerName)
      {
        logMessage("trainer_doesn't exist", `The trainer for horse ${horseFeif} for show ${showName} doesn't exist, please verify. Also Rider ${riderName} exists. `)
        
      }
      if (trainerName) {
        const normalizedTrainerID = trainerID?.trim() || null;

        const trainerRole = await this.getOrCreatePersonRole(
          trainerName,
          normalizedTrainerID,
          'IS',
          'trainer'
        );
        if (trainerRole && trainerRole.person_role_id && horse_id) {
          showParticipantTrainers.push({
            show_id,
            horse_id,
            person_role_id: trainerRole.person_role_id

          });
          console.log("trainer exerted")
        }
      }

      const chiefJudgeID = assessment.Judges?.Chief_Judge?.ID;
      const chiefJudgeName = assessment.Judges?.Chief_Judge?.Name;
      if (chiefJudgeID && chiefJudgeName) {
        const chiefJudgeRole = await this.getOrCreatePersonRole(
          chiefJudgeName,
          chiefJudgeID,
          'IS',
          'chief_judge'
        );
        if (chiefJudgeRole && chiefJudgeRole.person_role_id) {
          showParticipantJudges.push({
            show_id,
            horse_id: null, 
            person_role_id: chiefJudgeRole.person_role_id
          });
        }
      }

      const judgesList = assessment.Judges?.Judges_List || [];
      for (const judge of judgesList) {
        if (judge?.ID && judge?.Name) {
          const judgeRole = await this.getOrCreatePersonRole(
            judge.Name,
            judge.ID,
            'IS',
            'judge'
          );
          if (judgeRole && judgeRole.person_role_id) {
            showParticipantJudges.push({
              show_id,
              horse_id: null,
              person_role_id: judgeRole.person_role_id
            });
          }
        }
      }
    }
    console.log(showParticipantRiders)
    console.log(showParticipantTrainers)
    console.log(showParticipantJudges)
    const uniqueRiders = this.removeDuplicatesAdvanced(
      showParticipantRiders,
      ['show_id', 'horse_id', 'person_role_id'],
      { caseInsensitive: false, keep: 'first' }
    );
    const uniqueTrainers = this.removeDuplicatesAdvanced(
      showParticipantTrainers,
      ['show_id', 'horse_id', 'person_role_id'],
      { caseInsensitive: false, keep: 'first' }
    );
    const uniqueJudges = this.removeDuplicatesAdvanced(
      showParticipantJudges,
      ['show_id', 'horse_id', 'person_role_id'],
      { caseInsensitive: false, keep: 'first' }
    );

    const finalArray = [
      ...uniqueRiders,
      ...uniqueTrainers,
      ...uniqueJudges,
    ];

    console.log(
      `Riders: ${uniqueRiders.length}, Trainers: ${uniqueTrainers.length}, Judges: ${uniqueJudges.length}`
    );
    console.log(`Total combined entries: ${finalArray.length}`);

    return finalArray;
  }

}

module.exports = Show_participant;
