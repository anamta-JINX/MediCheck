# MediCheck PK — Bilingual AI Health Assistant (Groq)

**Author:** Anamta Gohar
**License:** ISC  

MediCheck PK is a lightweight, chat-based AI health assistant built for **Pakistani patients** to help them explain symptoms clearly before visiting a doctor. It works in **English + Urdu (including Roman Urdu)**, asks **one question at a time**, and generates a **doctor-ready medical summary** that can be copied and shared during a consultation.

> **Medical Disclaimer:** MediCheck PK does **not** diagnose, prescribe, or replace professional medical advice. If you have severe or worsening symptoms, seek urgent medical care immediately.

---

## Table of Contents
- [Problem Statement](#problem-statement)
- [Solution](#solution)
- [Key Features](#key-features)
- [How It Works](#how-it-works)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
- [How to Run](#how-to-run)
- [API (Backend)](#api-backend)
- [Configuration](#configuration)
- [Safety & Red Flags](#safety--red-flags)
- [Troubleshooting](#troubleshooting)
- [Roadmap / Future Improvements](#roadmap--future-improvements)
- [Contributing](#contributing)
- [License](#license)
- [Author](#author)

---

## Problem Statement

In many healthcare settings (especially in Pakistan), patient-doctor time is limited and symptom descriptions can be incomplete due to:
- language barriers (Urdu/English, typing comfort, Roman Urdu usage)
- lack of structured questioning (people forget key details: duration, severity, allergies, meds)
- rushed consultations where history-taking is shortened
- patients not knowing what information is important to mention

This often leads to:
- incomplete medical history
- repeated questions at the clinic
- delayed care decisions
- anxiety and confusion for patients

---

## Solution

MediCheck PK solves this by providing an easy, friendly chat experience that:
1. collects symptom information **step-by-step**
2. stays **bilingual** and responds in the patient’s language
3. asks **one question at a time** (reduces confusion)
4. flags **red-flag emergency symptoms**
5. generates a **structured medical summary** patients can copy and show to a doctor

---

## Key Features
- **Bilingual support:** English + Urdu (Roman Urdu supported)
- **One-question-at-a-time flow:** keeps the conversation simple
- **Structured data collection:** symptom, duration, severity, associated symptoms, age/gender, allergies, medications
- **Medical summary generator:** clean “doctor-ready” format + copy button
- **Red-flag detection:** encourages urgent care when required
- **Simple local setup:** HTML frontend + Node/Express backend
- **Groq API integration:** fast OpenAI-compatible chat completions

---

## How It Works

### Conversation Flow (High Level)
1. User describes the main complaint (e.g., fever, cough, pain)
2. MediCheck asks **one** follow-up question at a time:
   - How long has it been happening?
   - How severe is it?
   - Any other symptoms?
   - Age & gender?
   - Allergies?
   - Current medicines?
3. After enough info (usually 5–7 exchanges), MediCheck generates:

```
━━━━━━━━━━━━━━━━━━━━━━━
🏥 MEDICHECK MEDICAL SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━
📋 Main Complaint: ...
⏱️ Duration: ...
📊 Severity: ...
🔍 Other Symptoms: ...
👤 Patient: ...
⚠️ Allergies: ...
💊 Current Medications: ...
🚨 Red Flags: ...
📌 Recommended: See a doctor and show them this summary
━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Tech Stack
**Frontend**
- HTML
- CSS (custom UI)
- Vanilla JavaScript

**Backend**
- Node.js
- Express
- Axios
- dotenv
- cors

**LLM Provider**
- Groq (OpenAI-compatible endpoint)

---

## Project Structure

- `medicheck_pk.html` — Frontend (UI + chat logic)
- `server.js` — Backend (Express server + `/chat` route)
- `package.json` — Node dependencies and scripts
- `package-lock.json` — Locked dependency tree
- `.gitignore` — Prevents uploading `node_modules` and secrets like `.env`

---

## Setup & Installation

### 1) Clone the repo
```bash
git clone https://github.com/anamta-JINX/MediCheck.git
cd MediCheck
```

### 2) Install dependencies
```bash
npm install
```

### 3) Create a `.env` file
Create a file named `.env` in the project root:

```env
GROQ_API_KEY=YOUR_GROQ_API_KEY_HERE
PORT=3000
```

> Keep your `.env` private. It is ignored via `.gitignore`.

---

## How to Run

### Start the backend
```bash
npm start
```

You should see something like:
- `Server running on http://localhost:3000`
- `GROQ_API_KEY loaded: true`

### Open the frontend
Open `medicheck_pk.html` in one of these ways:
- Recommended: VS Code **Live Server**
- Or open directly in browser (may work, but Live Server is smoother)

The frontend sends requests to:
- `http://localhost:3000/chat`

---

## API (Backend)

### `POST /chat`
Sends conversation messages to Groq and returns the assistant reply.

**Request body (example):**
```json
{
  "model": "llama-3.3-70b-versatile",
  "max_tokens": 800,
  "system": "System prompt text...",
  "messages": [
    { "role": "user", "content": "I have fever" }
  ]
}
```

**Response:**
```json
{
  "text": "Assistant reply..."
}
```

---

## Configuration

### Model selection
Groq periodically deprecates models. If you see an error like:
`model_decommissioned`

Update your model string in the frontend or backend, e.g.:
- `llama-3.3-70b-versatile`
- (or any currently supported Groq model)

---

## Safety & Red Flags

MediCheck PK includes red-flag detection (high-level safety guidance).  
If a user mentions symptoms such as:
- chest pain with sweating / arm pain
- severe difficulty breathing at rest
- seizures/fits
- blood in vomit or stool
- infant with high fever

…it recommends **urgent hospital attention**.

> Reminder: this is not medical advice; it is a safety prompt to seek professional care.

---

## Troubleshooting

### 1) “API failed”
Most common reasons:
- missing `GROQ_API_KEY` in `.env`
- using a decommissioned Groq model
- network / rate-limit / quota issues

Check your server terminal output for details.

### 2) CORS issues
If you open the HTML using Live Server, CORS must be enabled on the backend (it is enabled in this project via `cors()`).

### 3) “Cannot use import statement outside a module”
Use CommonJS (`require`) in `server.js` OR set `"type": "module"` in `package.json`.  
This project uses **CommonJS**.

---

## Roadmap / Future Improvements
- Deploy backend (Render/Railway/Fly.io) and connect frontend to hosted API
- Add patient “export summary” as PDF
- Add conversation reset button + session storage
- Add stronger safety filters and medical guidelines references
- Add language toggle UI + Urdu Nastaliq rendering improvements
- Add tests and linting
- Add structured JSON output for clinic systems (EMR-friendly)

---

## Contributing
Contributions are welcome:
1. Fork the repo
2. Create a branch: `git checkout -b feature/my-change`
3. Commit changes: `git commit -m "Add my change"`
4. Push: `git push origin feature/my-change`
5. Open a Pull Request

---

## License
This project is licensed under the **ISC License**.

---

## Author
**Anamta Gohar**
