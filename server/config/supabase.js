const { createClient } = require("@supabase/supabase-js");
const { func } = require("joi");
require('dotenv').config(); 

const supabaseUrl = process.env.SUPABASEURL
const supabaseKey = process.env.SUPABASEKEY

const supabase = createClient(supabaseUrl, supabaseKey);



//This is my function to check Supabase filters at backed level before applying them to frontend side.

async function callAllHorseAnalysis(
    genderId = null,
    year = null,
    showId = null,
    farmId = null,
  ) {
    const { data, error } = await supabase.rpc('get_total_results_dynamic', {
      _gender_id: genderId,
      _year: year,
      _show_id: showId,
      _farm_id: farmId,
      _feif_ids: null
    });
  
    if (error) {
      console.error('Error calling all_horse_analysis:', error);
      throw error;
    }
  
    return data;
  }
  

  (async () => {
    try {

      const result = await callAllHorseAnalysis(null, null, null, null);
      console.log('Result from all_horse_analysis:', result);
    } catch (err) {
      console.error('Error in usage:', err);
    }
  })();
  
module.exports = { supabase };
