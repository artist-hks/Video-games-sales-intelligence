# Video Games Sales Intelligence

A full-stack dashboard for predicting video game sales performance, exploring regional sales analytics, and recommending top games by platform.

The project combines a FastAPI backend, a React dashboard frontend, trained ML artifacts, and the `vgsales.csv` dataset to deliver an interactive gaming-focused intelligence workspace.

## Features

- Sales prediction based on regional inputs for North America, Europe, Japan, and Other regions
- Confidence scoring with a visual progress bar
- Interactive multi-tab dashboard for Prediction, Analytics, Recommender, and History
- Chart.js-powered analytics with regional distribution charts
- Platform recommender backed by CSV analytics from the backend
- Session-based prediction history in the frontend
- Responsive dark SaaS-style UI with gaming dashboard styling

## Tech Stack

### Frontend

- React
- Axios
- Chart.js
- `react-chartjs-2`
- CSS for custom dashboard styling and animations

### Backend

- FastAPI
- Pydantic
- Pandas
- NumPy
- Joblib
- Scikit-learn model artifacts

### Data / ML

- `data/vgsales.csv` for analytics and recommendations
- `models/calibrated_model.pkl`
- `models/scaler.pkl`

## Project Structure

```text
video-games-sales-intelligence/
├── backend/
│   ├── main.py
│   ├── predict.py
│   └── test_predict.py
├── data/
│   └── vgsales.csv
├── frontend/
│   ├── public/
│   ├── src/
│   └── package.json
├── models/
│   ├── calibrated_model.pkl
│   └── scaler.pkl
└── README.md
```

## API Endpoints

### `POST /predict`

Predicts the sales class/tier using regional sales inputs.

Request body:

```json
{
  "na": 1.0,
  "eu": 0.5,
  "jp": 0.2,
  "other": 0.1
}
```

### `GET /analytics`

Returns top platforms by aggregated global sales from the dataset.

### `GET /recommend?platform=Wii`

Returns top recommended games for the selected platform based on global sales.

## Screenshots

Add your project screenshots here after capturing the dashboard.

Suggested images:

- Main dashboard home/header
- Prediction tab
- Analytics tab with charts
- Recommender tab
- History tab

Example section:

```md
![Prediction Tab](./screenshots/prediction-tab.png)
![Analytics Tab](./screenshots/analytics-tab.png)
```

## How To Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/artist-hks/video-games-sales-intelligence.git
cd video-games-sales-intelligence
```

If your repository URL is different, replace it with your actual repo link.

### 2. Start the backend

Open a terminal in `backend/`.

If you are using the existing virtual environment:

```powershell
cd backend
.\venv\Scripts\activate
uvicorn main:app --reload
```

If you want to install dependencies manually in a fresh environment, install the libraries used in the backend first:

```bash
pip install fastapi uvicorn pandas numpy joblib scikit-learn
uvicorn main:app --reload
```

The backend will run on:

```text
http://127.0.0.1:8000
```

### 3. Start the frontend

Open another terminal in `frontend/`.

```bash
cd frontend
npm install
npm start
```

The frontend will run on:

```text
http://localhost:3000
```

## Build Frontend For Production

```bash
cd frontend
npm run build
```

## Notes

- The backend currently reads the dataset from `../data/vgsales.csv`
- The prediction pipeline loads the scaler and trained model from `../models/`
- CORS is configured for `http://localhost:3000`
- Recommendation options currently come from the platforms returned by `/analytics`

## Developer

- Developer: Hemant Sharma (HKS)
- GitHub: https://github.com/artist-hks

