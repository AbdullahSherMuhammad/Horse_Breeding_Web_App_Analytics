const { supabase } = require('../config/supabase');
const BaseModel = require('./BaseModel');



class Show_participant extends BaseModel {
  constructor() {
    super('show_participant');
    this.roleMap = new Map(); 
    this.personMap = new Map();
  }


  static async create() {
    const instance = new Show_participant();
    await instance.initializeRoles(); 
    return instance;
  }

  async initializeRoles() {
    try {
      const rolesResult = await this.get('role', ['role_id', 'role_name']);
      const roles = rolesResult.data || [];
      roles.forEach((role) => {
        if (role.role_id && role.role_name) {
          this.roleMap.set(role.role_name.toLowerCase(), role.role_id);
        }
      });

      const personResult = await this.get('person', ['person_id', 'name', 'feif_id']);
      const persons = personResult.data || [];
      persons.forEach((person) => {
        if (person.person_id && person.name && person.feif_id) {
          this.personMap.set(person.feif_id, person.person_id);
        }
      });

      console.log(`Initialized roleMap with ${this.roleMap.size} roles.`);
      console.log(`Initialized personMap with ${this.personMap.size} persons having feif_id.`);
    } catch (error) {
      console.error('Error initializing roles and persons:', error.message);
      throw error;
    }
  }

  async getOrCreatePersonId(personName, feif_id = null, country_id = 1) {
    if (!personName) {
      console.warn('Person name is required to get or create person_id.');
      return null;
    }

    if (feif_id) {
      if (this.personMap.has(feif_id)) {
        return this.personMap.get(feif_id);
      }

      const { data, error } = await supabase
        .from("person")
        .upsert(
          [{ name: personName, feif_id, country_id }],
          {
            onConflict: ['feif_id'],
            returning: 'representation',
          }
        );

      if (error) {
        console.error(`Error upserting person "${personName}" with FEIF ID "${feif_id}":`, error.message);
        return null;
      }

      if (data && data.length > 0) {
        const person = data[0];
        if (person.feif_id) {
          this.personMap.set(person.feif_id, person.person_id);
        }
        return person.person_id;
      }

      console.warn(`Upsert returned no data for person "${personName}" with FEIF ID "${feif_id}".`);
      return null;
    } else {
      const { data, error } = await supabase
        .from("person")
        .insert(
          [{ name: personName, feif_id: null, country_id }],
          { returning: 'representation' }
        );

      if (error) {
        console.error(`Error inserting person "${personName}":`, error.message);
        return null;
      }

      if (data && data.length > 0) {
        const person = data[0];
        return person.person_id;
      }

      console.warn(`Insert returned no data for person "${personName}".`);
      return null;
    }
  }

  async getRoleId(roleName) {
    return this.roleMap.get(roleName.toLowerCase()) || null;
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
      const upsertedparticipants =  await this.upsert(showParticipantsData[0], ['person_id', 'role_id', 'show_id', 'horse_id']);
      console.log(showParticipantsData[1].length);
      const {data: showjudge, error: error} = await supabase.from("show_judge").upsert(
        showParticipantsData[1],
        {
          onConflict: ['person_id', 'role_id', 'show_id'],
          returning: 'representation',
        }
      );
      if (error) {
        console.error('Error upserting show_participant:', error.message);
        throw error;
      }
      return showParticipantsData[0].length + showParticipantsData[1].length;

    } catch (error) {
      console.error('Error in getOrCreate:', error.message);
      throw error;
    }
  }


  async prepareData(assessmentData) {
    const flattenedData = assessmentData.flat();
    console.log(`Flattened data length: ${flattenedData.length}`);
  
    const showParticipantEntries = [[], []];
  
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
  
    const showNameToShowIdMap = new Map();
    shows.forEach((show) => {
      if (show.show_id && show.show_name) {
        showNameToShowIdMap.set(show.show_name.toLowerCase(), show.show_id);
      }
    });
  
    for (const raw of flattenedData) {
      const assessment = raw.Assessment;
      if (!assessment) continue;
  
      const showName = assessment.Show?.Name;
      const show_id = showName ? showNameToShowIdMap.get(showName.toLowerCase()) : null;
      if (!show_id) {
        console.warn(`Show with name "${showName}" not found. Skipping entry.`);
        continue;
      }
  
      const horseFeif = assessment.Horse?.ID;
      let horse_id = null;
      if (horseFeif) {
        horse_id = feifIdToHorseIdMap.get(horseFeif);
        if (!horse_id) {
          console.warn(
            `Horse with FEIF ID "${horseFeif}" not found. Assigning horse_id = NULL.`
          );
          horse_id = null; 
        }
      }
  
      for (const role of ['Rider', 'Trainer']) {
        const personName = assessment[role]?.Name;
        const personFeifId = assessment[role]?.ID; 
        if (personName) {
          const role_id = await this.getRoleId(role.toLowerCase());
          if (role_id && (horse_id !== null || role.toLowerCase() === 'trainer')) {
            const person_id = await this.getOrCreatePersonId(personName, personFeifId);
            if (person_id) {
              showParticipantEntries[0].push({ 
                show_id,
                horse_id,
                person_id,
                role_id,
              });
            }
          }
        }
      }
  
      const chiefJudgeName = assessment.Judges?.Chief_Judge?.Name;
      const chiefJudgeFeifId = assessment.Judges?.Chief_Judge?.ID;
      if (chiefJudgeName) {
        const role_id = await this.getRoleId('chief_judge');
        if (role_id) {
          const person_id = await this.getOrCreatePersonId(chiefJudgeName, chiefJudgeFeifId);
          if (person_id) {
            showParticipantEntries[1].push({
              show_id,
              person_id,
              role_id,
            });
          }
        }
      }
  
      const judgesList = assessment.Judges?.Judges_List || [];
      for (const judge of judgesList) {
        const judgeName = judge?.Name;
        const judgeFeifId = judge?.ID;
        if (judgeName) {
          const role_id = await this.getRoleId('judge');
          if (role_id) {
            const person_id = await this.getOrCreatePersonId(judgeName, judgeFeifId);
            if (person_id) {
              showParticipantEntries[1].push({ 
                show_id,
                person_id,
                role_id,
              });
            }
          }
        }
      }
    }
  
    const uniqueEntries = [
      this.removeDuplicatesAdvanced(
        showParticipantEntries[0],
        ['show_id', 'horse_id', 'person_id', 'role_id'],
        { caseInsensitive: false, keep: 'first' }
      ),
      this.removeDuplicatesAdvanced(
        showParticipantEntries[1],
        ['show_id', 'person_id', 'role_id'],
        { caseInsensitive: false, keep: 'first' }
      )
    ];
  
    console.log(`Total combined entries after deduplication: ${uniqueEntries[0].length + uniqueEntries[1].length}`);

  
    return uniqueEntries; 
  }
  
}

module.exports = Show_participant;
