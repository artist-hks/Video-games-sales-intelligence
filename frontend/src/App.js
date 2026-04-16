import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import "./App.css";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  Legend,
  LinearScale,
  Tooltip
);

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";

const sliderConfig = [
  {
    key: "na",
    label: "North America",
    accent: "accent-cyan",
    helper: "Largest western console and PC market",
    color: "#55e6ff",
    max: 10,
    step: 0.1
  },
  {
    key: "eu",
    label: "Europe",
    accent: "accent-blue",
    helper: "Cross-platform demand across EU territories",
    color: "#6f96ff",
    max: 10,
    step: 0.1
  },
  {
    key: "jp",
    label: "Japan",
    accent: "accent-pink",
    helper: "Strong signal for handheld and RPG segments",
    color: "#ff6d9c",
    max: 10,
    step: 0.1
  },
  {
    key: "other",
    label: "Other Regions",
    accent: "accent-amber",
    helper: "Rest-of-world performance and niche adoption",
    color: "#ffb054",
    max: 10,
    step: 0.1
  }
];

const tabs = [
  {
    id: "prediction",
    label: "Prediction",
    eyebrow: "Forecast Workspace",
    description: "Adjust regional sales inputs and run the model forecast."
  },
  {
    id: "analytics",
    label: "Analytics",
    eyebrow: "Live Telemetry",
    description: "Explore regional distribution with chart-driven analytics."
  },
  {
    id: "recommender",
    label: "Recommender",
    eyebrow: "Discovery Engine",
    description: "Browse platform-based game recommendations from the backend."
  },
  {
    id: "history",
    label: "History",
    eyebrow: "Forecast Archive",
    description: "Review previously generated predictions for this session."
  }
];

const tabTransitionMs = 280;

function SalesSlider({ config, value, onChange }) {
  return (
    <div className={`slider-card ${config.accent}`}>
      <div className="slider-header">
        <div>
          <p className="slider-label">{config.label}</p>
          <p className="slider-helper">{config.helper}</p>
        </div>
        <div className="slider-value">{Number(value).toFixed(1)}M</div>
      </div>

      <input
        className="sales-slider"
        type="range"
        min="0"
        max={config.max}
        step={config.step}
        value={value}
        onChange={(event) => onChange(config.key, Number(event.target.value))}
        aria-label={config.label}
      />

      <div className="slider-scale">
        <span>0M</span>
        <span>{config.max}M</span>
      </div>
    </div>
  );
}

function OverviewCard({ title, value, detail, accent }) {
  return (
    <div className={`overview-card ${accent}`}>
      <p className="overview-title">{title}</p>
      <h3>{value}</h3>
      <p className="overview-detail">{detail}</p>
    </div>
  );
}

function TopNavigation({ activeTab, onChange }) {
  return (
    <nav className="top-nav" aria-label="Dashboard sections">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={`top-nav-button ${activeTab === tab.id ? "is-active" : ""}`}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}

function SectionIntro({ activeTab }) {
  const currentTab = tabs.find((tab) => tab.id === activeTab) || tabs[0];

  return (
    <section className="panel section-intro section-animate">
      <p className="eyebrow">{currentTab.eyebrow}</p>
      <h2>{currentTab.label}</h2>
      <p className="section-copy">{currentTab.description}</p>
    </section>
  );
}

function SalesDistributionChart({ sales, totalSales }) {
  const labels = sliderConfig.map((item) => item.label);
  const values = sliderConfig.map((item) => sales[item.key]);
  const colors = sliderConfig.map((item) => item.color);

  const doughnutData = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: colors,
        borderColor: "rgba(8, 13, 28, 0.88)",
        borderWidth: 4,
        hoverOffset: 10
      }
    ]
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "68%",
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#d9e4ff",
          usePointStyle: true,
          pointStyle: "circle",
          padding: 18
        }
      },
      tooltip: {
        callbacks: {
          label(context) {
            const value = context.raw || 0;
            const share = totalSales > 0 ? (value / totalSales) * 100 : 0;
            return `${context.label}: ${value.toFixed(1)}M (${share.toFixed(1)}%)`;
          }
        }
      }
    }
  };

  const barData = {
    labels,
    datasets: [
      {
        label: "Sales (Millions)",
        data: values,
        backgroundColor: colors,
        borderRadius: 10,
        borderSkipped: false
      }
    ]
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: { color: "#afbddf" },
        grid: { display: false }
      },
      y: {
        beginAtZero: true,
        ticks: { color: "#afbddf" },
        grid: { color: "rgba(128, 154, 214, 0.16)" }
      }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label(context) {
            return `${context.raw.toFixed(1)}M units`;
          }
        }
      }
    }
  };

  return (
    <section className="panel chart-panel">
      <div className="panel-heading chart-heading">
        <div>
          <p className="eyebrow">Sales Telemetry</p>
          <h2>Regional Distribution</h2>
        </div>
        <div className="chart-total-pill">{totalSales.toFixed(1)}M total</div>
      </div>

      <div className="chart-layout">
        <div className="chart-card doughnut-card">
          <div className="chart-canvas chart-canvas-doughnut">
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
          <div className="chart-center-copy">
            <span>Live Mix</span>
            <strong>{totalSales.toFixed(1)}M</strong>
          </div>
        </div>

        <div className="chart-card bar-card">
          <div className="chart-canvas chart-canvas-bar">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>
      </div>
    </section>
  );
}

