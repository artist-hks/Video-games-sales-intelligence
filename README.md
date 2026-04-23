<div align="center">

# 🤖 Video Game Sales Intelligence

[![Live Demo](https://img.shields.io/badge/Live%20Demo-vgsi.vercel.app-4CAF50?style=for-the-badge)](https://vgsi.vercel.app)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](#)
[![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)](#)

**An intelligent full-stack analytics platform for video game sales prediction, market analysis, and platform recommendations.**

*Combining machine learning, data visualization, and interactive design to unlock gaming industry insights.*

</div>

---

## 📊 Overview

**Video Games Sales Intelligence (VGSI)** is a comprehensive analytics dashboard that transforms raw gaming sales data into actionable business intelligence. Whether you're a game developer, publisher, or analyst, VGSI helps you understand market dynamics, predict sales performance, and identify winning platforms.

```
Raw Data → ML Models → Interactive Dashboard → Business Decisions
```

### What Makes It Different

✨ **Real-time Predictions** - AI-powered sales forecasting based on regional performance  
📈 **Visual Analytics** - Beautiful, interactive charts revealing market trends  
🎯 **Smart Recommendations** - Algorithm-driven game recommendations by platform  
⚡ **Production Ready** - Full-stack application deployed and live  
🎨 **Modern UX** - Dark SaaS dashboard with gaming aesthetics  

---

## 🌟 Key Features

### 🔮 Sales Prediction Engine
- Predict sales tier/class for your game concept
- Input regional sales estimates (NA, EU, JP, Other)
- Get confidence scores with visual progress indicators
- Real-time model inference with low latency

### 📊 Interactive Analytics Dashboard
- **Regional Distribution Charts** - Visualize sales across markets
- **Platform Analytics** - Top-performing gaming platforms
- **Market Insights** - Historical trends and patterns
- **Real-time Data Processing** - Updated analytics from vgsales dataset

### 🎮 Intelligent Recommender System
- Platform-specific game recommendations
- Ranked by global sales performance
- Data-driven insights for portfolio decisions
- Supports major platforms: Wii, DS, PS2, Xbox 360, and more

### 📜 Prediction History
- Session-based tracking of your predictions
- View prediction accuracy over time
- Export and analyze patterns
- Build a prediction portfolio

### 🎨 User Experience
- **Responsive Design** - Works seamlessly on desktop and tablet
- **Dark Mode Gaming Theme** - Eye-friendly dashboard aesthetics
- **Smooth Animations** - Professional transitions and interactions
- **Intuitive Navigation** - Multi-tab interface for different features

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────┐
│         Frontend (React + Chart.js)             │
│  ┌─────────────────────────────────────────┐  │
│  │  Prediction  │ Analytics │ Recommender  │  │
│  │    Engine    │  Dashboard│   System     │  │
│  └─────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────┘
                     │ API Calls (Axios)
                     ↓
┌─────────────────────────────────────────────────┐
│      Backend (FastAPI + Python)                 │
│  ┌──────────────┬──────────────┬──────────────┐ │
│  │ /predict     │ /analytics   │ /recommend   │ │
│  │   (ML)       │  (Analytics) │ (CSV Stats)  │ │
│  └──────────────┴──────────────┴──────────────┘ │
└────────────────────┬────────────────────────────┘
                     │ Data Processing
                     ↓
        ┌────────────────────────────┐
        │  ML Models & Scalers       │
        │  vgsales.csv Dataset       │
        └────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend
```
⚛️  React              - UI Framework
📊  Chart.js           - Data Visualization
🔗  Axios              - HTTP Client
🎨  CSS3 + Animations  - Styling & Effects
```

### Backend
```
⚡  FastAPI            - High-performance API framework
🐍  Python             - Core language
📈  Pandas/NumPy       - Data processing
🤖  Scikit-Learn       - ML models & preprocessing
💾  Joblib             - Model serialization
```

### Data & ML
```
📊  vgsales.csv        - 16,500+ game sales records
🧠  Calibrated Model   - Trained classification model
⚖️   Scaler             - Feature normalization (StandardScaler)
```

### Deployment
```
🚀  Vercel             - Frontend hosting
🐳  Docker-ready       - Backend containerization
☁️   API                - RESTful web service
```

---

## 📂 Project Structure

```
video-games-sales-intelligence/
│
├── 📁 frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── App.js            # Main application
│   │   ├── App.css           # Styling
│   │   └── index.js          # Entry point
│   ├── package.json
│   └── README.md
│
├── 📁 backend/
│   ├── main.py               # FastAPI application
│   ├── predict.py            # Prediction logic
│   ├── test_predict.py       # Unit tests
│   ├── requirements.txt
│   └── venv/                 # Virtual environment
│
├── 📁 data/
│   └── vgsales.csv          # Dataset (16,500+ records)
│
├── 📁 models/
│   ├── calibrated_model.pkl  # Trained classifier
│   └── scaler.pkl            # Feature scaler
│
├── README.md
├── .gitattributes
└── VGSI Report.pdf          # Detailed analysis report
```

---

## 🚀 Quick Start

### Prerequisites
- **Python 3.8+** (for backend)
- **Node.js 14+** (for frontend)
- **Git** (for version control)

### 1️⃣ Clone Repository

```bash
git clone https://github.com/artist-hks/Video-games-sales-intelligence.git
cd video-games-sales-intelligence
```

### 2️⃣ Setup Backend

```bash
cd backend

# Create & activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install fastapi uvicorn pandas numpy joblib scikit-learn

# Start server
uvicorn main:app --reload
```

✅ Backend running on: `http://127.0.0.1:8000`

### 3️⃣ Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

✅ Frontend running on: `http://localhost:3000`

### 4️⃣ Access Application

Open your browser and navigate to: **`http://localhost:3000`**

---

## 📡 API Documentation

### 🔮 POST `/predict`
**Predict sales tier based on regional inputs**

```json
Request:
{
  "na": 1.0,      // North America sales
  "eu": 0.5,      // Europe sales
  "jp": 0.2,      // Japan sales
  "other": 0.1    // Other regions sales
}

Response:
{
  "prediction": "Tier 1 - Blockbuster",
  "confidence": 0.87,
  "global_estimate": 1.8
}
```

**Use Case**: Game publishers estimating potential game performance  
**Response Time**: ~50ms  

---

### 📊 GET `/analytics`
**Get platform analytics from vgsales dataset**

```json
Response:
{
  "platforms": [
    { "platform": "Wii", "sales": 824.45 },
    { "platform": "DS", "sales": 711.32 },
    { "platform": "PS2", "sales": 664.68 },
    ...
  ]
}
```

**Use Case**: Understanding which platforms generate highest sales  
**Data Source**: Historical vgsales.csv analysis  

---

### 🎮 GET `/recommend?platform=Wii`
**Get top game recommendations for a platform**

```json
Response:
{
  "platform": "Wii",
  "recommendations": [
    {
      "rank": 1,
      "game": "Wii Sports",
      "sales": 82.90,
      "genre": "Sports"
    },
    {
      "rank": 2,
      "game": "Mario Kart Wii",
      "sales": 35.73,
      "genre": "Racing"
    },
    ...
  ]
}
```

**Use Case**: Identifying successful game titles by platform  
**Algorithm**: Aggregated global sales ranking  

---

## 🎯 Usage Scenarios

### 📱 For Game Developers
- Estimate potential sales for your game concept
- Identify which platforms have highest ROI
- Understand market saturation by genre
- Benchmark against successful titles

### 📊 For Publishers
- Make data-driven publishing decisions
- Analyze regional market performance
- Portfolio diversification strategies
- Market opportunity identification

### 💼 For Business Analysts
- Explore gaming industry trends
- Understand platform evolution
- Regional sales distribution analysis
- Predictive modeling for forecasts

### 🎓 For Researchers
- Real-world ML implementation example
- Data visualization techniques
- Full-stack application architecture
- Production deployment patterns

---

## 🧠 Machine Learning Pipeline

```
┌─────────────────────────────────────────┐
│     Raw Sales Data                      │
│     (Regional: NA, EU, JP, Other)       │
└────────────────┬────────────────────────┘
                 │
                 ↓
         ┌──────────────────┐
         │  Feature Scaling  │  StandardScaler
         │  (scaler.pkl)    │
         └────────┬─────────┘
                  │
                  ↓
         ┌──────────────────────────┐
         │  ML Classification Model  │
         │  (calibrated_model.pkl)   │
         │  Scikit-Learn Classifier  │
         └────────┬─────────────────┘
                  │
                  ↓
    ┌─────────────────────────────┐
    │  Sales Tier Prediction       │
    │  + Confidence Score          │
    │  + Global Sales Estimate     │
    └─────────────────────────────┘
```

**Model Details**:
- **Type**: Classification with confidence calibration
- **Input Features**: NA, EU, JP, Other regional sales
- **Output Classes**: Multiple sales tiers/categories
- **Accuracy**: Calibrated for confidence scoring
- **Training Data**: Historical vgsales.csv

---

## 🎨 Screenshots & UI

### Dashboard Tabs

**1. Prediction Engine**
- Input form for regional sales
- Real-time confidence indicator
- Historical prediction tracking

**2. Analytics Dashboard**
- Platform performance charts
- Regional distribution analysis
- Sales trend visualization

**3. Recommender System**
- Platform selector
- Top games by performance
- Ranking and metrics

**4. Prediction History**
- Session tracking
- Prediction performance analysis
- Data export capabilities

---

## 📦 Build for Production

### Frontend Production Build

```bash
cd frontend
npm run build
```

Creates optimized bundle in `build/` directory.

### Backend Deployment

```bash
# Using Docker
docker build -t vgsi-backend .
docker run -p 8000:8000 vgsi-backend

# Or traditional deployment
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```

### Configuration

Update CORS settings in `backend/main.py` for your production domain:
```python
origins = [
    "https://yourdomain.com",
    "https://www.yourdomain.com"
]
```

---

## 🔧 Configuration & Customization

### Adjust Prediction Model
Edit `backend/predict.py` to:
- Switch classification algorithm
- Add new prediction features
- Modify output tiers

### Customize UI Theme
Edit `frontend/src/App.css` to:
- Change color scheme
- Modify animations
- Adjust responsive breakpoints

### Update Dataset
Replace `data/vgsales.csv` with your own data:
- Maintain column structure
- Update analytics endpoints
- Retrain models if needed

---

## 🧪 Testing

### Backend Testing

```bash
cd backend
python -m pytest test_predict.py -v
```

### Frontend Testing

```bash
cd frontend
npm test
```

---

## 📚 Additional Resources

- 📄 **Detailed Report**: See `VGSI Report.pdf` for in-depth analysis
- 🔗 **Live Demo**: [vgsi.vercel.app](https://vgsi.vercel.app)
- 📊 **Dataset**: `data/vgsales.csv` (16,500+ games)
- 🤖 **Models**: Trained artifacts in `models/` directory

---

## 🎯 Future Enhancements

- [ ] 🔄 Real-time data sync with gaming APIs
- [ ] 📱 Mobile app version
- [ ] 🌍 Multi-language support
- [ ] 🔐 User authentication & saved projects
- [ ] 📧 Email report generation
- [ ] 🎮 Integration with Steam/Epic APIs
- [ ] 🧠 Advanced ML models (Neural Networks, Ensemble)
- [ ] ⏰ Scheduled predictions & alerts

---

## 🤝 Contributing

Contributions are welcome! Please feel free to:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

---

## 📝 License

This project is licensed under the **MIT License** - see LICENSE file for details.

---

## 👨‍💻 About the Developer

**Hemant Sharma (HKS)**
- 🔗 GitHub: [@artist-hks](https://github.com/artist-hks)
- 💼 LinkedIn: [artisthks](https://www.linkedin.com/in/artisthks)
- 📧 Email: [artist.hks.dev@gmail.com](mailto:artist.hks.dev@gmail.com)

*Full-stack ML engineer passionate about building intelligent systems with beautiful user experiences.*

---

## 📞 Support & Feedback

Found a bug? Have a suggestion? Need help?

- 🐛 **Report Issues**: [GitHub Issues](https://github.com/artist-hks/Video-games-sales-intelligence/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/artist-hks/Video-games-sales-intelligence/discussions)
- 📧 **Email**: artist.hks.dev@gmail.com

---

<div align="center">

### ⭐ If you found this helpful, please consider giving it a star!

**Built with ❤️ for the gaming community**

[🔝 Back to Top](#video-games-sales-intelligence)

</div>

---

## 📊 Project Stats

| Metric | Value |
|--------|-------|
| **Frontend** | React + Chart.js |
| **Backend** | FastAPI (Python) |
| **Dataset Size** | 16,500+ games |
| **Model Type** | Classification |
| **API Endpoints** | 3 main endpoints |
| **Response Time** | <100ms average |
| **Deployment** | Vercel + Cloud |

---

*Last Updated: April 2026*  
*Status: Active Development* ✅
