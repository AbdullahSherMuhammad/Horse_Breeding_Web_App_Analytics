Project Title
A Node.js-based project to fetch, validate, and upload horse-related data (based on FEIF IDs) to a Supabase database. This project has three primary scripts:

Fetch FEIF IDs from the web (and parse the data).
Validate the fetched data to ensure correctness and integrity.
Upload the validated data to Supabase tables.
Table of Contents
Overview
Prerequisites
Installation
Scripts & Usage
1. Fetching FEIF Data
2. Validating Data
3. Uploading Data to Supabase
Project Structure
Logging & Debugging
Possible Edge Cases
Results and Flow
Future Improvements
License
Overview
Goal: Provide a full pipeline for retrieving horse data from an external source (web), verifying that data locally, and finally inserting it into a Supabase database, ensuring data integrity and consistency.

Key Data Points Tracked:

FEIF ID (unique identifier)
Basic Horse Info (Name, Farm, Sire, Dam, etc.)
Assessments (Scores, categories, etc.)
Relationships (Parent-offspring)
Farms, Shows, and other related entities
Each script in this project plays a specific role in this pipeline:

fetchFeifIdsData.js pulls raw data from a web source.
validateHorseData.js checks the data to ensure essential fields are present, removes duplicates, and flags invalid records.
saveDataToSupabase.js takes validated data and inserts or upserts it in Supabase.
Prerequisites
Node.js >= 14 (recommend at least Node 16+).
npm or yarn for package management.
A Supabase Project with relevant tables already created (e.g., horses, farms, shows, assessments, etc.).
Environment variables or a config file that includes your Supabase credentials (URL, anon/public key, etc.).
Installation
Clone this repository:

bash
Copy
Edit
git clone https://github.com/YourUsername/YourRepo.git
cd YourRepo
Install dependencies:

bash
Copy
Edit
npm install
or

bash
Copy
Edit
yarn
Configure environment variables (usually in a .env file) with the following keys:

bash
Copy
Edit
SUPABASE_URL=<your_supabase_url>
SUPABASE_ANON_KEY=<your_supabase_anon_key>
# If you have a service key, you can replace the above
# or add additional environment variables.
Ensure supabase tables and schemas exist for horses, farms, shows, assessments, and any other data your scripts rely on.

Scripts & Usage
1. Fetching FEIF Data
File: fetchFeifIdsData.js

Purpose:

Scrape or otherwise fetch raw horse data from a remote source.
Parse the response to create structured JSON objects, each containing basic_info and other relevant fields.
Save the fetched data to a local JSON file (e.g., logs/successful_horse_data.json) for further processing.
Key Steps:

Make a request to the target URL or API.
Parse the JSON or HTML response.
Extract essential data fields (FEIF ID, horse name, sire, dam, etc.).
Handle edge cases:
Timeout or network errors
Data formats that differ from expected
Save the result to logs/successful_horse_data.json.
Usage:

bash
Copy
Edit
node src/fetchFeifIdsData.js
Expected Output/Logs:

pgsql
Copy
Edit
Fetched X records from the web.
Successfully saved to logs/successful_horse_data.json.
2. Validating Data
File: validateHorseData.js

Purpose:

Load the previously fetched data from logs/successful_horse_data.json.
Verify that each record has all essential fields (e.g., FEIF ID, Name, Sire, Dam).
Remove duplicates based on the FEIF ID (to ensure only one record per FEIF ID is retained).
Split valid and invalid records into separate files, typically src/logs/valid_records.json and src/logs/faulty_ids.json.
Key Steps:

Read logs/successful_horse_data.json.
Check for the presence of “essential fields” in basic_info.
Skip or flag records that are missing required info.
Identify duplicates using a Set or a counting map for FEIF IDs. Only keep the first occurrence in validRecords.
Write valid records to src/logs/valid_records.json and faulty FEIF IDs to src/logs/faulty_ids.json.
Usage:

bash
Copy
Edit
node src/validateHorseData.js
Expected Output/Logs:

yaml
Copy
Edit
Valid records count: 1000
Faulty IDs count: 132
Duplicates count: 180
Duplicates (FEIF IDs): [ "IS20022LM0191", "IS20166LM0555", ... ]
3. Uploading Data to Supabase
File: saveDataToSupabase.js

Purpose:

Take the validated data (e.g., valid_records.json) and insert (or upsert) it into Supabase tables.
Handle related data such as sire, dam, farms, shows, and parent-offspring relationships.
Provide console logs detailing the insertion process, including:
How many records are being inserted.
Any duplicates or conflicts.
Final totals.
Key Steps:

Load src/logs/valid_records.json.
Process the data in batches (if necessary for large datasets).
Insert / upsert records into the correct Supabase tables (horses, farms, shows, assessments, etc.).
Log progress and final counts.
Here’s a simplified flow you might see:

