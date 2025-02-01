const { supabase } = require('../config/supabase');

class LookupHelper {
    constructor() {
      this.genders = [];
      this.countries = [];
    }
  
    async loadInitialData() {
      // Fetch all genders
      const { data: genders, error: genderError } = await supabase.from("gender").select("*");
      if (genderError) throw new Error(`Error loading genders: ${genderError.message}`);
      this.genders = genders;
  
      // Fetch all countries
      const { data: countries, error: countryError } = await supabase.from("country").select("*");
      if (countryError) throw new Error(`Error loading countries: ${countryError.message}`);
      this.countries = countries;

      const { data: locations, error: locationError } = await supabase.from("location").select("*");
      if (locationError) throw new Error(`Error loading locations: ${locationError.message}`);
      this.locations = locations;


      console.log(genders, countries, locations)
      console.log("Initial data loaded for genders and countries.");
    }
  
    async getOrCreateGender(genderName) {
      let gender = this.genders.find((g) => g.gender_description.toLowerCase() === genderName.toLowerCase());
      if (!gender) {
        const { data: newGender, error } = await supabase
          .from("gender")
          .insert([{ gender_description: genderName }])
          .select()
          .single();
  
        if (error) throw new Error(`Error inserting gender: ${error.message}`);
        this.genders.push(newGender); // Update local cache
        gender = newGender;
      }
      return gender;
    }

    async getOrCreateLocation(countryId) {
      console.log("here")
      let location = this.locations.find((loc) => loc.country_id === countryId);
      console.log("Herex2")
      if (!location) {
        const { data: newLocation, error } = await supabase
          .from("location") 
          .insert([{ country_id: countryId }]) 
          .select()
          .single();
    
        if (error) {
          throw new Error(`Error inserting location: ${error.message}`);
        }
    
        this.locations.push(newLocation);
        location = newLocation;
      }
    
     return location;
    }
      
    async getOrCreateCountry(countryName) {
      let country = this.countries.find((c) => c.iso_code.toLowerCase() === countryName.toLowerCase());
      if (!country) {
        const { data: newCountry, error } = await supabase
          .from("country")
          .insert([{ iso_code: countryName, country_name: countryName }])
          .select()
          .single();
  
        if (error) throw new Error(`Error inserting country: ${error.message}`);
        this.countries.push(newCountry); // Update local cache
        country = newCountry;
      }
      return country;
    }
  }
  
module.exports = LookupHelper;