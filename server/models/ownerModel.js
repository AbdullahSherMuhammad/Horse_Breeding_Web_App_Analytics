// lookupHelper.js
const { supabase } = require('../config/supabase'); // Ensure correct path

class LookupHelper {
  constructor() {
    this.genders = [];   // Initialize as an array
    this.countries = []; // Initialize as an array
  }

  // Load initial genders and countries into the cache
  async loadInitialData() {
    try {
      const [gendersRes, countriesRes] = await Promise.all([
        supabase.from('genders').select('*'),
        supabase.from('countries').select('*')
      ]);

      if (gendersRes.error) {
        console.error('Error loading genders:', gendersRes.error);
        throw gendersRes.error;
      }

      if (countriesRes.error) {
        console.error('Error loading countries:', countriesRes.error);
        throw countriesRes.error;
      }

      this.genders = gendersRes.data;
      this.countries = countriesRes.data;

      console.log('Genders loaded into cache:', this.genders);
      console.log('Countries loaded into cache:', this.countries);
    } catch (error) {
      console.error('Failed to load initial data:', error);
      throw error;
    }
  }

  // Get or create a gender and return its ID
  async getOrCreateGender(genderName) {
    const normalizedGender = genderName.toLowerCase();
    let gender = this.genders.find(g => g.name.toLowerCase() === normalizedGender);

    if (gender) {
      console.log(`Gender "${genderName}" found with ID: ${gender.id}`);
      return { gender_id: gender.id };
    }

    // Upsert gender to handle duplicates gracefully
    try {
      const { data, error } = await supabase
        .from('genders')
        .upsert([{ name: genderName }], { onConflict: 'name' }) // Assuming 'name' is unique
        .select('id')
        .single();

      if (error) {
        throw new Error(`Error upserting gender: ${error.message}`);
      }

      // Update cache
      this.genders.push({ name: genderName, id: data.id });
      console.log(`Gender "${genderName}" created with ID: ${data.id}`);

      return { gender_id: data.id };
    } catch (error) {
      throw new Error(`Error inserting gender: ${error.message}`);
    }
  }

  // Get or create a country and return its ID
  async getOrCreateCountry(countryName) {
    const normalizedCountry = countryName.toLowerCase();
    let country = this.countries.find(c => c.name.toLowerCase() === normalizedCountry);

    if (country) {
      console.log(`Country "${countryName}" found with ID: ${country.id}`);
      return { country_id: country.id };
    }

    // Upsert country to handle duplicates gracefully
    try {
      const { data, error } = await supabase
        .from('countries')
        .upsert([{ name: countryName }], { onConflict: 'name' }) // Assuming 'name' is unique
        .select('id')
        .single();

      if (error) {
        throw new Error(`Error upserting country: ${error.message}`);
      }

      // Update cache
      this.countries.push({ name: countryName, id: data.id });
      console.log(`Country "${countryName}" created with ID: ${data.id}`);

      return { country_id: data.id };
    } catch (error) {
      throw new Error(`Error inserting country: ${error.message}`);
    }
  }
}

module.exports = LookupHelper;
