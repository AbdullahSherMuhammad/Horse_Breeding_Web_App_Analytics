const { supabase } = require('../config/supabase');
const BaseModel = require('./BaseModel');

class HorseShareholder extends BaseModel {
  constructor() {
    super('horse_shareholder');
    this.roleMap = new Map();
    this.personMap = new Map();
    this.horseMap = new Map();
  }

 
  static async create() {
    const instance = new HorseShareholder();
    await instance.initializeMaps();
    return instance;
  }

 
  async initializeMaps() {
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

      const horseResult = await this.get('horse', ['horse_id', 'feif_id']);
      const horses = horseResult.data || [];
      horses.forEach((horse) => {
        if (horse.horse_id && horse.feif_id) {
          this.horseMap.set(horse.feif_id, horse.horse_id);
        }
      });

      console.log(`Initialized roleMap with ${this.roleMap.size} roles.`);
      console.log(`Initialized personMap with ${this.personMap.size} persons having feif_id.`);
      console.log(`Initialized horseMap with ${this.horseMap.size} horses having feif_id.`);
    } catch (error) {
      console.error('Error initializing maps:', error.message);
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
            onConflict: ['name'],
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

 
  async getHorseId(horseFeifId) {
    return this.horseMap.get(horseFeifId) || null;
  }

 
  async getOrCreate(rawDataArray) {
    try {
      const horseShareholdersData = await this.prepareData(rawDataArray);

      console.log(
        `Preparing to insert/upsert ${horseShareholdersData.length} horse_shareholder records.`
      );

      if (horseShareholdersData.length === 0) {
        console.log('No valid horse_shareholder records to insert/upsert.');
        return [];
      }

      const upsertedShareholders = await this.upsert(
        horseShareholdersData,
        ['horse_id', 'person_id', 'role_id']
      );

      console.log(`Upserted ${upsertedShareholders.length} horse_shareholder records.`);
      return upsertedShareholders;
    } catch (error) {
      console.error('Error in getOrCreate:', error.message);
      throw error;
    }
  }

 
  async prepareData(rawData) {
    const flattenedData = rawData.flat();
    console.log(`Flattened data length: ${flattenedData.length}`);

    const horseShareholderEntries = [];

    for (const raw of flattenedData) {
      const shareholder = raw.Shareholder;
      if (!shareholder) continue;

      const horseFeifId = shareholder.HorseID;
      const horse_id = horseFeifId ? await this.getHorseId(horseFeifId) : null;

      if (!horse_id) {
        console.warn(`Horse with FEIF ID "${horseFeifId}" not found. Skipping shareholder entry.`);
        continue;
      }

      const personName = shareholder.Person?.Name;
      const personFeifId = shareholder.Person?.ID;
      const roleName = shareholder.Role;
      const ratio = shareholder.Ratio;
      const dateOfRegistration = shareholder.DateOfRegistration;

      if (!personName || !roleName) {
        console.warn('Person name and role are required. Skipping shareholder entry.');
        continue;
      }

      const role_id = await this.getRoleId(roleName.toLowerCase());
      if (!role_id) {
        console.warn(`Role "${roleName}" not found. Skipping shareholder entry.`);
        continue;
      }

      if (ratio !== null && (isNaN(ratio) || ratio < 0 || ratio > 100)) {
        console.warn(`Invalid ratio "${ratio}". It must be between 0 and 100. Skipping shareholder entry.`);
        continue;
      }

      const person_id = await this.getOrCreatePersonId(personName, personFeifId);
      if (!person_id) {
        console.warn(`Failed to get or create person ID for "${personName}". Skipping shareholder entry.`);
        continue;
      }

      horseShareholderEntries.push({
        horse_id,
        person_id,
        role_id,
        ratio: ratio !== undefined ? ratio : null,
        date_of_registration: dateOfRegistration ? new Date(dateOfRegistration) : null,
      });
    }

    const uniqueEntries = this.removeDuplicatesAdvanced(
      horseShareholderEntries,
      ['horse_id', 'person_id', 'role_id'],
      { caseInsensitive: false, keep: 'first' }
    );

    console.log(`Total unique horse_shareholder entries after deduplication: ${uniqueEntries.length}`);
    if (uniqueEntries.length > 0) {
      console.log('Sample HorseShareholder Entry:', uniqueEntries[0]);
    }

    return uniqueEntries;
  }

  /**
   * Removes duplicate entries based on specified keys.
   * @param {Array} data - Array of objects to deduplicate.
   * @param {Array} keys - Array of keys to consider for duplication.
   * @param {Object} options - Options for deduplication.
   * @returns {Array} - Array with duplicates removed.
   */
  removeDuplicatesAdvanced(data, keys, options = {}) {
    const seen = new Set();
    return data.filter((item) => {
      const key = keys.map(k => item[k]).join('|').toLowerCase();
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }
}

module.exports = HorseShareholder;
