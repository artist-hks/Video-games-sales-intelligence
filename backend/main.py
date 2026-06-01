"""
VGSI — Video Games Sales Intelligence API
FastAPI backend with ML prediction and analytics endpoints.
"""

import os
import pandas as pd
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional

from predict import load_artifacts, predict_sales, get_confidence_tier

# ─── App Setup ────────────────────────────────────────────────────────────────

app = FastAPI(
    title="VGSI — Video Games Sales Intelligence",
    description="ML-powered video game sales prediction and analytics API",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Load Data & Model ────────────────────────────────────────────────────────

DATA_PATH = os.path.join(os.path.dirname(__file__), '..', 'data', 'vgsales.csv')

# Load model artifacts
artifacts = None
try:
    artifacts = load_artifacts()
    print("[OK] Model artifacts loaded successfully")
except FileNotFoundError as e:
    print(f"[WARN] Model not loaded: {e}")

# Load dataset
df = None
try:
    df = pd.read_csv(DATA_PATH)
    df = df.dropna(subset=['Year'])
    df['Year'] = df['Year'].astype(int)
    print(f"[OK] Dataset loaded: {len(df)} games")
except FileNotFoundError:
    print(f"[WARN] Dataset not found at {DATA_PATH}")


# ─── Pydantic Models ─────────────────────────────────────────────────────────

class PredictRequest(BaseModel):
    na_sales: float = Field(..., ge=0, description="North America sales in millions")
    eu_sales: float = Field(..., ge=0, description="Europe sales in millions")
    jp_sales: float = Field(..., ge=0, description="Japan sales in millions")
    other_sales: float = Field(..., ge=0, description="Other regions sales in millions")
    platform: str = Field(..., description="Gaming platform (e.g. PS4, Wii)")
    genre: str = Field(..., description="Game genre (e.g. Action, Sports)")
    year: int = Field(..., ge=1980, le=2030, description="Release year")


class PredictResponse(BaseModel):
    predicted_global_sales: float
    unit: str = "millions"
    confidence_label: str
    confidence_color: str
    tier_description: str


# ─── Helper ───────────────────────────────────────────────────────────────────

def ensure_dataset():
    if df is None:
        raise HTTPException(status_code=503, detail="Dataset not loaded. Place vgsales.csv in data/.")


# ─── Endpoints ────────────────────────────────────────────────────────────────

@app.get("/health")
def health():
    return {
        "status": "ok",
        "model_loaded": artifacts is not None,
        "dataset_loaded": df is not None,
        "dataset_size": len(df) if df is not None else 0,
    }


@app.post("/predict", response_model=PredictResponse)
def predict(req: PredictRequest):
    if artifacts is None:
        raise HTTPException(status_code=503, detail="Model not loaded. Run train_model.py first.")

    predicted = predict_sales(
        na_sales=req.na_sales,
        eu_sales=req.eu_sales,
        jp_sales=req.jp_sales,
        other_sales=req.other_sales,
        platform=req.platform,
        genre=req.genre,
        year=req.year,
        artifacts=artifacts,
    )

    label, color, description = get_confidence_tier(predicted)

    return PredictResponse(
        predicted_global_sales=predicted,
        unit="millions",
        confidence_label=label,
        confidence_color=color,
        tier_description=description,
    )


@app.get("/analytics/overview")
def analytics_overview():
    ensure_dataset()
    total_games = len(df)
    total_sales = round(df['Global_Sales'].sum(), 2)
    total_sales_billions = round(total_sales / 1000, 2)

    top_platform = df.groupby('Platform')['Global_Sales'].sum().idxmax()
    top_genre = df.groupby('Genre')['Global_Sales'].sum().idxmax()
    best_year = int(df.groupby('Year')['Global_Sales'].sum().idxmax())

    top_pub_col = 'Publisher'
    top_publisher = df.groupby(top_pub_col)['Global_Sales'].sum().idxmax() if top_pub_col in df.columns else "N/A"

    return {
        "total_games": total_games,
        "total_global_sales": total_sales,
        "total_global_sales_billions": total_sales_billions,
        "top_platform": top_platform,
        "top_genre": top_genre,
        "best_year": best_year,
        "top_publisher": top_publisher,
    }


@app.get("/analytics/platform-sales")
def analytics_platform_sales():
    ensure_dataset()
    grouped = df.groupby('Platform').agg(
        global_sales=('Global_Sales', 'sum'),
        game_count=('Global_Sales', 'count')
    ).reset_index().sort_values('global_sales', ascending=False).head(15)

    return [
        {
            "platform": row['Platform'],
            "global_sales": round(row['global_sales'], 2),
            "game_count": int(row['game_count']),
        }
        for _, row in grouped.iterrows()
    ]


@app.get("/analytics/genre-sales")
def analytics_genre_sales():
    ensure_dataset()
    grouped = df.groupby('Genre').agg(
        global_sales=('Global_Sales', 'sum'),
        game_count=('Global_Sales', 'count'),
        avg_sales=('Global_Sales', 'mean'),
    ).reset_index().sort_values('global_sales', ascending=False)

    return [
        {
            "genre": row['Genre'],
            "global_sales": round(row['global_sales'], 2),
            "game_count": int(row['game_count']),
            "avg_sales": round(row['avg_sales'], 2),
        }
        for _, row in grouped.iterrows()
    ]


@app.get("/analytics/yearly-trend")
def analytics_yearly_trend():
    ensure_dataset()
    grouped = df.groupby('Year').agg(
        global_sales=('Global_Sales', 'sum'),
        game_count=('Global_Sales', 'count'),
    ).reset_index()

    # Exclude years with < 5 games and 2017+ due to data sparsity
    grouped = grouped[(grouped['game_count'] >= 5) & (grouped['Year'] < 2017)]
    grouped = grouped.sort_values('Year')

    return [
        {
            "year": int(row['Year']),
            "global_sales": round(row['global_sales'], 2),
            "game_count": int(row['game_count']),
        }
        for _, row in grouped.iterrows()
    ]


@app.get("/analytics/top-publishers")
def analytics_top_publishers():
    ensure_dataset()
    grouped = df.groupby('Publisher').agg(
        global_sales=('Global_Sales', 'sum'),
        game_count=('Global_Sales', 'count'),
    ).reset_index().sort_values('global_sales', ascending=False).head(20)

    return [
        {
            "publisher": row['Publisher'],
            "global_sales": round(row['global_sales'], 2),
            "game_count": int(row['game_count']),
        }
        for _, row in grouped.iterrows()
    ]


@app.get("/analytics/regional-breakdown")
def analytics_regional_breakdown():
    ensure_dataset()
    return {
        "NA": round(df['NA_Sales'].sum(), 2),
        "EU": round(df['EU_Sales'].sum(), 2),
        "JP": round(df['JP_Sales'].sum(), 2),
        "Other": round(df['Other_Sales'].sum(), 2),
    }


@app.get("/recommend")
def recommend(
    platform: str = Query(..., description="Platform to filter by"),
    genre: Optional[str] = Query(None, description="Optional genre filter"),
    limit: int = Query(10, ge=1, le=50, description="Number of results"),
):
    ensure_dataset()
    filtered = df[df['Platform'] == platform]

    if genre and genre != "All":
        filtered = filtered[filtered['Genre'] == genre]

    filtered = filtered.sort_values('Global_Sales', ascending=False).head(limit)

    results = []
    for i, (_, row) in enumerate(filtered.iterrows(), 1):
        results.append({
            "rank": i,
            "name": row['Name'],
            "platform": row['Platform'],
            "year": int(row['Year']) if pd.notna(row['Year']) else None,
            "genre": row['Genre'],
            "publisher": row.get('Publisher', 'Unknown'),
            "na_sales": round(float(row['NA_Sales']), 2),
            "eu_sales": round(float(row['EU_Sales']), 2),
            "jp_sales": round(float(row['JP_Sales']), 2),
            "other_sales": round(float(row['Other_Sales']), 2),
            "global_sales": round(float(row['Global_Sales']), 2),
        })

    return results


@app.get("/platforms")
def get_platforms():
    ensure_dataset()
    platforms = sorted(df['Platform'].dropna().unique().tolist())
    return platforms


@app.get("/genres")
def get_genres():
    ensure_dataset()
    genres = sorted(df['Genre'].dropna().unique().tolist())
    return genres


# ─── Run ──────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
