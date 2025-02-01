// BaseModel.js
const { supabase } = require('../config/supabase'); // Ensure correct path
const LookupHelper = require('./lookupHelper'); 

class BaseModel {
  constructor(tableName) {
    this.table = supabase.from(tableName);
    this.lookupHelper = new LookupHelper();
  }

  static async create(tableName) {
    const instance = new BaseModel(tableName);
    await instance.lookupHelper.loadInitialData();
    return instance;
  }

   removeDateAfterComma(input) {
    // Regex to match ", [optional words] til [number]-[number]"
    const regex = /,\s*(?:\w+\s+)*?(?:til\s+)?(?:0|[1-9]|[12]\d|30)\D+(?:0|[1-9]|[12]\d|30)/g;
    return input.replace(regex, '').trim();
  }
  
  // Get a record by a unique field
  async getByUniqueField(field, value) {
    try {
      const { data, error } = await this.table.select('*').eq(field, value).single();
      if (error) {
        if (error.code === 'PGRST116') { // Row not found
          return null;
        }
        throw error;
      }
      return data;
    } catch (error) {
      console.error(`Error fetching by ${field}:`, error);
      throw error;
    }
  }

  async get(tableName, columns, options = {}) {
    try {
        if (!tableName || typeof tableName !== 'string') {
            throw new Error('Invalid table name provided.');
        }

        if (!Array.isArray(columns) || columns.length === 0) {
            throw new Error('Columns must be a non-empty array of strings.');
        }

        const selectColumns = columns.join(',');
        let allData = [];
        let offset = 0;
        const limit = 1000;

        while (true) {
            let query = supabase.from(tableName).select(selectColumns).range(offset, offset + limit - 1);

            if (options.filters && typeof options.filters === 'object') {
                for (const [key, value] of Object.entries(options.filters)) {
                    console.log(`Applying filter: ${key} = ${value}`); 
                    query = query.eq(key, value);
                }
            }

            if (options.order && Array.isArray(options.order) && options.order.length === 2) {
                const [column, direction] = options.order;
                if (['asc', 'desc'].includes(direction.toLowerCase())) {
                    query = query.order(column, { ascending: direction.toLowerCase() === 'asc' });
                }
            }
            const { data, error } = await query;

            if (error) {
                console.error(`Query Error:`, error.message);
                throw error;
            }

            if (data.length === 0) {
                break; 
            }

            allData = allData.concat(data);
            offset += limit;
        }

        return { data: allData, error: null };
    } catch (error) {
        console.error(`Error fetching data from table "${tableName}":`, error.message);
        return { data: null, error };
    }
}

  async upsert(data, conflictFields, selectColumns = '*') {
    try {
      if (!Array.isArray(data) && data !== null && typeof data === 'object') {
        data = [data];
      }
  
      if (data.length === 0) {
        console.log('No data to upsert.');
        return [];
      }
      const { data: upsertedData, error } = await this.table
        .upsert(data, { onConflict: conflictFields })
        .select(selectColumns); 
  
      if (error) {
        throw error;
      }
      
      return upsertedData;
    } catch (error) {
      throw error;
    }
  }
  

  async getOrCreateGender(genderName, horse_id) {
    try {
      const gender = await this.lookupHelper.getOrCreateGender(genderName);
      return gender.gender_id; 
    } catch (error) {
      console.error(`Error in getOrCreateGender for "${genderName} , for horse feif_id ${horse_id}":`, error);
      return error;
    }
  }
  async getOrCreateLocation(countryid, horse_id) {
    try {
      const location = await this.lookupHelper.getOrCreateLocation(countryid);
      return location.location_id; 
    } catch (error) {
      console.error(`Error in getOrCreatelocation for "${countryid}" , ${location_id}: , for horse feif_id ${horse_id}":`, error);
      throw error;
    }
  }
  async getOrCreateCountry(countryName) {
    try {
      const country = await this.lookupHelper.getOrCreateCountry(countryName);
      return country.country_id; 
    } catch (error) {
      console.error(`Error in getOrCreateCountry for "${countryName}":`, error);
      throw error;
    }
  }
  async getOrCreatePersonRole(personName, ID=null, countryname, roleType) {
    try {
      const { data: existingPerson, error: findPersonError } = await supabase
        .from('person')
        .select('person_id')
        .eq('name', personName)
        .single(); 
  
      if (findPersonError && findPersonError.code !== 'PGRST116') {
        throw new Error(`Error finding person: ${findPersonError.message}`);
      }
  
      let personId;
      const country_id = await this.getOrCreateCountry(countryname);
      if (!existingPerson) {
        const { data: newPerson, error: insertPersonError } = await supabase
          .from('person')
          .insert([{ name: personName,country_id:country_id, feif_id: ID }])
          .select('person_id')
          .single();
  
        if (insertPersonError) {
          throw new Error(`Error inserting person: ${insertPersonError.message}`);
        }
        personId = newPerson.person_id;
      } else {
        personId = existingPerson.person_id;
      }
  
      // 2) Lookup or create the person_role
      const { data: existingRole, error: findRoleError } = await supabase
        .from('person_role')
        .select('*')
        .eq('person_id', personId)
        .eq('role_type', roleType)
        .single();
  
      if (findRoleError && findRoleError.code !== 'PGRST116') {
        throw new Error(`Error finding person_role: ${findRoleError.message}`);
      }
  
      let personRole;
      if (!existingRole) {
        const { data: newRole, error: insertRoleError } = await supabase
          .from('person_role')
          .insert([{ person_id: personId, role_type: roleType }])
          .select('person_role_id')
          .single();
  
        if (insertRoleError) {
          throw new Error(`Error inserting person_role: ${insertRoleError.message}`);
        }
        personRole = newRole;
      } else {
        personRole = existingRole;
      }
  
      // 3) Return the person_role row
      return personRole;
    } catch (error) {
      console.error(`getOrCreatePersonRole("${personName}", "${roleType}") failed:`, error);
      throw error;
    }
  }
   removeDuplicatesAdvanced (array, fields, options = {}){
    const { caseInsensitive = false, keep = 'first' } = options;
    const seenKeys = new Map();
    const duplicates = [];
  
    array.forEach(item => {
      let key = fields.map(field => {
        let value = item[field] || '';
        value = String(value).trim();
        return caseInsensitive ? value.toLowerCase() : value;
      }).join('_');
  
      if (seenKeys.has(key)) {
        duplicates.push(item);
      }
  
      if (keep === 'first') {
        if (!seenKeys.has(key)) {
          seenKeys.set(key, item);
        }
      } else if (keep === 'last') {
        seenKeys.set(key, item); 
      }
    });
    // These two are for debugging to check if theduplicates are infact duplicates, comment one of either.
    console.log('Duplicates:', duplicates.length);
    // console.log('Duplicates:', duplicates);
  
    return Array.from(seenKeys.values());
  }
}
module.exports = BaseModel;