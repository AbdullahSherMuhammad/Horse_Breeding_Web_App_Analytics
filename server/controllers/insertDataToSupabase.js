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



const { blupInfo } = require("./blupinfoToSupabase");
const { horse_farm } = require("./horse_farmToSupabase");
const { horse_show } = require("./horse_showToSupabase");
const { farms } = require("./insertFarmToSupabase");
const { horses } = require("./insertHorsesToSupabase");
const { shows } = require("./insertShowsToSupabase");
const { show_participant } = require("./showparticipantsToSupabase");
async function insertDataToSupabase(dataArray) {
  const rawbasicinfo = [];
  const rawbreedinginfo= [];
  const rawblupinfo = [];
  console.log(dataArray.length, "length of data array"
  );
  for (const data of dataArray) {
    try {
      const { basic_info, owner_info, beeder_info, breeding_info, offspring_info, blup_info } = data;
      rawbasicinfo.push(basic_info);
      rawbreedinginfo.push(breeding_info);
      rawblupinfo.push(blup_info);
    } catch (error) {
      console.error('Error processing data entry:', error.message);
      continue;
    }
  }
  // horses(rawbasicinfo)
  // farms(rawbasicinfo);
  // shows(rawbreedinginfo);
  // horse_farm(rawbasicinfo);
  // horse_show(rawbreedinginfo);
  //blupInfo(rawblupinfo)
  show_participant(rawbreedinginfo);
}
  
module.exports = {
  insertDataToSupabase,
};
