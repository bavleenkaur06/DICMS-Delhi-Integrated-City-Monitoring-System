
import { useMemo, useState } from "react";
import OfficerLayout from "./layout";
import { cityOverview, localityData } from "../../data/citizendata";
import "./citymonitoring.css";

function getRisk(locality) {
  const risk = String(locality.risk || "").toLowerCase();
  const aqi = Number(locality.aqi || 0);

  if (risk.includes("high") || aqi >= 200) return "High";
  if (risk.includes("moderate") || aqi >= 150) return "Moderate";
  return "Low";
}

function slug(value = "") {
  return value.toLowerCase().replaceAll(" ", "-");
}

function CityMonitoring() {
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState("All");

  const localities = useMemo(() => {
    return (localityData || []).filter((locality) => {
      const name = locality.name || locality.area || "";
      const term = search.trim().toLowerCase();

      const matchesSearch = !term ||
        `${name} ${locality.district || ""}`.toLowerCase().includes(term);

      const matchesRisk =
        riskFilter === "All" || getRisk(locality) === riskFilter;

      return matchesSearch && matchesRisk;
    });
  }, [search, riskFilter]);

  const riskCounts = useMemo(() => {
    const all = localityData || [];

    return {
      high: all.filter((item) => getRisk(item) === "High").length,
      moderate: all.filter((item) => getRisk(item) === "Moderate").length,
      low: all.filter((item) => getRisk(item) === "Low").length
    };
  }, []);

  const aqi = Number(cityOverview.aqi || 0);
  const aqiPosition = Math.min(100, Math.max(0, (aqi / 300) * 100));

  return (
    <OfficerLayout>
      <div className="officer-page city-monitoring-page">

        <div className="officer-page-heading">
          <div>
            <div className="page-eyebrow">ENVIRONMENT & CIVIC CONDITIONS</div>
            <h1>City Monitoring</h1>
            <p>
              Monitor environmental conditions and locality-level
              risk indicators across Delhi.
            </p>
          </div>
        </div>

        {/* City Overview */}
        <section className="city-overview-card">
          <div className="city-overview-content">
            <div className="page-eyebrow">DELHI CITY OVERVIEW</div>
            <h2>Air Quality Index</h2>
            <p>Current city-wide air quality reading</p>

            <div className="city-aqi-display">
              <strong className="city-aqi-number">{aqi}</strong>
              <span className="city-aqi-category">
                {cityOverview.aqiCategory }
              </span>
            </div>

            <div className="aqi-scale">
              <div className="aqi-scale-track">
                <span
                  className="aqi-scale-indicator"
                  style={{ left: `${aqiPosition}%` }}
                />
              </div>
            </div>

            <div className="city-updated">
              Last updated: {cityOverview.lastUpdated}
            </div>
          </div>

          <div className="city-overview-decoration">
            <div className="aqi-circle">
              <span>AQI</span>
              <strong>{aqi}</strong>
            </div>
          </div>
        </section>

        {/* Environmental Statistics */}
        <section className="environment-stats-grid">
          <EnvironmentStat
            icon="☀"
            label="Temperature"
            value={cityOverview.temperature != null
              ? `${cityOverview.temperature}°C`
              : "—"}
          />

          <EnvironmentStat
            icon="💧"
            label="Rainfall"
            value={cityOverview.rainfall != null
              ? `${cityOverview.rainfall} ${cityOverview.rainfallUnit || "mm"}`
              : "—"}
          />

          <EnvironmentStat
            icon="◉"
            label="Humidity"
            value={cityOverview.humidity != null
              ? `${cityOverview.humidity}%`
              : "—"}
          />

          <EnvironmentStat
            icon="↝"
            label="Wind Speed"
            value={cityOverview.windSpeed != null
              ? `${cityOverview.windSpeed} km/h`
              : "—"}
          />
        </section>

        {/* Risk Distribution */}
        <section className="locality-risk-overview">
          <div className="locality-risk-heading">
            <div>
              <h3>Locality Risk Distribution</h3>
              <p>
                Risk classification based on available locality AQI readings
              </p>
            </div>

            <span className="record-count">
              {(localityData || []).length} monitored localities
            </span>
          </div>

          <div className="risk-distribution-grid">
            <RiskCard
              title="High Risk"
              count={riskCounts.high}
              tone="high"
              description="Requires closer monitoring"
            />

            <RiskCard
              title="Moderate Risk"
              count={riskCounts.moderate}
              tone="moderate"
              description="Monitor changing conditions"
            />

            <RiskCard
              title="Low Risk"
              count={riskCounts.low}
              tone="low"
              description="Routine monitoring"
            />
          </div>
        </section>

        {/* Locality Details */}
        <section className="locality-panel">
          <div className="panel-heading">
            <div>
              <h3>Locality Conditions</h3>
              <p>
                Environmental readings and civic movement indicators
              </p>
            </div>

            <span className="record-count">
              {localities.length} localities
            </span>
          </div>

          <div className="locality-filters">
            <input
              className="officer-search"
              type="search"
              placeholder="Search locality or district..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
            >
              <option value="All">All risk levels</option>
              <option value="High">High risk</option>
              <option value="Moderate">Moderate risk</option>
              <option value="Low">Low risk</option>
            </select>
          </div>

          <div className="locality-grid">
            {localities.length > 0 ? (
              localities.map((locality, index) => {
                const name = locality.name || locality.area || "Unknown locality";
                const risk = getRisk(locality);

                return (
                  <article
                    className="locality-card"
                    key={`${name}-${index}`}
                  >
                    <div className="locality-card-heading">
                      <div>
                        <h4>{name}</h4>
                        <p>{locality.district || "Delhi"}</p>
                      </div>

                      <span className={`risk-badge ${slug(risk)}`}>
                        {risk} Risk
                      </span>
                    </div>

                    <div className="locality-aqi-row">
                      <strong>{locality.aqi ?? "—"}</strong>
                      <span className="locality-aqi-category">
                        AQI · {locality.aqiCategory  }
                      </span>
                    </div>

                    <div className="locality-metrics">
                      <div>
                        <small>Temperature</small>
                        <strong>
                          {locality.temperature != null
                            ? `${locality.temperature}°C`
                            : "—"}
                        </strong>
                      </div>

                      <div>
                        <small>Rainfall</small>
                        <strong>
                          {locality.rainfall != null
                            ? `${locality.rainfall} mm`
                            : "—"}
                        </strong>
                      </div>
                    </div>

                    <div className="locality-traffic">
                      <span>Traffic / Movement</span>
                      <strong>{locality.traffic}</strong>
                    </div>

                    <div className="locality-risk-line">
                      <div className={slug(risk)} />
                    </div>
                  </article>
                );
              })
            ) : (
              <div className="empty-state">
                No localities match your search or selected risk level.
              </div>
            )}
          </div>
        </section>

      </div>
    </OfficerLayout>
  );
}

function EnvironmentStat({ icon, label, value }) {
  return (
    <article className="environment-stat">
      <span className="environment-stat-icon">{icon}</span>
      <div>
        <p>{label}</p>
        <strong>{value ?? "—"}</strong>
      </div>
    </article>
  );
}

function RiskCard({ title, count, tone, description }) {
  return (
    <article className={`risk-distribution-card ${tone}`}>
      <p>{title}</p>
      <strong>{count}</strong>
      <small>{description}</small>
    </article>
  );
}

export default CityMonitoring;
