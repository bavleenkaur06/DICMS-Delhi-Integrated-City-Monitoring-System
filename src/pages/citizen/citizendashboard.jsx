import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CitizenNavbar from "../shared/navbar";
import {
  cityOverview,
  alerts,
  localityData,
  getReports
} from "../../data/citizendata";
import "./citizendashboard.css";

const emergencyContacts = [
  { title: "National Emergency", number: "112", detail: "All emergency services" },
  { title: "Police", number: "100", detail: "Police assistance" },
  { title: "Fire Brigade", number: "101", detail: "Fire and rescue" },
  { title: "Ambulance", number: "108", detail: "Medical emergency" }
];

const guidelines = [
  {
    title: "Fire Emergency",
    steps: [
      "Move away from the fire and alert people nearby.",
      "Use stairs instead of lifts.",
      "Stay low to avoid inhaling smoke.",
      "Call 101 or 112 for assistance."
    ]
  },
  {
    title: "Road Accident",
    steps: [
      "Move to a safe place away from moving traffic.",
      "Call 112 and share the exact location.",
      "Avoid moving seriously injured people unless there is immediate danger.",
      "Keep the area clear for emergency responders."
    ]
  },
  {
    title: "Medical Emergency",
    steps: [
      "Call 108 or 112 for emergency assistance.",
      "Share the person's condition and exact location.",
      "Follow instructions from emergency operators.",
      "Do not give food or water to an unconscious person."
    ]
  },
  {
    title: "Flooding and Waterlogging",
    steps: [
      "Avoid walking or driving through floodwater.",
      "Stay away from exposed electrical wires.",
      "Move to higher ground if water levels rise.",
      "Report blocked roads and dangerous locations."
    ]
  }
];

function getAqiLabel(aqi) {
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Satisfactory";
  if (aqi <= 200) return "Moderate";
  if (aqi <= 300) return "Poor";
  if (aqi <= 400) return "Very Poor";
  return "Severe";
}

function getAqiColor(aqi) {
  if (aqi <= 50) return "#27865b";
  if (aqi <= 100) return "#8a9d38";
  if (aqi <= 200) return "#c18a2d";
  if (aqi <= 300) return "#cf633e";
  if (aqi <= 400) return "#a64d58";
  return "#773e68";
}

function getLevelClass(level) {
  const value = String(level || "").toLowerCase();

  if (value === "critical") return "critical";
  if (value === "high") return "high";
  if (value === "moderate" || value === "medium") return "moderate";

  return "advisory";
}

