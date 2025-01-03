const { supabase } = require('../config/supabase');

class BaseModel {
  constructor(tableName) {
    this.table = supabase.from(tableName);
  }

 
  async getByUniqueField(field, value) {
    const { data, error } = await this.table.select('*').eq(field, value).single();
    if (error) {
      if (error.code === 'PGRST116') { // Row not found
        return null;
      }
      throw error;
    }
    return data;
  }

 
  async create(data) {
    const { data: newData, error } = await this.table.insert([data]).select().single();
    if (error) {
      throw error;
    }
    return newData;
  }


  async upsert(data, conflictFields) {
    const { data: upsertedData, error } = await this.table
      .upsert(data, { onConflict: conflictFields })
      .select()
      .single();
    if (error) {
      throw error;
    }
    return upsertedData;
  }
}

module.exports = BaseModel;
