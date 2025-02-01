const BaseModel = require('./BaseModel');
const { parseDate } = require('../utils/dateChanger');

/**
 * Utility function to remove date-related portions from a show name string.
 * @param {string} input - The input string containing the show name and dates.
 * @returns {string} - The show name without the date portion.
 */


///I have transported this function to BaseModel As It was needed at many places. However I have not commented it out.
function removeDateAfterComma(input) {
  // Regex to match ", [optional words] til [number]-[number]"
  const regex = /,\s*(?:\w+\s+)*?(?:til\s+)?(?:0|[1-9]|[12]\d|30)\D+(?:0|[1-9]|[12]\d|30)/g;
  return input.replace(regex, '').trim();
}

/**
 * Utility function to extract the location name from a show name string.
 * @param {string} showNameFull - The full show name string containing the event type and location.
 * @returns {string} - The extracted location name, or 'Unknown Location' if not found.
 */
function extractLocationName(showNameFull) {
  // Define the regex pattern with named capture group 'location'
  const regex = /^[A-Za-záðéíóúýþæöÁÐÉÍÓÚÝÞÆÖ\s]+\s+(?:í|við|at)\s+(?<location>[^,]+)/i;
  
  // Execute the regex on the input string
  const match = showNameFull.match(regex);
  
  // If a match is found, return the captured 'location' group, trimmed
  if (match && match.groups && match.groups.location) {
    return match.groups.location.trim();
  }
  
  // Return a default value if no match is found
  return 'Unknown Location';
}

class Show extends BaseModel {
  constructor() {
    super('show');
  }

  static async create() {
    const instance = new Show();
    await instance.lookupHelper.loadInitialData();
    return instance;
  }

  async prepareData(breedingInfoArray) {
    const showsToInsert = [];

    try {
      const flattenedBreedingInfo = breedingInfoArray.flat();
      for (const rawdata of flattenedBreedingInfo) {
        const showName = rawdata.Assessment.Show.Name; // e.g., "Miðsumarssýning Rangárbökkum við Hellu, 17.-21. júlí."
        // const showName = removeDateAfterComma(showNameFull); // "Miðsumarssýning Rangárbökkum við Hellu"
        const startDateStr = rawdata.Assessment.Show.Date.Start; // "03.06.2024"
        const endDateStr = rawdata.Assessment.Show.Date.End; // "07.06.2024"
        const code = rawdata.Assessment.Show.Iceland_FIZO_FEIF?.Code || null; // "FIZO 2020"
        const ratio = rawdata.Assessment.Show.Iceland_FIZO_FEIF?.Ratio || null; // "35% / 65%"

        // Parse dates from "DD.MM.YYYY" to JavaScript Date objects
        const startDate = parseDate(startDateStr);
        const endDate = parseDate(endDateStr);

        // Extract location name from showNameFull
        // const locationName = extractLocationName(showNameFull); // "Rangárbökkum við Hellu"

        // Retrieve or create the country and location IDs
        const countryId = await this.getOrCreateCountry("IS"); 
        const locationId = await this.getOrCreateLocation(countryId);

        // Push the prepared show object
        showsToInsert.push({
          show_name: showName, 
          start_date: startDate, 
          end_date: endDate, 
          code: code, 
          ratio: ratio, 
          location_id: locationId, 
        });
      }

      // Remove duplicates based on 'show_name' and 'start_date'
      const uniqueShows = this.removeDuplicatesAdvanced(showsToInsert, ['show_name', 'start_date'], { caseInsensitive: true, keep: 'first' });

      return uniqueShows;

    } catch (error) {
      console.error('Error in prepareData:', error);
      throw error; // Re-throw the error after logging it
    }
  }

  /**
   * Retrieves a show by show_name and start_date or creates it if it doesn't exist.
   * @param {Array} rawDataArray - Array containing breeding_info.
   * @returns {Array} - Array of upserted show records.
   */
  async getOrCreate(rawDataArray) {
    try {
      const showsToInsert = await this.prepareData(rawDataArray);
      console.log(`Number of shows to upsert: ${showsToInsert.length}`);

      const upsertedShows = await this.upsert(showsToInsert, ['show_name', 'start_date'], '*');
      console.log('Upserted Shows:', upsertedShows);

      return upsertedShows;
    } catch (error) {
      console.error('Error in getOrCreate:', error);
      throw error;
    }
  }

  /**
   * Retrieves or creates a country record.
   * @param {string} countryCode - The country code (e.g., "IS" for Iceland).
   * @returns {number} - The ID of the country.
   */
  
  
}

module.exports = Show;
