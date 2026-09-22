"""
Train a multi-class logistic regression risk profiler model.
Run: python3 scripts/train_risk_profiler.py
"""

from __future__ import annotations

import json
from pathlib import Path

import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
)
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

FEATURE_NAMES = [
    "age",
    "monthlyIncome",
    "investmentHorizonYears",
    "existingSavings",
    "dependents",
    "riskToleranceScore",
]

CLASS_NAMES = ["Conservative", "Moderate", "Aggressive"]
RNG = np.random.default_rng(42)


def generate_dataset(n_samples: int = 800) -> tuple[np.ndarray, np.ndarray]:
    age = RNG.integers(18, 66, size=n_samples)
    monthly_income = RNG.integers(10_000, 500_001, size=n_samples)
    horizon = RNG.integers(1, 31, size=n_samples)
    existing_savings = RNG.integers(0, 5_000_001, size=n_samples)
    dependents = RNG.integers(0, 6, size=n_samples)
    risk_tolerance = RNG.integers(1, 11, size=n_samples)

    # Savings relative to ~5 years of income (clipped for stability)
    savings_ratio = existing_savings / np.maximum(monthly_income * 60, 1)
    savings_ratio = np.clip(savings_ratio, 0, 3)

    # Weighted score: higher => more aggressive. Not a perfect separator.
    score = (
        (65 - age) / 47 * 2.4
        + horizon / 30 * 2.8
        + risk_tolerance / 10 * 3.6
        + savings_ratio * 1.2
        - dependents / 5 * 1.8
        + np.log1p(monthly_income / 10_000) / 4 * 0.8
        + RNG.normal(0, 0.85, size=n_samples)
    )

    labels = np.empty(n_samples, dtype=object)
    labels[score < 3.2] = "Conservative"
    labels[(score >= 3.2) & (score < 5.4)] = "Moderate"
    labels[score >= 5.4] = "Aggressive"

    X = np.column_stack(
        [
            age,
            monthly_income,
            horizon,
            existing_savings,
            dependents,
            risk_tolerance,
        ]
    ).astype(float)

    return X, labels


def main() -> None:
    X, y = generate_dataset(800)

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.25,
        random_state=42,
        stratify=y,
    )

    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    model = LogisticRegression(
        solver="lbfgs",
        max_iter=2000,
        random_state=42,
    )
    model.fit(X_train_scaled, y_train)

    y_pred = model.predict(X_test_scaled)
    accuracy = accuracy_score(y_test, y_pred)
    cm = confusion_matrix(y_test, y_pred, labels=CLASS_NAMES)
    report = classification_report(y_test, y_pred, labels=CLASS_NAMES)

    print("=== Risk Profiler Training Results ===")
    print(f"Samples: {len(X)} | Train: {len(X_train)} | Test: {len(X_test)}")
    print(f"Test accuracy: {accuracy:.4f} ({accuracy * 100:.2f}%)")
    print("\nConfusion matrix (rows=true, cols=pred):")
    print("                " + "  ".join(f"{c[:4]:>6}" for c in CLASS_NAMES))
    for label, row in zip(CLASS_NAMES, cm):
        print(f"{label:14} " + "  ".join(f"{v:6d}" for v in row))
    print("\nClassification report:")
    print(report)

    # Ensure class order matches CLASS_NAMES
    class_to_index = {name: idx for idx, name in enumerate(model.classes_)}
    ordered_indices = [class_to_index[name] for name in CLASS_NAMES]

    coefficients = model.coef_[ordered_indices].tolist()
    intercepts = model.intercept_[ordered_indices].tolist()

    payload = {
        "featureNames": FEATURE_NAMES,
        "classNames": CLASS_NAMES,
        "scalerMean": scaler.mean_.tolist(),
        "scalerScale": scaler.scale_.tolist(),
        "coefficients": coefficients,
        "intercepts": intercepts,
        "metrics": {
            "testAccuracy": round(float(accuracy), 4),
            "trainSize": int(len(X_train)),
            "testSize": int(len(X_test)),
            "totalSamples": int(len(X)),
            "confusionMatrix": cm.tolist(),
        },
    }

    out_dir = Path(__file__).resolve().parent
    out_path = out_dir / "risk_profiler_model.json"
    out_path.write_text(json.dumps(payload, indent=2))
    print(f"\nSaved model JSON → {out_path}")


if __name__ == "__main__":
    main()
