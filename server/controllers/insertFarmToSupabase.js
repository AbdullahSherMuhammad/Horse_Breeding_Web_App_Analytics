// import { supabase } from '../config/supabase';

// /**
//  * Inserts the given data array into the 'horse_table' on Supabase.
//  *
//  * @param data - An array of objects to be inserted
//  */
// export async function insertDataToSupabase(data: Record<string, any>[]): Promise<void> {
//   try {
//     const { error } = await supabase
//       .from('horse_table')
//       .insert(data);

//     if (error) {
//       throw error;
//     }
//     console.log('Data inserted successfully.');
//   } catch (err: unknown) {
//     if (err instanceof Error) {
//       console.error('Error inserting data into Supabase:', err.message);
//     } else {
//       console.error('Error inserting data into Supabase:', err);
//     }
//   }
// }
// insertDataToSupabase.js


const Farm = require('../models/farmModel')

exports.farms = async(rawDataArray) => {
  try {
      const FarmModel = await Farm.create();
      const insertedfarms = await FarmModel.getOrCreate(rawDataArray);
      console.log(insertedfarms.length, ' farms inserted/upserted successfully.');
    } catch (error) {
      console.error('Error inserting Farm data:', error.message);
      return error.message;
    }
  }