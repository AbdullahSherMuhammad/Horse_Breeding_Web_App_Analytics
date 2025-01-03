const { createClient } = require("@supabase/supabase-js");
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file
const result = dotenv.config({ path: path.resolve(__dirname, '../.env') }); // Adjust the path if necessary



const supabaseUrl = process.env.SUPABASEURL;
const supabaseKey = process.env.SUPABASEKEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing SUPABASEURL or SUPABASEKEY in environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
console.log("Supabase is Connected");

module.exports = { supabase };
