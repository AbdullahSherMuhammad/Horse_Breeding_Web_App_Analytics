const chalk = require("chalk");
const { validateData } = require("../utils/validation");
const { blupInfo } = require("./blupinfoToSupabase");
const { horse_farm } = require("./horse_farmToSupabase");
const { horse_show } = require("./horse_showToSupabase");
const { farms } = require("./insertFarmToSupabase");
const { horses } = require("./insertHorsesToSupabase");
const { shows } = require("./insertShowsToSupabase");
const { scoremodel } = require("./scoremodelToSupabase");
const { show_participant } = require("./showparticipantsToSupabase");



async function insertDataToSupabase(dataArray) {
  const rawbasicinfo = [];
  const rawpersoninfo = [];
  const rawbreedinginfo = [];
  const rawblupinfo = [];
  const rawparticipantinfo = [];
  
  for (const [index, data] of dataArray.entries()) {
    try {
      if (Object.keys(data).length === 0) {
        console.warn(`Data at index ${index} is empty and will be skipped.`);
        continue; 
      }
      validateData(data);
      const { basic_info, owner_info, beeder_info, breeding_info, offspring_info, blup_info } = data;
      
      if(Object.keys(basic_info).length<1)
      {
        continue
      }
      rawbasicinfo.push(basic_info);
      rawpersoninfo.push({breeding_info: breeding_info , owner_info: owner_info, breeder_info: beeder_info});
      rawblupinfo.push(blup_info);
      rawbreedinginfo.push(breeding_info);
    } catch (error) {
      console.error(`Error processing data entry at index ${index}:`, error.message);
      continue;
    }
  }
  
  try {
    console.log(chalk.bgBlueBright ("Inserting into 'horses'..."));
    await horses(rawbasicinfo);

    console.log(chalk.bgBlueBright ("Inserting into 'farms'..."));
    await farms(rawbasicinfo);

    console.log(chalk.bgBlueBright ("Inserting into 'shows'..."));
    await shows(rawbreedinginfo);

    console.log(chalk.bgBlueBright ("Inserting into 'horse_farm'..."));
    await horse_farm(rawbasicinfo);

    console.log(chalk.bgBlueBright ("Inserting into 'horse_show'..."));
    await horse_show(rawbreedinginfo);

    console.log(chalk.bgBlueBright ("Inserting into 'blupInfo'..."));
    await blupInfo(rawblupinfo);

    console.log(chalk.bgBlueBright("Inserting into 'show_participant'..."));
    await show_participant(rawbreedinginfo);

    console.log(chalk.bgBlueBright("inserting data for Scores"));
    await scoremodel(rawbreedinginfo);

    
  } catch (error) {
    console.error('Error during sequential insertion:', error.message);
  }
}

module.exports = {
  insertDataToSupabase,
};
