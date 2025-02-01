const BaseModel = require('./BaseModel');
const { parseDate } = require('../utils/dateChanger'); 
const { handleNullFields } = require('../utils/setemptytoNull');

class ScoreModel extends BaseModel {
    constructor() {
        super('assessment_score'); 
    }

    async getOrCreate(rawDataArray) {
        try {
            const assessmentsToInsert = await this.prepareData(rawDataArray);
            console.log(`Preparing to insert/upsert ${assessmentsToInsert.length} assessment scores.`);

            const { data, error } = await this.upsert(assessmentsToInsert, ['horse_show_id', 'assessment_category_id'], '*');
            if (error) {
                throw new Error(`Error upserting assessment scores: ${error.message}`);
            }

            return data;
        } catch (error) {
            console.error('Error in getOrCreate:', error.message);
            throw new Error (`Error in getOrCreate: ${error.message}`);
        }
    }


    async prepareData(rawDataArray) {
        try {
            /** 
                First I will make lookup tables for horses shows, and horse_show. Basically, I will map horse_show from horse_shows.
                As this is a join table of many fields, I need to first insert all those fields, like:
                    horse
                    show
                    horse_show
                    assessmenttype
                    assessmentcategory
            */
            const flattenedData = rawDataArray.flat();
            console.log(`Processing ${flattenedData.length} breeding_info entries.`);

            const horsesResult = await this.get("horse", ["horse_id", "feif_id"]);
            const horses = horsesResult.data;
            console.log(`Fetched ${horses.length} horses.`);

            const showsResult = await this.get("show", ["show_id", "show_name"]);
            const shows = showsResult.data;
            console.log(`Fetched ${shows.length} shows.`);

            let horseshowResult = await this.get("horse_show", ["horse_show_id", "horse_id", "show_id"]);
            let horseshow = horseshowResult.data;
            console.log(`Fetched ${horseshow.length} horse_show associations.`);

            let assessmenttypeResult = await this.get("assessment_type", ["assessment_type_id", "assessment_type_name"]);
            let assessmenttype = assessmenttypeResult.data;
            console.log(`Fetched ${assessmenttype.length} assessment types.`);

            let assessmentcategoryResult = await this.get("assessment_category", ["assessment_category_id", "category_name", "assessment_type_id"]);
            let assessmentcategory = assessmentcategoryResult.data;
            console.log(`Fetched ${assessmentcategory.length} assessment categories.`);

            const feifIdToHorseIdMap = new Map();
            horses.forEach(horse => {
                if (horse.feif_id && horse.horse_id) {
                    feifIdToHorseIdMap.set(horse.feif_id, horse.horse_id);
                }
            });

            const showNameToShowIdMap = new Map();
            shows.forEach(show => {
                if (show.show_name && show.show_id) {
                    showNameToShowIdMap.set(show.show_name, show.show_id);
                }
            });

            const horseShowTohorse_showIdMap = new Map();
            horseshow.forEach(horse_show => {
                const key = `${horse_show.horse_id}_${horse_show.show_id}`;
                horseShowTohorse_showIdMap.set(key, horse_show.horse_show_id);
            });

            const assessmentTypeNameToIdMap = new Map();
            assessmenttype.forEach(type => {
                if (type.assessment_type_name && type.assessment_type_id) {
                    assessmentTypeNameToIdMap.set(type.assessment_type_name, type.assessment_type_id);
                }
            });

            const assessmentCategoryMap = new Map(); 
            assessmentcategory.forEach(category => {
                if (category.assessment_type_id && category.category_name && category.assessment_category_id) {
                    const key = `${category.assessment_type_id}_${category.category_name.toLowerCase()}`;
                    assessmentCategoryMap.set(key, category.assessment_category_id);
                }
            });

            const assessmentsToInsert = [];

            for (const entry of flattenedData) {
                const assessment = entry.Assessment;

                const horseFEIFId = assessment.Horse.ID;
                const horse_id = feifIdToHorseIdMap.get(horseFEIFId);
                if (!horse_id) {
                    console.warn(`Horse with FEIF ID "${horseFEIFId}" not found. Skipping entry.`);
                    continue; 
                }

                const showName = assessment.Show.Name;
                const show_id = showNameToShowIdMap.get(showName);
                if (!show_id) {
                    console.warn(`Show "${showName}" not found. Skipping entry.`);
                    continue; 
                }

                const key = `${horse_id}_${show_id}`;
                let horse_show_id = horseShowTohorse_showIdMap.get(key);
                if (!horse_show_id) {
                    console.warn(`horse_show association for Horse ID ${horse_id} and Show ID ${show_id} not found. Skipping entry.`);
                    continue; 
                }

                const scores = assessment.Scores;

                if (scores.Linear_Measurements) {
                    const linearMeasurements = scores.Linear_Measurements;
                    const assessment_type_name = 'Linear_measurement';
                    const assessment_type_id = assessmentTypeNameToIdMap.get(assessment_type_name);
                    if (!assessment_type_id) {
                        console.warn(`Assessment type "${assessment_type_name}" not found. Skipping Linear Measurements.`);
                        continue;
                    }

                    for (const [measurement, scoreValue] of Object.entries(linearMeasurements)) {
                        const categoryName = measurement; 
                        const categoryKey = `${assessment_type_id}_${categoryName.toLowerCase()}`;
                        let assessment_category_id = assessmentCategoryMap.get(categoryKey);
                        if (!assessment_category_id) {
                            console.warn(`Assessment category "${categoryName}" not found under type "${assessment_type_name}". Skipping measurement "${measurement}".`);
                            continue; 
                        }

                        assessmentsToInsert.push({
                            score: scoreValue,
                            remarks: '',
                            assessment_category_id,
                            horse_show_id
                        });
                    }
                }

                if (assessment.Conformation) {
                    const assessment_type_name = 'Conformation';
                    const assessment_type_id = assessmentTypeNameToIdMap.get(assessment_type_name);
                    if (!assessment_type_id) {
                        console.warn(`Assessment type "${assessment_type_name}" not found. Skipping Conformation scores.`);
                        continue;
                    } 
                    
                    for (const category of assessment.Conformation) {
                        try{
                            const categoryName = category.Category;
                            const scoreValue = category.Score;
                            const remarks = category.Remarks || '';
                            const categoryKey = `${assessment_type_id}_${categoryName.toLowerCase()}`;
                            let assessment_category_id = assessmentCategoryMap.get(categoryKey);
                            if (!assessment_category_id) {
                                console.warn(`Assessment category "${categoryName}" not found under type "${assessment_type_name}". Skipping.`);
                                continue;
                            }
                            assessmentsToInsert.push({
                                score: scoreValue,
                                remarks,
                                assessment_category_id,
                                horse_show_id,
                            });
                        }
                        catch(error)
                        {
                            throw new Error ('Error in conformation', error.message);
                        }
                        }
                    
                }
            
                if (assessment.Rideability) {
                    const assessment_type_name = 'Rideability';
                    const assessment_type_id = assessmentTypeNameToIdMap.get(assessment_type_name);
                    if (!assessment_type_id) {
                        console.warn(`Assessment type "${assessment_type_name}" not found. Skipping Rideability scores.`);
                    } else {
                        for (const category of assessment.Rideability) {
                            const categoryName = category.Category;
                            const scoreValue = category.Score;
                            const remarks = category.Remarks || '';
            
                            const categoryKey = `${assessment_type_id}_${categoryName.toLowerCase()}`;
                            let assessment_category_id = assessmentCategoryMap.get(categoryKey);
            
                            // Log key and category for debugging
            
                            if (!assessment_category_id) {
                                console.warn(`Assessment category "${categoryName}" not found under type "${assessment_type_name}". Skipping.`);
                                continue;
                            }
            
                            assessmentsToInsert.push({
                                score: scoreValue,
                                remarks,
                                assessment_category_id,
                                horse_show_id
                            });
                        }
                    }
                }
            
                if (assessment.Totals) {
                    const assessment_type_name = 'Total';
                    const assessment_type_id = assessmentTypeNameToIdMap.get(assessment_type_name);
                    if (!assessment_type_id) {
                        console.warn(`Assessment type "${assessment_type_name}" not found. Skipping Totals scores.`);
                    } else {
                        for (const [totalCategory, scoreValue] of Object.entries(assessment.Totals)) {
                            const categoryName = totalCategory;
                            const categoryKey = `${assessment_type_id}_${categoryName.toLowerCase()}`;
                            let assessment_category_id = assessmentCategoryMap.get(categoryKey);
            
            
                            if (!assessment_category_id) {
                                console.warn(`Assessment category "${categoryName}" not found under type "${assessment_type_name}". Skipping.`);
                                continue;
                            }
            
                            assessmentsToInsert.push({
                                score: scoreValue,
                                remarks: '',
                                assessment_category_id,
                                horse_show_id
                            });
                        }
                    }
                }

                if (entry['Total w/o pace'] !== undefined) {
                    const categoryName = 'Total w/o pace';
                    const assessment_type_name = 'Total';
                    const assessment_type_id = assessmentTypeNameToIdMap.get(assessment_type_name);
                    if (!assessment_type_id) {
                        console.warn(`Assessment type "${assessment_type_name}" not found. Skipping "Total w/o pace".`);
                    } else {
                        const categoryKey = `${assessment_type_id}_${categoryName.toLowerCase()}`;
                        let assessment_category_id = assessmentCategoryMap.get(categoryKey);
                        if (!assessment_category_id) {
                            console.warn(`Assessment category "${categoryName}" not found under type "${assessment_type_name}". Skipping "Total w/o pace".`);
                            continue;
                        }

                        assessmentsToInsert.push({
                            score: entry['Total w/o pace'],
                            remarks: '', 
                            assessment_category_id,
                            horse_show_id
                        });
                    }
                }
               
            }
            const insertfields = handleNullFields(assessmentsToInsert);
            console.log(insertfields.length);
            const finalarray  = this.removeDuplicatesAdvanced(insertfields, ["assessment_category_id", "horse_show_id" ] )
            console.log(finalarray.length);
            return finalarray;
        }
       catch(error)
       {
        throw new Error("Error in scoreModel", error)
       }
    }
}

module.exports = ScoreModel;



