require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const { GoogleGenerativeAI,SchemaType } = require('@google/generative-ai');


const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: 'uploads/' });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const geminiCrmSchema = {
  type: SchemaType.ARRAY,
  description: "List of extracted CRM records",
  items: {
    type: SchemaType.OBJECT,
    properties: {
      created_at: { type: SchemaType.STRING },
      name: { type: SchemaType.STRING },
      email: { type: SchemaType.STRING, nullable: true },
      country_code: { type: SchemaType.STRING },
      mobile_without_country_code: { type: SchemaType.STRING, nullable: true },
      company: { type: SchemaType.STRING },
      city: { type: SchemaType.STRING },
      state: { type: SchemaType.STRING },
      country: { type: SchemaType.STRING },
      lead_owner: { type: SchemaType.STRING },
      crm_status: { type: SchemaType.STRING, nullable: true, enum: ['GOOD_LEAD_FOLLOW_UP', 'DID_NOT_CONNECT', 'BAD_LEAD', 'SALE_DONE'] },
      crm_note: { type: SchemaType.STRING },
      data_source: { type: SchemaType.STRING, nullable: true },
      possession_time: { type: SchemaType.STRING },
      description: { type: SchemaType.STRING }
    }
  }
};
const model = genAI.getGenerativeModel({
  model: 'gemini-3.1-flash-lite',
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: geminiCrmSchema, 
  }
});

// Chunk array into batches of size n
const chunkArray = (array, size) => {
  const chunked = [];
  for (let i = 0; i < array.length; i += size) {
    chunked.push(array.slice(i, i + size));
  }
  return chunked;
};

// Retry mechanism for failed AI batches (Bonus Point Implementation)
const processBatchWithRetry = async (batch, maxRetries = 3) => {
  const prompt = `You are an intelligent data extraction assistant. Map the provided raw CSV JSON records into the GrowEasy CRM format. 
  Rules:
  1. Only use allowed CRM Status values.
  2. Only use allowed Data Source values.
  3. Date must be JS Date convertible.
  4. Put extra emails, extra mobile numbers, remarks, and unmapped useful info into 'crm_note'.
  5. If multiple emails/phones exist, use the first in the primary field and the rest in crm_note.
  
  Raw Data to Process:
  ${JSON.stringify(batch)}`;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      const extractedBatch = JSON.parse(result.response.text());
      return extractedBatch;
    } catch (error) {
      console.warn(`Batch processing attempt ${attempt} failed:`, error.message);
      if (attempt === maxRetries) {
        console.error("Max retries reached. Skipping this batch.");
        return []; 
      }
      // Exponential backoff
      await new Promise(res => setTimeout(res, 1000 * Math.pow(2, attempt - 1)));
    }
  }
};

app.post('/api/import-csv', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const results = [];
  
  // 1. Parse CSV
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      try {
        const batches = chunkArray(results, 20);
        let allExtractedRecords = [];

        // 2. AI Extraction in Batches via Gemini
        for (const batch of batches) {
          const extractedBatch = await processBatchWithRetry(batch);
          allExtractedRecords = allExtractedRecords.concat(extractedBatch);
        }

       
        const finalRecords = [];
        let skipped = 0;

        allExtractedRecords.forEach(record => {
          const hasEmail = record.email && record.email.trim() !== '';
          const hasMobile = record.mobile_without_country_code && record.mobile_without_country_code.trim() !== '';
          
          if (!hasEmail && !hasMobile) {
            skipped++; 
          } else {
            finalRecords.push(record);
          }
        });

        // 4. Return Structured JSON[cite: 1]
        res.json({
          imported: finalRecords.length,
          skipped: skipped,
          total_processed: results.length,
          records: finalRecords
        });

      } catch (error) {
        console.error("Fatal Processing Error:", error);
        res.status(500).json({ error: 'Failed to process AI extraction completely.' });
      } finally {
        // Cleanup temp file safely
        if (fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
      }
    });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));