function RecommendationPanel({
  platforms,
  selectedPlatform,
  onPlatformChange,
  recommendations,
  isLoading,
  error
}) {
  return (
    <section className="panel recommendation-panel">
      <div className="panel-heading recommendation-heading">
        <div>
          <p className="eyebrow">Game Recommender</p>
          <h2>Platform Picks</h2>
        </div>
      </div>

      <label className="select-label" htmlFor="platform-select">
        Select platform
      </label>
      <select
        id="platform-select"
        className="platform-select"
        value={selectedPlatform}
        onChange={(event) => onPlatformChange(event.target.value)}
        disabled={!platforms.length}
      >
        {platforms.length ? null : <option value="">Loading platforms...</option>}
        {platforms.map((platform) => (
          <option key={platform} value={platform}>
            {platform}
          </option>
        ))}
      </select>

      {error ? <p className="recommendation-message error-text">{error}</p> : null}
      {isLoading ? (
        <p className="recommendation-message">Loading recommended games...</p>
      ) : null}
      {!isLoading && !error && recommendations.length === 0 ? (
        <p className="recommendation-message">
          No recommendations available for this platform yet.
        </p>
      ) : null}

      <div className="recommendation-list">
        {recommendations.map((game, index) => (
          <article className="recommendation-item" key={`${game.name}-${index}`}>
            <div>
              <span className="recommendation-rank">#{index + 1}</span>
              <h3>{game.name}</h3>
            </div>
            <div className="recommendation-sales">{game.sales.toFixed(2)}M</div>
          </article>
        ))}
      </div>
    </section>
  );
}

