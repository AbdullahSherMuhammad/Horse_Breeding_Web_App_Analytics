const { createClient } = require("@supabase/supabase-js");
require('dotenv').config(); 

const supabaseUrl = process.env.SUPABASEURL
const supabaseKey = process.env.SUPABASEKEY

const supabase = createClient(supabaseUrl, supabaseKey);
// console.log(supabase, "just to  check connection");
// start = async() => {
// const { data: horses, error: horseError } = await supabase.from("horse").select("horse_id").eq("place_holder", true);
// console.log(horses.length)
// }
// start()

// async function fetchPage(viewName, pageNumber, pageSize) {
//     const start = (pageNumber - 1) * pageSize;
//     const end = start + pageSize - 1;
  
//     const { data, error, count } = await supabase
//       .from(viewName)
//       .select('*', { count: 'exact' }) // Include count metadata
//       .range(start, end);
  
//     if (error) {
//       console.error('Error fetching data:', error);
//       return { error };
//     }
  
//     const totalPages = Math.ceil(count / pageSize);
  
//     return {
//       data,
//      totalRecords: count,
//        totalPages,
//        currentPage: pageNumber,
//     };
//   }
  
  // Usage
  // fetchPage('parent_offspring_agg', 1, 20).then((result) => console.log(result));
  
module.exports = { supabase };
