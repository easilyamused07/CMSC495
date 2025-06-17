# AI First Aid Web App

A web-based assistant that helps users respond to injuries with first aid steps. Built using React for the frontend, Flask for the backend, and Exa AI for natural language parsing.

## 📁 Project Structure & File Descriptions

### Backend (`/backend`)
- **`main.py`**: Flask backend serving injury help and AI-powered parsing endpoints.
- **`data/first_aid.json`**: JSON data mapping injury names (e.g., `bleeding`, `burn`) to recommended steps.
- **`requirements.txt`**: Lists Python dependencies like `Flask`, `requests`, and `python-dotenv`.
- **`.env`**: Stores sensitive keys like your Exa API key (`EXA_API_KEY`).

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

### Execute Unit Tests

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
- AI parses injury descriptions via Exa and maps them to known first aid entries.
- Extendable injury database and NLP capabilities.

## ☁️ Deployment Instructions

### Deploying Backend (Flask) on Render
1. Push the `/backend` folder to a GitHub repo.
2. Go to [https://render.com](https://render.com) and create a new Web Service.
3. Connect your GitHub repo and select the `backend` folder.
4. Set the build command: `pip install -r requirements.txt`
5. Set the start command: `python main.py`
6. Add environment variable `EXA_API_KEY` under Settings.
7. Set port to `5000` (or match your app).

### Deploying Frontend (React) on Vercel or Netlify
1. Push the `/frontend` folder to GitHub.
2. Go to [https://vercel.com](https://vercel.com) or [https://netlify.com](https://netlify.com).
3. Import the project, set the root directory to `frontend/`.
4. Use default build command: `npm run build`
5. Set output directory: `build`
6. If using the Flask backend, make sure to handle CORS or set a proxy in `package.json`:
```json
"proxy": "https://your-backend-url.onrender.com"
```

You're now ready to host a full-stack AI-powered first aid assistant!

