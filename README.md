# AI First Aid Web App

This project is a full-stack web application designed to assist users in understanding and performing first aid procedures through AI-enhanced natural language interpretation. It allows users to type or speak symptoms and receive clear, step-by-step first aid instructions, powered by a local LLM backend (via localllm.py) and a responsive React frontend.

## 📁 Project Structure & File Descriptions

### Backend (`/backend`)
- **`localllm.py`**: Uses a locally hosted LLM (via Ollama or similar).
- **`requirements.txt`**: Lists Python dependencies like `Flask`, `requests`, and `python-dotenv`.


### Frontend (`/frontend`)
- **`public/`**: Contains static assets (e.g., React, index.html).
- **`src/App.tsx`**: Main app component; renders layout and injury form.
- **`src/components/InjuryForm.tsx`**: Allows users to type injury descriptions,request AI-based help, and displays first aid steps.
- **`src/services/api.ts`**: Handles API requests to the Flask backend.
- **`package.json`**: Declares frontend dependencies and React scripts.

## 🚀 How to Run

### Local LLM
- Download and install Ollama
- https://ollama.com/download
- Run Ollama3
- ollama run llama3


### Backend
```bash
cd backend
pip install -r requirements.txt
python localllm.py
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## 🚀 How to Run

### Unit Tests

### Backend
```bash
cd first-aid-app
PYTHONPATH=backend pytest backend/tests
```

### Frontend
```bash
cd frontend
npm test
```

## ✅ Features
- Search for first aid instructions manually or using natural language.
- AI parses injury descriptions via local LLM and maps them to known first aid entries.
```

You're now ready to start using a full-stack AI-powered first aid assistant!

