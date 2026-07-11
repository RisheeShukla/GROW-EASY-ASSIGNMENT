# GrowEasy CRM Extraction

GrowEasy CRM Extraction is a full-stack AI-powered lead ingestion application that turns raw CSV contact data into structured CRM-ready records. The project combines a modern Next.js frontend, an Express API, and Google Gemini-powered extraction to streamline lead processing workflows.

## Overview

This application helps teams:

- Upload bulk lead CSV files through a polished UI
- Parse and normalize raw rows into CRM-friendly fields
- Use Gemini AI to map messy contact data into a fixed schema
- Skip incomplete records that lack usable contact details
- Download the processed output as JSON for downstream use

## Key Features

- AI-assisted CSV-to-CRM extraction
- Batch processing with retry logic for reliability
- Structured field normalization for email, phone, company, country, city, and status
- Firebase authentication for login, signup, and Google sign-in
- Responsive dashboard-style frontend for lead import workflows
- JSON export for extracted records

## Tech Stack

### Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Firebase Authentication
- Axios
- Papa Parse
- React Dropzone
- React Toastify
- Lucide React

### Backend

- Node.js
- Express.js
- Multer
- csv-parser
- dotenv
- CORS

### AI / Data Processing

- Google Gemini API
- Structured JSON schema response generation
- Batch retry and fallback handling

## Project Structure

```text
CRM EXTRACTION/
├── backend/
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── package.json
│   ├── src/
│   └── public/
└── README.md
```

## How the Workflow Works

1. A user uploads a CSV file from the frontend.
2. The backend reads and parses the uploaded file.
3. Records are chunked into batches and sent to Gemini for extraction.
4. The AI response is normalized to the CRM schema.
5. Records without a valid email or mobile number are skipped.
6. The cleaned results are returned to the frontend for display and JSON download.

## Prerequisites

Before running the project locally, make sure you have:

- Node.js 18+ or newer
- npm
- A Google Gemini API key
- Firebase project configuration values

## Environment Setup

### Backend

Create a `.env` file inside the `backend` folder with:

```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=8000
```

### Frontend

The frontend already contains a `.env` file with Firebase and API configuration values. If you want to run the backend locally instead of using the deployed backend URL, update:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

You should also ensure the Firebase keys in the frontend environment file are valid for your Firebase project.

## Local Setup

### 1. Install backend dependencies

```bash
cd backend
npm install
```

### 2. Install frontend dependencies

```bash
cd frontend
npm install
```

### 3. Start the backend

```bash
cd backend
node server.js
```

The backend will run on:

```text
http://localhost:8000
```

### 4. Start the frontend

```bash
cd frontend
npm run dev
```

The frontend will be available at:

```text
http://localhost:3000
```

## Production / Deployment Notes

- The backend is designed to work with a hosted service such as Render.
- The frontend uses `NEXT_PUBLIC_API_BASE_URL` to point to the backend service.
- In production, keep your API keys and Firebase secrets in secure environment variables and never commit them to source control.

## Notes

- CSV upload handling is implemented with `multer` and `csv-parser`.
- AI extraction is structured around a strict schema so the output remains predictable.
- The app is focused on lead intake and CRM-ready normalization rather than full CRM persistence.

## License

This project is currently provided without a formal public license declaration.
