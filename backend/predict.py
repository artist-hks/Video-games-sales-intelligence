"""
VGSI — Prediction utility functions.
Loads trained model artifacts and provides prediction interface.
"""

import os
import joblib
import numpy as np

MODEL_DIR = os.path.join(os.path.dirname(__file__), '..', 'models')


def load_artifacts():
    """Load all trained model artifacts from the models directory."""
    artifact_names = [
        'rf_model.pkl',
        'scaler.pkl',
        'platform_encoder.pkl',
        'genre_encoder.pkl',
        'feature_columns.pkl',
        'platform_classes.pkl',
        'genre_classes.pkl',
    ]

    artifacts = {}
    for name in artifact_names:
        path = os.path.join(MODEL_DIR, name)
        if not os.path.exists(path):
            raise FileNotFoundError(f"Model artifact not found: {path}. Run train_model.py first.")
        key = name.replace('.pkl', '')
        artifacts[key] = joblib.load(path)

    return artifacts


def predict_sales(na_sales, eu_sales, jp_sales, other_sales, platform, genre, year, artifacts):
    """
    Predict global sales using the trained model.

    Args:
        na_sales: North America sales in millions
        eu_sales: Europe sales in millions
        jp_sales: Japan sales in millions
        other_sales: Other regions sales in millions
        platform: Platform string (e.g. 'PS4')
        genre: Genre string (e.g. 'Action')
        year: Release year (int)
        artifacts: dict from load_artifacts()

    Returns:
        float: Predicted global sales in millions
    """
    model = artifacts['rf_model']
    scaler = artifacts['scaler']
    platform_encoder = artifacts['platform_encoder']
    genre_encoder = artifacts['genre_encoder']
    platform_classes = artifacts['platform_classes']
    genre_classes = artifacts['genre_classes']

    # Encode platform — default to index 0 if unknown
    if platform in platform_classes:
        platform_enc = platform_encoder.transform([platform])[0]
    else:
        platform_enc = 0

    # Encode genre — default to index 0 if unknown
    if genre in genre_classes:
        genre_enc = genre_encoder.transform([genre])[0]
    else:
        genre_enc = 0

    # Build feature vector in same order as training:
    # ['NA_Sales', 'EU_Sales', 'JP_Sales', 'Other_Sales', 'Platform_enc', 'Genre_enc', 'Year']
    features = np.array([[na_sales, eu_sales, jp_sales, other_sales, platform_enc, genre_enc, year]])

    # Scale
    features_scaled = scaler.transform(features)

    # Predict
    prediction = model.predict(features_scaled)[0]

    # Ensure non-negative
    return max(round(float(prediction), 2), 0.0)


def get_confidence_tier(predicted_sales):
    """
    Classify the predicted sales into a confidence tier.

    Returns:
        tuple: (label, color, description)
    """
    if predicted_sales < 0.5:
        return ("Indie", "#475569", "Niche title with under 500K copies expected")
    elif predicted_sales < 2:
        return ("Rising", "#10b981", "Solid performer expected to reach 500K–2M copies")
    elif predicted_sales < 5:
        return ("Hit", "#06b6d4", "Strong title expected to reach 2M–5M copies globally")
    elif predicted_sales < 10:
        return ("Blockbuster", "#7c3aed", "Major title expected to reach 5M–10M copies globally")
    else:
        return ("Legendary", "#f59e0b", f"Mega hit expected to exceed 10M copies globally")
