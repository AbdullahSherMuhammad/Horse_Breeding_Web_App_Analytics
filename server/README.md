# ***Project Title***

A Node.js-based project to fetch, validate, and upload horse-related data (based on FEIF IDs) to a Supabase database. This project has three primary scripts:

- **Fetch FEIF IDs** from the web (and parse the data).
- **Validate the fetched data** to ensure correctness and integrity.
- **Upload the validated data** to Supabase tables.

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
- Fetch raw horse data from a web source.
- Parse response into structured JSON.
- Save fetched data to `logs/successful_horse_data.json`.

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

## ***Possible Edge Cases***

- **Network Error:** Partial data saved, script can resume.
- **Inconsistent Data:** Missing essential fields, flagged in logs.
- **Duplicate FEIF IDs:** Logged and only the first occurrence is inserted.
- **Supabase Constraints:** Violations result in failed upserts.
- **Large Datasets:** Data processed in chunks to prevent timeouts.

---

## ***Results and Flow***

### **Sample Run:**

**Fetching:**
```csharp
Fetched 1132 records from the web.
```

**Validation:**
```yaml
Valid records count: 1000
Faulty IDs count: 132
Duplicates: 180
```

**Uploading:**
```css
Preparing to upsert 1132 horses.
Successfully upserted 1132 horses.
All data inserted successfully.
```

**Final Database Contents:**
- **Horses:** 1132 records
- **Sires/Dams:** Extracted from horse data
- **Farms/Shows/Assessments:** Populated appropriately

---


**Thank you for using this project!** 🚀 If you have any suggestions, feel free to open an issue. Happy coding! 🎉

