// controllers/dataImportController.js

const Horse = require('../models/horseModel');
const Owner = require('../models/ownerModel');
const Breeder = require('../models/breederModel');
const Farm = require('../models/farmModel');
const Country = require('../models/countryModel');
const Gender = require('../models/genderModel');
const { supabase } = require('../config/supabase');
const { parseDate } = require('../utils/dateChanger'); // Importing parseDate from helpers

class DataImportController {
  /**
   * Inserts or retrieves data into Supabase following the MVC pattern.
   * @param {object} data - The data object containing all necessary information.
   * @returns {string} - Success or error message.
   */
  async insertDataToSupabase(data) {
    try {
      const { basic_info, owner_info, beeder_info, breeding_info, offspring_info, blup_info } = data;

      // 1. Insert or Retrieve Farm
      let farm = null;
      if (basic_info["Farm ID number"]) {
        farm = await Farm.getOrCreate(
          basic_info["Farm ID number"],
          basic_info
        );
      }
      console.log('Farm:', farm);

      // 2. Insert or Retrieve Breeder
      let breeder = null;
      if (beeder_info && beeder_info.length > 0) {
        const breederData = beeder_info[0];
        // Prepare country data if available
        if (breederData.Country) {
          const country = await Country.getOrCreate(
            breederData.Country,
            { iso_code: breederData.Country, country_name: breederData.Country } // Adjust as necessary
          );
          breederData.country_id = country.country_id;
        }
        breeder = await Breeder.getOrCreate(
          breederData.Name,
          breederData
        );
      }
      console.log('Breeder:', breeder);

      // 3. Insert or Retrieve Gender
      let gender = null;
      gender = await Gender.getOrCreate(basic_info["Gender"]);
      console.log('Gender:', gender);

      // 4. Prepare Horse Data and Insert/Retrieve
      const horse = await Horse.getOrCreate(
        basic_info["FEIF ID"],
        {
          ...basic_info,
          farm_id: farm ? farm.farm_id : null,
          gender_id: gender ? gender.gender_id : null,
          breeder_id: breeder ? breeder.breeder_id : null,
          country_id: basic_info["Country of current location"] ? await Country.getOrCreate(
            basic_info["Country of current location"],
            { iso_code: basic_info["Country of current location"] }
          ).then(c => c.country_id) : null
        }
      );
      console.log('Horse:', horse);

      // 5. Link Owners to Horse
      for (const owner of owner_info) {
        // Prepare country data if available
        if (owner.Country) {
          const country = await Country.getOrCreate(
            owner.Country,
            { iso_code: owner.Country }
          );
          owner.country_id = country.country_id;
        }

        const ownerRecord = await Owner.getOrCreate(
          owner.Name,
          owner
        );
        console.log('Owner Record:', ownerRecord);

        // Parse ownership ratio and date
        const ownershipRatioStr = owner["Ratio (%)"];
        let ownershipRatio = null;
        if (ownershipRatioStr) {
          // Assuming ratio is in format "50%" or "50"
          ownershipRatio = parseFloat(ownershipRatioStr.replace('%', '').replace(',', '.'));
        }

        const dateOfRegistration = owner["Date of registration"] ? parseDate(owner["Date of registration"]) : null;

        // Insert into horse_owners
        await supabase
          .from('horse_owners')
          .upsert(
            {
              horse_owner_id: `${horse.horse_id}_${ownerRecord.owner_id}`, // Custom unique identifier
              horse_id: horse.horse_id,
              owner_id: ownerRecord.owner_id,
              ratio: ownershipRatio,
              date_created: dateOfRegistration,
            },
            { onConflict: ['horse_owner_id'] }
          )
          .select();

        console.log(`Linked Owner (${owner.Name}) to Horse (${horse.name})`);
      }

      // 6. Link Breeders to Horse
      for (const breederInfo of beeder_info) {
        // Prepare country data if available
        if (breederInfo.Country) {
          const country = await Country.getOrCreate(
            breederInfo.Country,
            { iso_code: breederInfo.Country }
          );
          breederInfo.country_id = country.country_id;
        }

        const breederRecord = await Breeder.getOrCreate(
          breederInfo.Name,
          breederInfo
        );
        console.log('Breeder Record:', breederRecord);

        // Parse breedership ratio
        const breedershipRatioStr = breederInfo["Ratio (%)"];
        let breedershipRatio = null;
        if (breedershipRatioStr) {
          breedershipRatio = parseFloat(breedershipRatioStr.replace('%', '').replace(',', '.'));
        }

        // Insert into horse_breeders
        await supabase
          .from('horse_breeders')
          .upsert(
            {
              horse_breeder_id: `${horse.horse_id}_${breederRecord.breeder_id}`, // Custom unique identifier
              horse_id: horse.horse_id,
              breeder_id: breederRecord.breeder_id,
              ratio: breedershipRatio,
            },
            { onConflict: ['horse_breeder_id'] }
          )
          .select();

        console.log(`Linked Breeder (${breederInfo.Name}) to Horse (${horse.name})`);
      }

      // 7. Insert BLUP Information
      const blupFields = {
        head: blup_info.Head ? parseFloat(blup_info.Head) : null,
        tolt: blup_info.Tölt ? parseFloat(blup_info.Tölt) : null,
        neck: blup_info.Neck ? parseFloat(blup_info.Neck) : null,
        trot: blup_info.Trot ? parseFloat(blup_info.Trot) : null,
        back: blup_info.Back ? parseFloat(blup_info.Back) : null,
        pace: blup_info.Pace ? parseFloat(blup_info.Pace) : null,
        proportions: blup_info.Proportions ? parseFloat(blup_info.Proportions) : null,
        gallop: blup_info.Gallop ? parseFloat(blup_info.Gallop) : null,
        legs: blup_info.Legs ? parseFloat(blup_info.Legs) : null,
        canter: blup_info.Canter ? parseFloat(blup_info.Canter) : null,
        joints: blup_info.Joints ? parseFloat(blup_info.Joints) : null,
        rideability: blup_info.Rideability ? parseFloat(blup_info.Rideability) : null,
        hooves: blup_info.Hooves ? parseFloat(blup_info.Hooves) : null,
        general_impression: blup_info["General impression"] ? parseFloat(blup_info["General impression"]) : null,
        mane_and_tail: blup_info["Mane and tail"] ? parseFloat(blup_info["Mane and tail"]) : null,
        walk: blup_info.Walk ? parseFloat(blup_info.Walk) : null,
        conformation: blup_info.Conformation ? parseFloat(blup_info.Conformation) : null,
        slow_tölt: blup_info["Slow tölt"] ? parseFloat(blup_info["Slow tölt"]) : null,
        total_score: blup_info["Total score"] ? parseFloat(blup_info["Total score"]) : null,
        ridden_abilities_w_o_pace: blup_info["Ridden abilities w/o pace"] ? parseFloat(blup_info["Ridden abilities w/o pace"]) : null,
        total_w_o_pace: blup_info["Total w/o pace"] ? parseFloat(blup_info["Total w/o pace"]) : null,
        height_at_withers: blup_info["Height at withers"] || null,
        accuracy: blup_info["Accuracy (%)"] ? parseFloat(blup_info["Accuracy (%)"].replace(',', '.')) : null,
        standard_deviation: blup_info["Standard deviation (+/-)"] ? parseFloat(blup_info["Standard deviation (+/-)"].replace(',', '.')) : null,
        blup_for_attendance_to_breeding_show: blup_info["BLUP for attendance to breeding show"] || null,
        inbreeding_coefficient: blup_info["Inbreeding coefficient (%)"] ? parseFloat(blup_info["Inbreeding coefficient (%)"].replace(',', '.')) : null,
        // Add other fields as necessary
      };

      console.log('BLUP Fields to Update:', blupFields);

      const { data: updatedHorse, error: blupError } = await supabase.from('horse')
        .update(blupFields)
        .eq('horse_id', horse.horse_id)
        .select()
        .single();

      if (blupError) {
        console.error('Error updating horse with BLUP information:', blupError);
        throw blupError;
      }

      console.log('Updated Horse with BLUP Information:', updatedHorse);
      return 'Data imported successfully!';
    } catch (error) {
      console.error('Error importing data:', error);
      throw error; // Re-throw the error to be handled by the route
    }
  }
}

module.exports = new DataImportController();
