import os
from pathlib import Path

import pandas as pd
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from predict import predict_sales

BASE_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = BASE_DIR.parent
DATASET_PATH = PROJECT_ROOT / "data" / "vgsales.csv"
ALLOWED_ORIGINS = [
    origin.strip()
    for origin in os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")
    if origin.strip()
]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class SalesInput(BaseModel):
    na: float
    eu: float
    jp: float
    other: float


@app.post("/predict")
def predict(data: SalesInput):
    return predict_sales(data.na, data.eu, data.jp, data.other)


@app.get("/analytics")
def get_analytics():
    df = pd.read_csv(DATASET_PATH)

    top_platforms = (
        df.groupby("Platform")["Global_Sales"]
        .sum()
        .sort_values(ascending=False)
        .head(5)
    )

    return {
        "platforms": top_platforms.index.tolist(),
        "sales": top_platforms.values.tolist()
    }


@app.get("/recommend")
def recommend_game(platform: str):
    df = pd.read_csv(DATASET_PATH)

    filtered = df[df["Platform"] == platform]

    top_games = (
        filtered.sort_values("Global_Sales", ascending=False)
        .head(5)[["Name", "Global_Sales"]]
    )

    return {
        "games": top_games["Name"].tolist(),
        "sales": top_games["Global_Sales"].tolist()
    }
