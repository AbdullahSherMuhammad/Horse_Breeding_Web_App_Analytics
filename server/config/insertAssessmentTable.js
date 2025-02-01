/**
* Inserts assessment types and categories into the database.
*/
async function insertAssessmentTypesAndCategories() {
    try {
        for (const assessmentType of assessmentData) {
            const { typeName, categories } = assessmentType;
  
            const { data: insertedType, error: typeError } = await supabase
                .from('assessment_type')
                .upsert(
                    { assessment_type_name: typeName },
                    { onConflict: 'assessment_type_name' }
                )
                .select()
                .single();
  
            if (typeError) {
                console.error(`Error inserting/upserting assessment type "${typeName}":`, typeError.message);
                continue; 
            }
  
            console.log(`Inserted/Upserted Assessment Type: "${insertedType.assessment_type_name}" with ID: ${insertedType.assessment_type_id}`);
  
            for (const categoryName of categories) {

  
                const { data: existingCategory, error: fetchCategoryError } = await supabase
                    .from('assessment_category')
                    .select('assessment_category_id')
                    .eq('assessment_type_id', insertedType.assessment_type_id)
                    .eq('category_name', categoryName)
                    .single();
  
                if (fetchCategoryError && fetchCategoryError.code !== 'PGRST116') { // PGRST116: No rows found
                    console.error(`Error fetching category "${categoryName}" for type "${typeName}":`, fetchCategoryError.message);
                    continue;
                }
  
                if (existingCategory) {
                    console.log(`Category "${categoryName}" already exists under type "${typeName}" with ID: ${existingCategory.assessment_category_id}`);
                    continue; 
                }
  
                const { data: insertedCategory, error: categoryError } = await supabase
                    .from('assessment_category')
                    .insert([
                        {
                            assessment_type_id: insertedType.assessment_type_id,
                            category_name: categoryName
                        }
                    ])
                    .select()
                    .single();
  
                if (categoryError) {
                    console.error(`Error inserting category "${categoryName}" under type "${typeName}":`, categoryError.message);
                    continue;
                }
  
                console.log(`Inserted Category: "${insertedCategory.category_name}" with ID: ${insertedCategory.assessment_category_id}`);
            }
        }
  
        console.log('Assessment Types and Categories insertion completed successfully.');
    } catch (error) {
        console.error('An unexpected error occurred:', error.message);
    }
  }
  
  insertAssessmentTypesAndCategories();

  


  //This is my helper function that I ran once, and my lookup tables were ready, As they are lookup and we don't want extra changes to them that's why its a seperate script
