<div align="center">

<img src="https://img.shields.io/badge/VGSI-Video%20Games%20Sales%20Intelligence-7c3aed?style=for-the-badge&logo=gamepad&logoColor=white" alt="VGSI Banner"/>

# 🎮 Video Games Sales Intelligence

## Live Demo
- **Frontend**: Hosted on Vercel (Production) - [vgsi.vercel.app](https://vgsi.vercel.app)
- **Backend API**: Hosted on Render (`https://video-games-sales-intelligence.onrender.com/`)

### A full-stack gaming analytics dashboard — predict, explore, and discover video game sales data

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=flat-square&logo=python&logoColor=white)](https://python.org/)
[![Scikit-learn](https://img.shields.io/badge/Scikit--learn-1.5-F7931E?style=flat-square&logo=scikitlearn&logoColor=white)](https://scikit-learn.org/)
[![Vite](https://img.shields.io/badge/Vite-5.3-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

[🔴 Live Demo](https://vgsi.vercel.app) · [📊 Dataset](https://www.kaggle.com/datasets/gregorut/videogamesales) · [🐛 Report Bug](https://github.com/artist-hks/Video-games-sales-intelligence/issues) · [💡 Request Feature](https://github.com/artist-hks/Video-games-sales-intelligence/issues)

</div>

---

## 📸 Preview
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/29b2e0d0-3c1e-4bd2-aca1-02a37cddfb8e" />


> *Dark gaming-aesthetic dashboard with sidebar navigation, animated stat cards, and Recharts-powered analytics*

---

## ✨ Features

| Feature | Description |
|---|---|
| 🤖 **ML Sales Prediction** | Predict global sales using Random Forest — inputs: platform, genre, year, regional sales |
| 📊 **Rich Analytics** | Platform trends, genre distribution, year-over-year charts, publisher leaderboard |
| 🎯 **Game Recommender** | Filter top games by platform and genre, sorted by global sales |
| 📜 **Prediction History** | All predictions saved in localStorage with CSV export |
| 🌍 **Regional Breakdown** | NA / EU / JP / Other sales split visualized as pie + area charts |
| 🎨 **Gaming UI** | Dark theme, Rajdhani + Inter fonts, purple accent, animated count-up stats |
| 📱 **Responsive** | Sidebar collapses to drawer on mobile |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      Browser (React)                     │
│  Sidebar → Dashboard / Predict / Analytics /            │
│            Recommender / History                        │
└─────────────────────┬───────────────────────────────────┘
                      │ HTTP (Axios + Vite proxy)
                      ▼
┌─────────────────────────────────────────────────────────┐
│                   FastAPI Backend                        │
│  /predict  /analytics/*  /recommend  /platforms  /genres│
└──────────────┬──────────────────────┬───────────────────┘
               │                      │
               ▼                      ▼
┌──────────────────────┐   ┌──────────────────────────────┐
│   ML Model (.pkl)    │   │      vgsales.csv (16K+ rows) │
│  Random Forest Reg.  │   │  Pandas analytics engine     │
│  + LabelEncoders     │   │  Platform / Genre / Year     │
└──────────────────────┘   └──────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend
- **React 18** + **Vite 5** — fast HMR dev environment
- **React Router v6** — client-side routing
- **Recharts** — all charts (AreaChart, BarChart, PieChart)
- **Lucide React** — icon system
- **Axios** — API calls with proxy configuration
- **localStorage** — prediction history persistence

### Backend
- **FastAPI** — async REST API framework
- **Pandas** — CSV analytics and data aggregation
- **Scikit-learn** — Random Forest Regressor, LabelEncoders, StandardScaler
- **Joblib** — model serialization/deserialization
- **Uvicorn** — ASGI server

### ML Pipeline
- Dataset: `vgsales.csv` (~16,600 games, 1980–2016)
- Features: `NA_Sales`, `EU_Sales`, `JP_Sales`, `Other_Sales`, `Platform (encoded)`, `Genre (encoded)`, `Year`
- Target: `Global_Sales` (in millions)
- Model: `RandomForestRegressor(n_estimators=200, max_depth=12)`
- Artifacts saved: `rf_model.pkl`, `scaler.pkl`, `platform_encoder.pkl`, `genre_encoder.pkl`

---

## 📁 Project Structure

```
Video-games-sales-intelligence/
│
├── backend/
│   ├── main.py              # FastAPI app — all endpoints
│   ├── predict.py           # ML inference logic
│   ├── train_model.py       # Model training script (run once)
│   ├── requirements.txt     # Python dependencies
│   └── Dockerfile           # Container config
│
├── data/
│   └── vgsales.csv          # ← Place dataset here (see Setup)
│
├── models/                  # Auto-created by train_model.py
│   ├── rf_model.pkl
│   ├── scaler.pkl
│   ├── platform_encoder.pkl
│   └── genre_encoder.pkl
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Predict.jsx
│   │   │   ├── Analytics.jsx
│   │   │   ├── Recommender.jsx
│   │   │   └── History.jsx
│   │   ├── components/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── StatCard.jsx
│   │   │   ├── GameCard.jsx
│   │   │   └── LoadingSpinner.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── vite.config.js
│   └── package.json
│
├── .gitignore
├── .gitattributes
├── VGSI Report.pdf
└── README.md
```

---

## 🚀 Local Setup

### Prerequisites

- Python 3.11+
- Node.js 18+
- npm or yarn
- `vgsales.csv` from Kaggle (link below)

### Step 1 — Get the dataset

Download `vgsales.csv` from [Kaggle](https://www.kaggle.com/datasets/gregorut/videogamesales) and place it in the `data/` folder:

```
data/
└── vgsales.csv
```

### Step 2 — Backend setup

```bash
cd backend
pip install -r requirements.txt

# Train the ML model (run only once — creates models/*.pkl)
python train_model.py

# Start the API server
uvicorn main:app --reload
```

Backend runs at → `http://localhost:8000`

Interactive docs at → `http://localhost:8000/docs`

### Step 3 — Frontend setup

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at → `http://localhost:3000`

---

## 📡 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check + model status |
| `POST` | `/predict` | Predict global sales (JSON body) |
| `GET` | `/analytics/overview` | Summary stats from dataset |
| `GET` | `/analytics/platform-sales` | Top 15 platforms by sales |
| `GET` | `/analytics/genre-sales` | All genres with avg/total sales |
| `GET` | `/analytics/yearly-trend` | Year-over-year global sales |
| `GET` | `/analytics/top-publishers` | Top 20 publishers |
| `GET` | `/analytics/regional-breakdown` | NA / EU / JP / Other totals |
| `GET` | `/recommend` | Top games by `?platform=` and `?genre=` |
| `GET` | `/platforms` | All unique platform names |
| `GET` | `/genres` | All unique genre names |

### POST `/predict` — Example

```json
// Request
{
  "na_sales": 1.20,
  "eu_sales": 0.80,
  "jp_sales": 0.30,
  "other_sales": 0.20,
  "platform": "PS4",
  "genre": "Action",
  "year": 2018
}

// Response
{
  "predicted_global_sales": 2.54,
  "unit": "millions",
  "confidence_label": "Hit",
  "confidence_color": "#06b6d4",
  "tier_description": "Expected to reach 2M+ copies globally"
}
```

### Sales Tiers

| Tier | Range | Color |
|------|-------|-------|
| Indie | < 0.5M | Gray |
| Rising | 0.5M – 2M | Green |
| Hit | 2M – 5M | Cyan |
| Blockbuster | 5M – 10M | Purple |
| Legendary | > 10M | Amber |

---

## 🐳 Docker (Backend)

```bash
cd backend
docker build -t vgsi-backend .
docker run -p 8000:8000 -v $(pwd)/../data:/app/../data -v $(pwd)/../models:/app/../models vgsi-backend
```

---

## 🌐 Deployment

| Service | What to deploy | Notes |
|---------|---------------|-------|
| [Vercel](https://vercel.com) | `frontend/` | Set `VITE_API_URL` env var to backend URL |
| [Render](https://render.com) | `backend/` | Use Dockerfile, set port 8000 |
| [Railway](https://railway.app) | `backend/` | Auto-detects Dockerfile |

> ⚠️ Make sure `vgsales.csv` and trained `.pkl` files are present in the deployment environment, or use persistent disk storage.

---

## 🗺️ Roadmap

- [x] ML prediction with confidence tiers
- [x] Multi-chart analytics dashboard
- [x] Platform-based recommender
- [x] Prediction history with CSV export
- [x] Dark gaming UI with animations
- [ ] User authentication + cloud-synced history
- [ ] Game cover image integration (IGDB API)
- [ ] Compare two games side-by-side
- [ ] Model retraining via UI (upload custom CSV)
- [ ] Deploy backend on Render with CI/CD

---

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'feat: add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for more information.

---

## 👨‍💻 Developer

**Hemant Sharma (HKS)**

[![GitHub](https://img.shields.io/badge/GitHub-artist--hks-181717?style=flat-square&logo=github)](https://github.com/artist-hks)

---

<div align="center">

Made with ❤️ and a lot of ☕ | Data: [vgsales.csv on Kaggle](https://www.kaggle.com/datasets/gregorut/videogamesales)

⭐ Star this repo if you found it useful!

</div>