Sires: Upsert unique sires.
Dams: Upsert unique dams.
Horses: Upsert main horse records.
Farms: Upsert or insert farm data.
Shows: Upsert or insert show data.
Relationships: Insert parent-offspring relationships, or link horse-farm associations.
Assessments: Insert/upsert assessment scores in 10-chunk increments, logging how many from what index range each time.
Usage:

bash
Copy
Edit
node src/saveDataToSupabase.js
Expected Output/Logs (Example):

yaml
Copy
Edit
Preparing to insert/upsert 7456 assessment scores (index 0 to 7455).
Successfully inserted/upserted 7456 assessment scores (index 0 to 7455).
Preparing to insert/upsert 7456 assessment scores (index 7456 to 14911).
Successfully inserted/upserted 7456 assessment scores (index 7456 to 14911).
...
All done! Total inserted: 74560 assessment scores.
All successfully fetched FEIF IDs have been inserted to Supabase.
Project Structure
A typical layout might look like this:

bash
Copy
Edit
.
├── package.json
├── .env                  # Supabase and other environment credentials
├── src
│   ├── fetchFeifIdsData.js       # Script 1: Fetch web data
│   ├── validateHorseData.js      # Script 2: Validate data
│   ├── saveDataToSupabase.js     # Script 3: Upload to Supabase
│   ├── logs
│   │   ├── successful_horse_data.json   # Raw data from fetching
│   │   ├── valid_records.json           # Valid data after validation
│   │   └── faulty_ids.json             # Faulty FEIF IDs after validation
│   └── helpers
│       └── supabaseClient.js           # Helper to init Supabase client
├── README.md               # You're reading it!
└── ...
fetchFeifIdsData.js: Grabs and saves raw data.
validateHorseData.js: Checks the raw data, splits valid vs. invalid.
saveDataToSupabase.js: Inserts the final data into Supabase.
logs/: Stores intermediate JSON files (raw data, valid data, faulty IDs).
Logging & Debugging
All scripts use console.log for informational messages and console.error for errors.
For colored logging, you can use:
Chalk (v4 for CommonJS or v5 for ESM)
Or manual ANSI codes (\x1b[31m for red, etc.) if Chalk is not an option.
Typical Log Flow:
Fetching: “Fetched X records”
Validation: “Valid records count: ___, Faulty IDs count: ___”
Uploading: “Preparing to insert/upsert ___ records (index start -> end),” then success/failure messages.
Possible Edge Cases
Network Error during fetch:
Script halts, or partial data is saved.
Inconsistent Data: Missing essential fields (FEIF ID, Name, etc.) or corrupted JSON.
Duplicate FEIF IDs: The system logs and skips duplicates; only the first occurrence is inserted.
Supabase Constraints: If a record violates constraints (e.g., foreign key), the upsert might fail or throw an error.
Very Large Datasets: Breaking the data into chunks prevents memory or timeout issues (especially for upsert calls).
Empty Data: If fetch returns no data, subsequent scripts either do nothing or log a message like “No assessment scores to insert/upsert.”
Results and Flow
Fetching: You start with fetchFeifIdsData.js, and it ends up generating successful_horse_data.json with all raw data:
csharp
Copy
Edit
Fetched 1132 records from the web.
Validation: You run validateHorseData.js, which reads successful_horse_data.json and outputs:
yaml
Copy
Edit
Valid records count: 1000
Faulty IDs count: 132
Duplicates: 180
It also creates valid_records.json for the next step.
Uploading: Finally, saveDataToSupabase.js reads valid_records.json and starts populating your Supabase tables. You might see logs like:
css
Copy
Edit
Preparing to upsert 296 unique sires.
Successfully upserted 296 sires.
Preparing to upsert 952 unique dams.
Successfully upserted 952 dams.
Preparing to upsert 1132 unique horses.
Successfully upserted 1132 horses.
...
All data inserted successfully.
All FEIF IDs processed successfully.
When done, your Supabase instance should contain:

Horses: 1132 or however many valid records
Sires / Dams: Distilled from those horses
Farms, Shows, Assessments: Inserted/upserted with appropriate relationships
Parent-Offspring relationships: Inserted so each sire/dam is linked to relevant offspring
Future Improvements
Parallelizing: For extremely large datasets, consider parallel chunk inserts or a queue-based approach.
Automated Tests: Integration tests to ensure no data corruption between fetch, validation, and upload steps.
Detailed Error Handling: If upsert fails for some records, log or store those rows for manual inspection.
TypeScript: Stronger typing for better maintainability and fewer runtime errors.
License
Choose a license that fits your project (e.g., MIT License):

sql
Copy
Edit
MIT License
Copyright (c) 2025 ...
Permission is hereby granted, free of charge, to any person obtaining a copy
...
(Adjust license details as necessary.)

Thank you for using this project! If you have any questions or suggestions, feel free to reach out or open an issue in the repository. Happy coding!







