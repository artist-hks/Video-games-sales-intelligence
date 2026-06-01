"""
VGSI — Train ML model for video game sales prediction.
Trains a RandomForestRegressor on vgsales.csv and saves all artifacts.
"""

import os
import sys
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score, mean_squared_error
import joblib

DATA_PATH = os.path.join(os.path.dirname(__file__), '..', 'data', 'vgsales.csv')
MODEL_DIR = os.path.join(os.path.dirname(__file__), '..', 'models')


def main():
    # 1. Load data
    print("Loading vgsales.csv...")
    if not os.path.exists(DATA_PATH):
        print(f"ERROR: {DATA_PATH} not found. Place vgsales.csv in the data/ directory.")
        sys.exit(1)

    df = pd.read_csv(DATA_PATH)
    print(f"  Loaded {len(df)} rows, {len(df.columns)} columns")
    print(f"  Columns: {list(df.columns)}")

    # 2. Clean data
    print("Cleaning data...")
    df = df.dropna(subset=['Year', 'Publisher'])
    df['Year'] = df['Year'].astype(int)

    # Drop rows with missing sales
    sales_cols = ['NA_Sales', 'EU_Sales', 'JP_Sales', 'Other_Sales', 'Global_Sales']
    df = df.dropna(subset=sales_cols)
    print(f"  After cleaning: {len(df)} rows")

    # 3. Encode categorical features
    print("Encoding features...")
    platform_encoder = LabelEncoder()
    genre_encoder = LabelEncoder()

    df['Platform_enc'] = platform_encoder.fit_transform(df['Platform'])
    df['Genre_enc'] = genre_encoder.fit_transform(df['Genre'])

    platform_classes = list(platform_encoder.classes_)
    genre_classes = list(genre_encoder.classes_)
    print(f"  Platforms ({len(platform_classes)}): {platform_classes}")
    print(f"  Genres ({len(genre_classes)}): {genre_classes}")

    # 4. Prepare features and target
    feature_columns = ['NA_Sales', 'EU_Sales', 'JP_Sales', 'Other_Sales', 'Platform_enc', 'Genre_enc', 'Year']
    X = df[feature_columns].values
    y = df['Global_Sales'].values

    # 5. Scale numeric features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    # 6. Train/test split
    X_train, X_test, y_train, y_test = train_test_split(
        X_scaled, y, test_size=0.2, random_state=42
    )
    print(f"  Train: {len(X_train)}, Test: {len(X_test)}")

    # 7. Train model
    print("Training RandomForestRegressor...")
    model = RandomForestRegressor(
        n_estimators=200,
        max_depth=12,
        random_state=42,
        n_jobs=-1
    )
    model.fit(X_train, y_train)

    # 8. Evaluate
    train_pred = model.predict(X_train)
    test_pred = model.predict(X_test)

    train_r2 = r2_score(y_train, train_pred)
    test_r2 = r2_score(y_test, test_pred)
    train_rmse = np.sqrt(mean_squared_error(y_train, train_pred))
    test_rmse = np.sqrt(mean_squared_error(y_test, test_pred))

    print(f"\n  === Model Performance ===")
    print(f"  Train R²:  {train_r2:.4f}")
    print(f"  Test R²:   {test_r2:.4f}")
    print(f"  Train RMSE: {train_rmse:.4f}M")
    print(f"  Test RMSE:  {test_rmse:.4f}M")

    # 9. Save artifacts
    os.makedirs(MODEL_DIR, exist_ok=True)

    artifacts = {
        'rf_model.pkl': model,
        'scaler.pkl': scaler,
        'platform_encoder.pkl': platform_encoder,
        'genre_encoder.pkl': genre_encoder,
        'feature_columns.pkl': feature_columns,
        'platform_classes.pkl': platform_classes,
        'genre_classes.pkl': genre_classes,
    }

    print(f"\nSaving artifacts to {MODEL_DIR}/")
    for filename, obj in artifacts.items():
        path = os.path.join(MODEL_DIR, filename)
        joblib.dump(obj, path)
        print(f"  Saved {filename}")

    print("\nTraining complete!")


if __name__ == '__main__':
    main()
