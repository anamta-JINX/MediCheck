# MediCheck PK — AI Health Assistant

## Overview

MediCheck PK is an AI-powered web-based health assistant that helps users convert their symptoms into a structured, doctor-ready medical summary.

It uses a conversational interface powered by Claude AI to guide users step-by-step in describing their health conditions clearly and effectively.

The system is designed with accessibility in mind for users in Pakistan and supports both English and Roman Urdu.

---

## Features

- AI-powered conversational symptom checker
- Step-by-step medical history collection
- Supports English and Roman Urdu
- Automatic red flag detection for emergency symptoms
- Generates structured medical summaries for doctors
- Quick symptom shortcut buttons
- Clean, modern, responsive UI
- Real-time AI responses using Claude API

---

## How It Works

1. User describes their symptoms in chat form  
2. AI asks one question at a time  
3. System collects:
   - Main complaint  
   - Duration  
   - Severity  
   - Associated symptoms  
   - Age and gender  
   - Allergies  
   - Current medications  
4. AI generates a structured medical summary  
5. User can copy and share it with a doctor  

---

## Medical Summary Format

MEDICHECK MEDICAL SUMMARY

Main Complaint:  
Duration:  
Severity:  
Other Symptoms:  
Patient:  
Allergies:  
Current Medications:  
Red Flags:  
Recommended:  

---

## Tech Stack

- HTML5  
- CSS3 (Modern UI Design System)  
- JavaScript (Vanilla ES6)  
- Claude AI API (Anthropic)  
- Fetch API  

---

## Setup Instructions

### 1. Clone the repository

git clone https://github.com/your-username/medicheck-pk.git  

---

### 2. Open project

Open `index.html` directly in any modern browser.

---

### 3. Add API Key

Inside the JavaScript fetch request, add your API key:

x-api-key: "YOUR_API_KEY"

---

## Important Notes

- This application does NOT provide medical diagnosis  
- It only structures patient symptoms for doctor visits  
- Always consult a licensed medical professional for health issues  

---

## Safety Features

The system detects emergency symptoms such as:

- Chest pain with radiation  
- Difficulty breathing at rest  
- Seizures or fits  
- Blood in vomit or stool  
- High fever in infants  

In such cases, it immediately recommends urgent medical attention.

---

## Future Improvements

- Secure backend for API protection  
- User authentication system  
- Voice-based symptom input  
- Native Urdu script support  
- Doctor dashboard integration  
- Patient history tracking  

---

## License

MIT License

Copyright (c) 2026 MediCheck PK

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
