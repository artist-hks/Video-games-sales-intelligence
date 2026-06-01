# VGSI — Video Games Sales Intelligence

A dark-themed, gaming-aesthetic full-stack dashboard for predicting video game global sales using machine learning and exploring rich analytics from the Kaggle vgsales dataset.

## Features

### Completed

- **Dashboard** — Overview stats (total games, global sales, top platform/genre), regional pie chart, top 10 platforms bar chart, yearly sales area chart with animated count-up stat cards
- **Predict** — ML-powered global sales prediction using a Random Forest Regressor. Input genre, platform, year, and regional sales to get a predicted global figure with confidence tier (Indie / Rising / Hit / Blockbuster / Legendary)
- **Analytics** — Tabbed deep-dive analytics:
  - Platforms: horizontal bar chart + sortable table
  - Genres: donut chart + avg sales bar chart + genre cards
  - Publishers: top 20 bar chart + table
  - Yearly Trend: area chart with peak year reference line
- **Recommender** — Filter by platform and genre to discover top-selling games rendered as GameCards with rank badges, sales progress bars, and regional breakdowns
- **History** — Prediction history persisted in localStorage, with individual delete, clear all (with confirmation), and CSV export
- **Gaming Aesthetic UI** — Dark theme with custom color palette, Rajdhani/Inter fonts, purple accents, card glow effects, skeleton loading states, page transitions, styled scrollbars

### API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health` | Health check + model status |
| `POST` | `/predict` | Predict global sales (body: na/eu/jp/other sales, platform, genre, year) |
| `GET` | `/analytics/overview` | Summary stats (total games, top platform, etc.) |
| `GET` | `/analytics/platform-sales` | Top 15 platforms by total global sales |
| `GET` | `/analytics/genre-sales` | All genres with total/avg sales |
| `GET` | `/analytics/yearly-trend` | Year-over-year total global sales |
| `GET` | `/analytics/top-publishers` | Top 20 publishers by total global sales |
| `GET` | `/analytics/regional-breakdown` | Total NA/EU/JP/Other sales |
| `GET` | `/recommend?platform=X&genre=Y&limit=N` | Top games by platform/genre |
| `GET` | `/platforms` | Sorted list of unique platforms |
| `GET` | `/genres` | Sorted list of unique genres |

## Prerequisites

- Python 3.11+
- Node.js 18+
- npm

## Setup

```bash
# 1. Clone the repo
git clone <repo-url>
cd vgsi

# 2. Place vgsales.csv in data/
cp /path/to/vgsales.csv data/

# 3. Backend setup
cd backend
pip install -r requirements.txt
python train_model.py    # Train and save ML model
uvicorn main:app --reload --port 8000

# 4. Frontend setup (new terminal)
cd frontend
npm install
npm run dev              # Starts on http://localhost:3000
```

Open http://localhost:3000 in your browser.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Python, FastAPI, Uvicorn |
| ML | Scikit-learn (RandomForestRegressor), Pandas, NumPy, Joblib |
| Frontend | React 18, Vite, React Router v6 |
| Charts | Recharts |
| Icons | Lucide React |
| HTTP | Axios (proxied via Vite) |
| Storage | localStorage (prediction history) |

## Project Structure

```
vgsi/
├── backend/
│   ├── main.py              # FastAPI app with all endpoints
│   ├── predict.py           # Prediction utilities and tier classification
│   ├── train_model.py       # ML model training script
│   ├── requirements.txt     # Python dependencies
│   └── Dockerfile           # Container build file
├── data/
│   └── vgsales.csv          # Kaggle video game sales dataset
├── models/                  # Trained model artifacts (.pkl files)
├── frontend/
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── api.js
│       ├── index.css
│       ├── components/
│       │   ├── Sidebar.jsx
│       │   ├── StatCard.jsx
│       │   ├── GameCard.jsx
│       │   └── LoadingSpinner.jsx
│       └── pages/
│           ├── Dashboard.jsx
│           ├── Predict.jsx
│           ├── Analytics.jsx
│           ├── Recommender.jsx
│           └── History.jsx
├── ecosystem.config.cjs     # PM2 process manager config
└── README.md
```

## ML Model

- **Algorithm**: Random Forest Regressor (200 trees, max depth 12)
- **Features**: NA_Sales, EU_Sales, JP_Sales, Other_Sales, Platform (encoded), Genre (encoded), Year
- **Target**: Global_Sales
- **Performance**: Train R² ~0.96, Test R² ~0.79

## Data

Using the Kaggle Video Game Sales dataset (`vgsales.csv`) with 136 top-selling games including:
- Rank, Name, Platform, Year, Genre, Publisher
- NA_Sales, EU_Sales, JP_Sales, Other_Sales, Global_Sales (all in millions)

## License

MIT
