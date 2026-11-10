# Mini Virtual KAM – AI Voice Assistant

An AI-powered, voice-based Virtual Key Account Manager designed to help e-commerce sellers understand their business performance, identify potential issues, and receive actionable recommendations.

## Overview

Mini Virtual KAM simulates the role of a Key Account Manager (KAM) by interacting with sellers through voice conversations.

It analyzes seller performance data, identifies important business trends, asks relevant follow-up questions, and provides AI-generated suggestions to help sellers improve their performance.

The project uses simulated seller data for demonstration purposes.

## Features

- **Voice Interaction:** Communicate with the assistant using speech.
- **AI-Powered Conversations:** Uses Google Gemini to understand seller queries and generate contextual responses.
- **Seller Performance Analytics:** Analyzes sales, orders, cancellation rates, and inventory availability.
- **Root-Cause Exploration:** Asks relevant follow-up questions to understand possible reasons behind performance changes.
- **Actionable Recommendations:** Provides practical suggestions based on available seller data.
- **Conversation Context:** Uses previous conversation messages to maintain context during interactions.

## Technology Stack

| Component | Technology |
|---|---|
| Frontend | React.js, Vite |
| Backend | Python, FastAPI |
| AI Model | Google Gemini Flash-Lite |
| Speech-to-Text | Web Speech API |
| Text-to-Speech | Web Speech Synthesis API |
| Data Processing | Python |
| Data Storage | JSON |

## Project Structure

```text
Mini Virtual KAM/
│
├── backend/
│   ├── main.py
│   ├── ai_service.py
│   ├── analytics.py
│   ├── seller_data.json
│   └── .env
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── index.html
│
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

- Python 3.10 or later
- Node.js and npm
- Google Gemini API key

### 1. Clone the repository

```bash
git clone https://github.com/khyatiydv21/Mini_virtual_KAM-AI-voice-assistant-.git
cd Mini_virtual_KAM-AI-voice-assistant-
```

### 2. Set up the backend

```bash
cd backend
python -m venv venv
```

Activate the virtual environment on Windows:

```powershell
venv\Scripts\activate
```

Install dependencies:

```bash
pip install fastapi uvicorn python-dotenv google-genai
```

Create a `.env` file inside the backend folder:

```env
GEMINI_API_KEY=your_gemini_api_key
```

Start the backend server:

```bash
uvicorn main:app --reload --port 8000
```

Backend API documentation:

`http://127.0.0.1:8000/docs`

### 3. Set up the frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```



## Sample Seller Data

The project uses simulated seller performance data, including:

- Previous and current month sales
- Previous and current month orders
- Cancellation rates
- Average selling price
- Out-of-stock product counts

This data helps demonstrate how the assistant analyzes business performance and generates recommendations.

## Future Improvements

- Multilingual voice support
- Seller-specific data integration
- More detailed performance dashboards
- Automated conversation summaries
- Recommendation tracking and outcome analysis

## Author

**Khyati Yadav**

B.Tech – Computer Science and Engineering

GitHub: [@khyatiydv21](https://github.com/khyatiydv21)

---

*Mini Virtual KAM is a demonstration project built using simulated seller data.*