function CitizenDashboard() {
  const navigate = useNavigate();
  const [reports] = useState(() => getReports());

  const aqi = Number(cityOverview.aqi) || 0;
  const aqiProgress = Math.min(Math.max(aqi / 500, 0), 1);
  const aqiColor = getAqiColor(aqi);

  const reportCounts = {
    submitted: reports.filter(
      (report) => String(report.status).toLowerCase() === "submitted"
    ).length,
    underReview: reports.filter(
      (report) => String(report.status).toLowerCase() === "under review"
    ).length,
    dispatched: reports.filter(
      (report) => String(report.status).toLowerCase() === "dispatched"
    ).length,
    resolved: reports.filter(
      (report) => String(report.status).toLowerCase() === "resolved"
    ).length
  };

  const activeReports =
    reportCounts.submitted +
    reportCounts.underReview +
    reportCounts.dispatched;

  const displayAlerts = alerts.slice(0, 4);
  const displayLocalities = localityData.slice(0, 4);

  return (
    <div className="citizen-dashboard">
      <CitizenNavbar />

      <main className="citizen-dashboard-main">
        {/* Welcome section */}
        <section className="dashboard-welcome">
          <div>
            <span className="dashboard-eyebrow">CITIZEN DASHBOARD</span>
            <h1>Delhi, at a glance.</h1>
            <p>
              Stay informed about city conditions, important alerts and
              emergency services.
            </p>
          </div>

        </section>

        {/* Emergency banner */}
        <section className="emergency-banner">
          <div className="emergency-banner-content">
            <span className="emergency-banner-label">NEED IMMEDIATE HELP?</span>
            <h2>Report an emergency</h2>
            <p>
              Report accidents, fire incidents, medical emergencies and other
              urgent situations.
            </p>
          </div>

          <button
            className="emergency-report-button"
            onClick={() => navigate("/citizen/report")}
          >
            Report an Emergency
            <span aria-hidden="true">→</span>
          </button>
        </section>

        {/* Emergency quick contacts */}
        <section className="dashboard-section">
          <div className="dashboard-section-heading">
            <div>
              <span className="dashboard-eyebrow">QUICK ACCESS</span>
              <h2>Emergency contacts</h2>
              <p>Reach the appropriate emergency service directly.</p>
            </div>
          </div>

          <div className="emergency-contact-grid">
            {emergencyContacts.map((contact) => (
              <a
                href={`tel:${contact.number}`}
                className="emergency-contact-card"
                key={contact.number}
              >
                <div className="contact-card-top">
                  <span>{contact.title}</span>
                  <span className="contact-call-icon">↗</span>
                </div>
                <strong>{contact.number}</strong>
                <small>{contact.detail}</small>
              </a>
            ))}
          </div>
        </section>

        {/* City overview */}
        <section className="dashboard-section city-overview-section">
          <div className="dashboard-section-heading">
            <div>
              <span className="dashboard-eyebrow">CITY CONDITIONS</span>
              <h2>City overview</h2>
              <p>Environmental conditions across Delhi.</p>
            </div>

            <span className="last-updated">
              Updated: {cityOverview.lastUpdated || "Latest available reading"}
            </span>
          </div>

          <div className="city-visual-grid">
            {/* AQI gauge */}
            <article className="city-visual-card aqi-visual-card">
              <div className="visual-card-heading">
                <div>
                  <span className="visual-card-label">AIR QUALITY INDEX</span>
                  <h3>Air quality</h3>
                </div>
                <span
                  className="condition-dot"
                  style={{ backgroundColor: aqiColor }}
                />
              </div>

              <div className="aqi-gauge">
                <svg viewBox="0 0 220 130" role="img" aria-label={`AQI ${aqi}`}>
                  <path
                    d="M 20 110 A 90 90 0 0 1 200 110"
                    fill="none"
                    stroke="#e9eeee"
                    strokeWidth="16"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 20 110 A 90 90 0 0 1 200 110"
                    fill="none"
                    stroke={aqiColor}
                    strokeWidth="16"
                    strokeLinecap="round"
                    strokeDasharray="283"
                    strokeDashoffset={283 * (1 - aqiProgress)}
                  />
                </svg>

                <div className="aqi-gauge-value">
                  <strong>{aqi}</strong>
                  <span>{cityOverview.aqiCategory || getAqiLabel(aqi)}</span>
                </div>
              </div>

              <div className="aqi-scale">
                <span>0</span>
                <span>500</span>
              </div>

              <p className="visual-card-note">
                Higher AQI indicates poorer air quality.
              </p>
            </article>

            {/* Temperature */}
            <article className="city-visual-card">
              <div className="visual-card-heading">
                <div>
                  <span className="visual-card-label">WEATHER</span>
                  <h3>Temperature</h3>
                </div>
                <span className="visual-symbol temperature-symbol">°</span>
              </div>

              <div className="temperature-visual">
                <div className="thermometer">
                  <div className="thermometer-track">
                    <div
                      className="thermometer-fill"
                      style={{
                        height: `${Math.min(
                          Math.max((Number(cityOverview.temperature) / 50) * 100, 8),
                          100
                        )}%`
                      }}
                    />
                  </div>
                  <div className="thermometer-bulb" />
                </div>

                <div className="temperature-reading">
                  <strong>{cityOverview.temperature}°C</strong>
                  <span>Current temperature</span>
                  <small>Feels like {cityOverview.feelsLike ?? cityOverview.temperature}°C</small>
                </div>
              </div>
            </article>

            {/* Rainfall */}
            <article className="city-visual-card">
              <div className="visual-card-heading">
                <div>
                  <span className="visual-card-label">PRECIPITATION</span>
                  <h3>Rainfall</h3>
                </div>
                <span className="visual-symbol rainfall-symbol">≈</span>
              </div>

              <div className="rainfall-visual">
                <div className="rainfall-drop">
                  <div className="rainfall-drop-inner" />
                </div>

                <div className="rainfall-reading">
                  <strong>
                    {cityOverview.rainfall}{" "}
                    <span>{cityOverview.rainfallUnit || "mm"}</span>
                  </strong>
                  <small>Recorded rainfall</small>
                </div>
              </div>
            </article>

            {/* Humidity */}
            <article className="city-visual-card">
              <div className="visual-card-heading">
                <div>
                  <span className="visual-card-label">ATMOSPHERE</span>
                  <h3>Humidity</h3>
                </div>
                <span className="visual-symbol humidity-symbol">%</span>
              </div>

              <div className="humidity-visual">
                <div
                  className="humidity-ring"
                  style={{
                    background: `conic-gradient(#398caa ${
                      Math.min(Number(cityOverview.humidity) || 0, 100) * 3.6
                    }deg, #e9f0f1 0deg)`
                  }}
                >
                  <div className="humidity-ring-inner">
                    <strong>{cityOverview.humidity}%</strong>
                  </div>
                </div>
                <span>Relative humidity</span>
              </div>
            </article>

            {/* Wind */}
            <article className="city-visual-card">
              <div className="visual-card-heading">
                <div>
                  <span className="visual-card-label">WIND CONDITIONS</span>
                  <h3>Wind speed</h3>
                </div>
                <span className="visual-symbol wind-symbol">↗</span>
              </div>

              <div className="wind-visual">
                <div className="wind-lines">
                  <span />
                  <span />
                  <span />
                </div>
                <div className="wind-reading">
                  <strong>{cityOverview.windSpeed}</strong>
                  <span>km/h</span>
                </div>
              </div>
            </article>

            {/* Warnings */}
            <article className="city-visual-card warning-visual-card">
              <div className="visual-card-heading">
                <div>
                  <span className="visual-card-label">CITY ADVISORIES</span>
                  <h3>Active warnings</h3>
                </div>
                <span className="warning-symbol">!</span>
              </div>

              <div className="warning-reading">
                <strong>{cityOverview.activeWarnings}</strong>
                <span>Active city advisories</span>
              </div>

              <button
                className="text-link-button"
                onClick={() => navigate("/citizen/updates")}
              >
                View all alerts <span>→</span>
              </button>
            </article>
          </div>
        </section>

        {/* Incident activity */}
        <section className="dashboard-section">
          <div className="dashboard-section-heading">
            <div>
              <span className="dashboard-eyebrow">REPORT ACTIVITY</span>
              <h2>Incident overview</h2>
              <p>Track the progress of emergency reports.</p>
            </div>

            <button
              className="dashboard-text-link"
              onClick={() => navigate("/citizen/track")}
            >
              Track a report →
            </button>
          </div>

          <div className="incident-summary-grid">
            <div className="incident-summary-card">
              <span className="incident-summary-label">Active reports</span>
              <strong>{activeReports}</strong>
              <small>Awaiting resolution</small>
            </div>

            <div className="incident-summary-card">
              <span className="incident-summary-label">Submitted</span>
              <strong>{reportCounts.submitted}</strong>
              <small>Received by the system</small>
            </div>

            <div className="incident-summary-card">
              <span className="incident-summary-label">Under review</span>
              <strong>{reportCounts.underReview}</strong>
              <small>Being assessed</small>
            </div>

            <div className="incident-summary-card">
              <span className="incident-summary-label">Dispatched</span>
              <strong>{reportCounts.dispatched}</strong>
              <small>Response in progress</small>
            </div>

            <div className="incident-summary-card">
              <span className="incident-summary-label">Resolved</span>
              <strong>{reportCounts.resolved}</strong>
              <small>Completed reports</small>
            </div>
          </div>
        </section>

        {/* Alerts */}
        <section className="dashboard-section">
          <div className="dashboard-section-heading">
            <div>
              <span className="dashboard-eyebrow">IMPORTANT INFORMATION</span>
              <h2>Official alerts and advisories</h2>
              <p>Updates about weather, traffic, environment and public safety.</p>
            </div>

            <button
              className="dashboard-text-link"
              onClick={() => navigate("/citizen/updates")}
            >
              View all updates →
            </button>
          </div>

          <div className="dashboard-alert-list">
            {displayAlerts.length > 0 ? (
              displayAlerts.map((alert) => (
                <article className="dashboard-alert-card" key={alert.id}>
                  <div className="alert-card-main">
                    <div className="alert-card-meta">
                      <span className="alert-category">{alert.category}</span>
                      <span className={`alert-level ${getLevelClass(alert.level)}`}>
                        {alert.level || "Advisory"}
                      </span>
                    </div>

                    <h3>{alert.title}</h3>
                    <p>{alert.description}</p>

                    <div className="alert-card-footer">
                      <span>{alert.source}</span>
                      <span>{alert.area}</span>
                      <span>
                        {[alert.date, alert.time].filter(Boolean).join(" · ")}
                      </span>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="dashboard-empty-state">
                No current alerts are available.
              </div>
            )}
          </div>
        </section>

        {/* Locality monitoring */}
        <section className="dashboard-section">
          <div className="dashboard-section-heading">
            <div>
              <span className="dashboard-eyebrow">LOCAL CONDITIONS</span>
              <h2>Locality monitoring</h2>
              <p>Environmental and road conditions in selected Delhi areas.</p>
            </div>

            <button
              className="dashboard-text-link"
              onClick={() => navigate("/citizen/area-conditions")}
            >
              Explore localities →
            </button>
          </div>

          <div className="locality-monitoring-grid">
            {displayLocalities.map((locality) => (
              <article className="locality-monitor-card" key={locality.name}>
                <div className="locality-card-heading">
                  <div>
                    <h3>{locality.name}</h3>
                    <span>{locality.district}</span>
                  </div>
                  <span
                    className={`locality-aqi-tag ${
                      Number(locality.aqi) > 200
                        ? "locality-aqi-high"
                        : Number(locality.aqi) > 100
                        ? "locality-aqi-medium"
                        : "locality-aqi-low"
                    }`}
                  >
                    AQI {locality.aqi}
                  </span>
                </div>

                <div className="locality-condition">
                  <span>Air quality</span>
                  <strong>{locality.category}</strong>
                </div>

                <div className="locality-condition">
                  <span>Temperature</span>
                  <strong>{locality.temperature}°C</strong>
                </div>

                <div className="locality-condition">
                  <span>Rainfall</span>
                  <strong>{locality.rainfall}</strong>
                </div>

                <div className="locality-condition">
                  <span>Road condition</span>
                  <strong>{locality.road}</strong>
                </div>

                <div className="locality-card-footer">
                  <span>{locality.condition}</span>
                  <small>{locality.updated}</small>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Emergency guidelines */}
        <section className="dashboard-section emergency-guidelines-section">
          <div className="dashboard-section-heading">
            <div>
              <span className="dashboard-eyebrow">EMERGENCY SUPPORT</span>
              <h2>What to do in an emergency</h2>
              <p>Follow these safety steps while help is on the way.</p>
            </div>
          </div>

          <div className="guideline-grid">
            {guidelines.map((guideline, index) => (
              <article className="guideline-card" key={guideline.title}>
                <div className="guideline-card-heading">
                  <span className="guideline-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3>{guideline.title}</h3>
                </div>

                <ul>
                  {guideline.steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <div className="guideline-emergency-note">
            <div>
              <strong>Facing an immediate emergency?</strong>
              <span>Call the national emergency number for urgent assistance.</span>
            </div>
            <a href="tel:112">Call 112</a>
          </div>
        </section>

        {/* Footer */}
        <footer className="citizen-dashboard-footer">
          <span>DICMS</span>
          <span>Delhi City Information & Emergency Response</span>
        </footer>
      </main>
    </div>
  );
}

export default CitizenDashboard;