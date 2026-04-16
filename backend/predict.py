import joblib
import numpy as np
import pandas as pd

model = joblib.load("../models/calibrated_model.pkl")
scaler = joblib.load("../models/scaler.pkl")


def predict_sales(na, eu, jp, other):
    df = pd.DataFrame([[na, eu, jp, other]],
                      columns=["NA_Sales", "EU_Sales", "JP_Sales", "Other_Sales"])

    scaled = scaler.transform(df)

    pred = model.predict(scaled)[0]
    proba = model.predict_proba(scaled)[0]

    return {
        "prediction": int(pred),
        "confidence": float(max(proba) * 100),
        "probabilities": proba.tolist()
    }