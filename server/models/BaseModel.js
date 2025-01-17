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

  //I am making a function in baseModel so I can use it again and again, This function will fech data and put it in cache.
  async get(tableName, columns, options = {}) {
    try {
      if (!tableName || typeof tableName !== 'string') {
        throw new Error('Invalid table name provided.');
      }
  
      if (!Array.isArray(columns) || columns.length === 0) {
        throw new Error('Columns must be a non-empty array of strings.');
      }
  
      const selectColumns = columns.join(',');
  
      let query = supabase.from(tableName).select(selectColumns);
  
      if (options.filters && typeof options.filters === 'object') {
        for (const [key, value] of Object.entries(options.filters)) {
          query = query.eq(key, value);
        }
      }
  
      // Apply ordering if provided
      if (options.order && Array.isArray(options.order) && options.order.length === 2) {
        const [column, direction] = options.order;
        if (['asc', 'desc'].includes(direction.toLowerCase())) {
          query = query.order(column, { ascending: direction.toLowerCase() === 'asc' });
        }
      }
  
      // Apply limit if provided
      if (options.limit && typeof options.limit === 'number') {
        query = query.limit(options.limit);
      }
  
      const { data, error } = await query;
  
      if (error) {
        throw error;
      }
  
      return { data, error: null };
    } catch (error) {
      console.error(`Error fetching data from table "${tableName}":`, error.message);
      return { data: null, error };
    }
  }
  
  // Upsert a record (insert or update based on conflict fields)
  async upsert(data, conflictFields, selectColumns = '*') {
    try {
      if (!Array.isArray(data) && data !== null && typeof data === 'object') {
        // If a single object was passed in, wrap it in an array.
        data = [data];
      }
  
      if (data.length === 0) {
        console.log('No data to upsert.');
        return [];
      }
      console.log(this.table)
      const { data: upsertedData, error } = await this.table
        .upsert(data, { onConflict: conflictFields })
        .select(selectColumns); // <--- Use the optional columns
  
      if (error) {
        throw error;
      }
      
      console.log(`Record(s) upserted in "${this.table}":`, upsertedData);
      return upsertedData;
    } catch (error) {
      console.error(`Error upserting record(s) in "${this.table}":`, error);
      throw error;
    }
  }
  

  // Method to handle the insertion of gender and country and return their IDs
  async getOrCreateGender(genderName) {
    try {
      const gender = await this.lookupHelper.getOrCreateGender(genderName);
      return gender.gender_id; 
    } catch (error) {
      console.error(`Error in getOrCreateGender for "${genderName}":`, error);
      throw error;
    }
  }
  async getOrCreateLocation(countryid) {
    try {
      const location = await this.lookupHelper.getOrCreateLocation(countryid);
      return location.location_id; 
    } catch (error) {
      console.error(`Error in getOrCreatelocation for "${countryid}" , ${location_id}:`, error);
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
      // 1) Lookup or create the person
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
  removeDuplicatesAdvanced(array, fields, options = {}) {
    const { caseInsensitive = false, keep = 'first' } = options;
    const seenKeys = new Map();

    array.forEach(item => {
      // Generate composite key
      let key = fields.map(field => {
        let value = item[field] || '';
        value = String(value).trim();
        return caseInsensitive ? value.toLowerCase() : value;
      }).join('_');

      if (keep === 'first') {
        if (!seenKeys.has(key)) {
          seenKeys.set(key, item);
        }
      } else if (keep === 'last') {
        seenKeys.set(key, item); // Overwrite to keep the last occurrence
      }
    });

    return Array.from(seenKeys.values());
  }
}



module.exports = BaseModel;