function PredictionHistory({ items }) {
  return (
    <section className="panel history-panel">
      <div className="panel-heading history-heading">
        <div>
          <p className="eyebrow">Prediction History</p>
          <h2>Recent Forecasts</h2>
        </div>
      </div>

      {!items.length ? (
        <p className="history-empty">
          Your previous predictions will appear here after you run the model.
        </p>
      ) : (
        <div className="history-list">
          {items.map((item) => (
            <article className="history-item" key={item.id}>
              <div className="history-item-top">
                <div>
                  <span className="history-label">Prediction</span>
                  <h3>{item.prediction}</h3>
                </div>
                <div className="history-confidence">{item.confidence.toFixed(2)}%</div>
              </div>

              <p className="history-total">Total input: {item.totalSales.toFixed(1)}M</p>

              <div className="history-metrics">
                {sliderConfig.map((region) => (
                  <div className="history-metric" key={`${item.id}-${region.key}`}>
                    <span>{region.label}</span>
                    <strong>{item.inputs[region.key].toFixed(1)}M</strong>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function ResultCard({ result }) {
  if (!result) {
    return (
      <section className="panel result-panel result-empty">
        <div className="panel-heading">
          <p className="eyebrow">Prediction Output</p>
          <h2>Awaiting analysis</h2>
        </div>
        <p className="empty-copy">
          Adjust regional sales signals, then run the model to see the projected
          performance tier and confidence score.
        </p>
      </section>
    );
  }

  const confidence = Math.max(0, Math.min(100, Number(result.confidence) || 0));

  return (
    <section className="panel result-panel result-ready">
      <div className="panel-heading">
        <p className="eyebrow">Prediction Output</p>
        <h2>Model forecast ready</h2>
      </div>

      <div className="prediction-highlight">
        <span className="prediction-tag">Predicted Tier</span>
        <h3>{result.prediction}</h3>
      </div>

      <div className="confidence-block">
        <div className="confidence-header">
          <span>Confidence</span>
          <strong>{confidence.toFixed(2)}%</strong>
        </div>
        <div
          className="confidence-track"
          role="progressbar"
          aria-valuenow={confidence}
          aria-valuemin="0"
          aria-valuemax="100"
          aria-label="Prediction confidence"
        >
          <div
            className="confidence-fill"
            style={{ width: `${confidence}%` }}
          />
        </div>
      </div>
    </section>
  );
}

function TabContent({
  tab,
  sales,
  totalSales,
  result,
  isLoading,
  handleSliderChange,
  handlePredict,
  platforms,
  selectedPlatform,
  setSelectedPlatform,
  recommendations,
  isRecommendationsLoading,
  recommendationError,
  predictionHistory
}) {
  if (tab === "prediction") {
    return (
      <section className="dashboard-grid">
        <section className="panel control-panel">
          <div className="panel-heading">
            <p className="eyebrow">Input Controls</p>
            <h2>Regional Sales Mix</h2>
          </div>

          <div className="slider-grid">
            {sliderConfig.map((item) => (
              <SalesSlider
                key={item.key}
                config={item}
                value={sales[item.key]}
                onChange={handleSliderChange}
              />
            ))}
          </div>

          <button
            className="predict-button"
            onClick={handlePredict}
            disabled={isLoading}
          >
            {isLoading ? "Running prediction..." : "Run prediction"}
          </button>
        </section>

        <ResultCard result={result} />
      </section>
    );
  }

  if (tab === "analytics") {
    return <SalesDistributionChart sales={sales} totalSales={totalSales} />;
  }

  if (tab === "recommender") {
    return (
      <RecommendationPanel
        platforms={platforms}
        selectedPlatform={selectedPlatform}
        onPlatformChange={setSelectedPlatform}
        recommendations={recommendations}
        isLoading={isRecommendationsLoading}
        error={recommendationError}
      />
    );
  }

  return <PredictionHistory items={predictionHistory} />;
}

function App() {
  const [activeTab, setActiveTab] = useState("prediction");
  const [displayedTab, setDisplayedTab] = useState("prediction");
  const [isTabVisible, setIsTabVisible] = useState(true);
  const [sales, setSales] = useState({
    na: 1,
    eu: 0.5,
    jp: 0.2,
    other: 0.1
  });
  const [result, setResult] = useState(null);
  const [predictionHistory, setPredictionHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [platforms, setPlatforms] = useState([]);
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [isRecommendationsLoading, setIsRecommendationsLoading] = useState(false);
  const [recommendationError, setRecommendationError] = useState("");

  const totalSales = Object.values(sales).reduce((sum, value) => sum + value, 0);
  const strongestMarket =
    sliderConfig.reduce(
      (best, item) => {
        if (sales[item.key] > best.value) {
          return { label: item.label, value: sales[item.key] };
        }
        return best;
      },
      { label: sliderConfig[0].label, value: sales[sliderConfig[0].key] }
    ).label;

  useEffect(() => {
    const loadPlatforms = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/analytics`);
        const availablePlatforms = response.data.platforms || [];
        setPlatforms(availablePlatforms);
        if (availablePlatforms.length > 0) {
          setSelectedPlatform(availablePlatforms[0]);
        }
      } catch (error) {
        console.error(error);
        setRecommendationError("Unable to load platforms right now.");
      }
    };

    loadPlatforms();
  }, []);

  useEffect(() => {
    if (!selectedPlatform) {
      return;
    }

    const loadRecommendations = async () => {
      setIsRecommendationsLoading(true);
      setRecommendationError("");

      try {
        const response = await axios.get(`${API_BASE_URL}/recommend`, {
          params: { platform: selectedPlatform }
        });

        const games = response.data.games || [];
        const salesValues = response.data.sales || [];

        setRecommendations(
          games.map((name, index) => ({
            name,
            sales: Number(salesValues[index] || 0)
          }))
        );
      } catch (error) {
        console.error(error);
        setRecommendationError("Unable to load recommendations for this platform.");
        setRecommendations([]);
      } finally {
        setIsRecommendationsLoading(false);
      }
    };

    loadRecommendations();
  }, [selectedPlatform]);

  useEffect(() => {
    if (activeTab === displayedTab) {
      setIsTabVisible(true);
      return undefined;
    }

    setIsTabVisible(false);

    const switchTimer = window.setTimeout(() => {
      setDisplayedTab(activeTab);
      setIsTabVisible(true);
    }, tabTransitionMs / 2);

    return () => window.clearTimeout(switchTimer);
  }, [activeTab, displayedTab]);

  const handleSliderChange = (key, value) => {
    setSales((current) => ({
      ...current,
      [key]: value
    }));
  };

  const handlePredict = async () => {
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/predict`, sales);
      setResult(response.data);
      setPredictionHistory((current) => [
        {
          id: Date.now(),
          prediction: response.data.prediction,
          confidence: Number(response.data.confidence) || 0,
          inputs: { ...sales },
          totalSales: Object.values(sales).reduce((sum, value) => sum + value, 0)
        },
        ...current
      ]);
      setActiveTab("history");
    } catch (error) {
      console.error(error);
      alert("API error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="dashboard-shell">
      <div className="dashboard-backdrop" />

      <section className="hero-card section-animate">
        <div className="hero-brand">
          <div className="hero-icon" aria-hidden="true">
            <span className="hero-icon-core">VG</span>
          </div>

          <div className="hero-copy">
            <p className="eyebrow">Gaming Forecast Console</p>
            <h1>Video Games Sales Intelligence</h1>
            <p className="hero-subtitle">
              Intelligent forecasting, analytics, and discovery tools for
              modern game sales teams.
            </p>
            <p className="hero-text">
              Tune regional sales inputs, inspect live analytics, browse
              recommendations, and review prior forecasts from a single control
              center.
            </p>
          </div>
        </div>

        <div className="overview-grid">
          <OverviewCard
            title="Total Input"
            value={`${totalSales.toFixed(1)}M`}
            detail="Combined regional sales signal"
            accent="overview-cyan"
          />
          <OverviewCard
            title="Strongest Region"
            value={strongestMarket}
            detail="Highest current market weight"
            accent="overview-blue"
          />
        </div>
      </section>

      <TopNavigation activeTab={activeTab} onChange={setActiveTab} />
      <SectionIntro activeTab={displayedTab} />

      <div
        className={`tab-transition-shell ${isTabVisible ? "is-visible" : "is-hidden"}`}
        style={{ "--tab-transition-ms": `${tabTransitionMs}ms` }}
      >
        <TabContent
          tab={displayedTab}
          sales={sales}
          totalSales={totalSales}
          result={result}
          isLoading={isLoading}
          handleSliderChange={handleSliderChange}
          handlePredict={handlePredict}
          platforms={platforms}
          selectedPlatform={selectedPlatform}
          setSelectedPlatform={setSelectedPlatform}
          recommendations={recommendations}
          isRecommendationsLoading={isRecommendationsLoading}
          recommendationError={recommendationError}
          predictionHistory={predictionHistory}
        />
      </div>

      <footer className="dashboard-footer">
        <div className="footer-copy">
          <p className="footer-project">Video Games Sales Intelligence</p>
          <p className="footer-developer">Developed by Hemant Sharma (HKS)</p>
        </div>

        <a
          className="footer-link"
          href="https://github.com/artist-hks"
          target="_blank"
          rel="noreferrer"
        >
          GitHub Profile
        </a>
      </footer>
    </main>
  );
}

export default App;
