# ***Project Title***
As it is quite complex or I think it is, I will be explaning some part of code, and other things so it is easy to use. 
A Node.js-based project to fetch, validate, and upload horse-related data (based on FEIF IDs) to a Supabase database. This project has three primary scripts:

- **Fetch FEIF IDs** from the web (and parse the data) 
- How it works? Basically First you need to do is put the Feif_ids in a file named feif_ids.json as an array. You can use anything to put them there, manually, Through a code. After you have put Feif_ids this part will take one and fetch its data from web using pythonanywhere provided.
- **Validate the fetched data** to ensure correctness and integrity.
- How it works? Basically After you have fetched all the data, over the course of week or month. You still need to validate all the data. This will make sure if there is any error field as it can cause issue it will stop it. It will write two files at the end of data, One faulty Feif_ids, you can check what issue it had, Second: valid_data.json. This data is nearly fine to be inserted (no BIG problems).
- **Upload the validated data** to Supabase tables, This is where magic happens, We deconstruct and insert all the data.

---

## ***Table of Contents***

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Scripts & Usage](#scripts--usage)
   - [Fetching FEIF Data](#1-fetching-feif-data)
   - [Validating Data](#2-validating-data)
   - [Uploading Data to Supabase](#3-uploading-data-to-supabase)
5. [Project Structure](#project-structure)
6. [Logging & Debugging](#logging--debugging)
7. [Possible Edge Cases](#possible-edge-cases)
8. [Results and Flow](#results-and-flow)
9. [Future Improvements](#future-improvements)
10. [License](#license)

---

## ***Overview***

**Goal:** Provide a full pipeline for retrieving horse data from an external source, verifying it locally, and inserting it into a Supabase database, ensuring data integrity and consistency.

### **Key Data Points Tracked:**

- **FEIF ID** (unique identifier)
- **Basic Horse Info** (Name, Farm, Sire, Dam, etc.)
- **Assessments** (Scores, categories, etc.)
- **Relationships** (Parent-offspring)
- **Farms, Shows, and other related entities**

### **Project Workflow:**

1. **`fetchFeifIdsData.js`** → Pulls raw data from a web source.
2. **`validateHorseData.js`** → Ensures essential fields are present, removes duplicates, and flags invalid records.
3. **`saveDataToSupabase.js`** → Inserts/upserts validated data into Supabase.

---

## ***Prerequisites***

- **Node.js** (>= 14, recommended Node 16+)
- **npm or yarn** for package management
- **Supabase Project** with required tables (horses, farms, shows, assessments, etc.)
- **Environment variables** containing Supabase credentials

---

## ***Installation***

### **Clone the repository:**
```bash
git clone https://github.com/YourUsername/YourRepo.git
cd YourRepo
```

### **Install dependencies:**
```bash
npm install
```
_or_
```bash
yarn
```

### **Configure environment variables:**
Create a `.env` file and add:
```bash
SUPABASE_URL=<your_supabase_url>
SUPABASE_ANON_KEY=<your_supabase_anon_key>
```
Ensure Supabase tables and schemas exist.

---

## ***Scripts & Usage***

### **1. Fetching FEIF Data**
**File:** `fetchFeifIdsData.js`

**Purpose:**
-Gets data from a feif_ids.json 
-Fetch the data from websources
- Fetch raw horse data from a web source.
- Parse response into structured JSON.
- Save fetched data to `logs/successful_horse_data.json`.
- Takes logs if data is fetched not, how much etc.

**Usage:**
```bash
node src/fetchFeifIdsData.js
```

**Expected Logs:**
```yaml
Fetched X records from the web.
Successfully saved to logs/successful_horse_data.json.
```

### **2. Validating Data**
**File:** `validateHorseData.js`

**Purpose:**
- Load and verify fetched data.
- Remove duplicates.
- Remove faulty data
- logs each fault
- logs faulty feif_ids
- Separate valid and invalid records.

**Usage:**
```bash
node src/validateHorseData.js
```

**Expected Logs:**
```yaml
Valid records count: 1000
Faulty IDs count: 132
Duplicates count: 180
```

### **3. Uploading Data to Supabase**
**File:** `saveDataToSupabase.js`

**Purpose:**
- Insert/upsert validated data into Supabase.
- Maintain relationships (sire, dam, farms, etc.).

**Usage:**
```bash
node src/saveDataToSupabase.js
```

**Expected Logs:**
```yaml
Preparing to insert/upsert 7456 assessment scores.
Successfully inserted/upserted all records.
All data processed successfully.
```

---

## ***Project Structure***

```bash
.
├── package.json
├── .env                    # Supabase credentials
├── src
│   ├── fetchFeifIdsData.js       # Fetch data
│   ├── validateHorseData.js      # Validate data
│   ├── saveDataToSupabase.js     # Upload data
│   ├── logs
│   │   ├── successful_horse_data.json  # Raw data
│   │   ├── valid_records.json          # Valid data
│   │   └── faulty_ids.json             # Invalid records
│   └── helpers
│       └── supabaseClient.js           # Supabase client
├── README.md               # You're reading it!
└── ...
```

---

## ***Logging & Debugging***

- Uses `console.log` for normal messages and `console.error` for errors.
- Optionally, use **Chalk** for colored logs.

---


## ***Results and Flow***

### **Sample Run:**

**Fetching:**
```csharp
Fetching data for 1132 feif_ids
Fetched data for all feif_ids (You really need to be patient with it. It can take ALOT OF TIME)
```

**Validation:**
```yaml
Valid records count: 1000
Faulty IDs count: 132
Duplicates: 180
Duplicates can occur due to some issues or feif_ids repeated forexample the CSV you gave me had quite few feif_ids repeated again and again. And this created a huge issue As I wasn't expecting same feif_id to be repeated at csv level. I solved all kinds of duplication by creating a util and using it everywhere before insertion.
```

**Uploading:**
```css
Here you need to take atmost Care
If you see there is a file in controllers insert data to Supabase. 
This is where Every data is segregated and inserted into tables, You really don't need to follow inner logic. 
Here there are console.logs(inserting data to "a table" ) 
Then calling a function that inserts data to that table. 
I have added an await with each, however I would recommend  you to go through it sequentially, Like comment all the other codes and only allow horse data to be uplaoded 
Because supabase needs the foreign table to be populated before insertion. This way you can be ensure that the data is being populated in main tables first before seconday. 
You can go through comments unblocking and upload all the data sequentially.
Preparing to upsert 1132 horses.
Successfully upserted 1132 horses.
All data inserted successfully.
Go to now Farms
Then Horse_Farms
Then Shows
Then Horse_Shows
Sequence REALLY REALLY MATTERS.
```
You might ask there are 17 tables in supabase but only few here, That's because I am inserting Lookup tables at lookup helper, in one flow.
Also If you want to know inner working 
I have two class Models main 
Base Model: It has all the important functions taht will be used again and again
Lookuphelper Model: It has all the lookup inializied, Let's say A country table we know we will use it again and again and it has few entries most of entries will have same country SO I initialzied if first put it to cache, and if a country do not exist I simply put it in country table. 
You can be carefree ,Everything is highly optimized, with maps, sets, And other DataStructures so Uploading data is as excuriating as possible. :) 
At the end For even more simplicity I added three color schemes 
Blue (I am about to do something)
Green (Done)
Red(Error)
White(Just simple numbers) 

**Final Database Contents:**
- **Horses:** 1132 records
- **Sires/Dams:** Extracted from horse data
- **Farms/Shows/Assessments:** Populated appropriately

---


**Thank you for using this project!** 🚀 If you have any suggestions, feel free to open an issue. Happy coding! 🎉

