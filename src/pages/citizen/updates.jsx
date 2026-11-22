
import { useState } from "react";
import CitizenNavbar from "../shared/navbar";
import { alerts, newsData } from "../../data/citizendata";
import "./updates.css";

function DelhiUpdates() {
  const [filter, setFilter] = useState("All");
  const [alertFilter, setAlertFilter] = useState("All");
  const [search, setSearch] = useState("");

  const categories = [
    "All",
    "Environment",
    "Weather",
    "Traffic",
    "Public Safety"
  ];

  const alertCategories = [
    "All",
    "Official",
    "Priority",
    "Environment",
    "Weather",
    "Traffic",
    "Public Safety"
  ];

  const normalizeCategory = (category) => {
    const value = String(category || "").toLowerCase().trim();

    if (["air quality", "pollution", "environment"].includes(value))
      return "Environment";

    if (["safety", "public safety", "emergency"].includes(value))
      return "Public Safety";

    if (["road", "traffic"].includes(value))
      return "Traffic";

    if (value === "weather") return "Weather";

    return category;
  };

  const isOfficial = (alert) =>
    alert.official === true ||
    /government|govt|police|delhi police|traffic police/i.test(
      alert.source || ""
    );

  const isPriority = (alert) =>
    ["critical", "high"].includes(
      String(alert.level || "").toLowerCase().trim()
    );

  const cleanSource = (source) => {
    if (!source) return "";

    if (/demo|environment desk/i.test(source)) return "";

    return source;
  };

  const filteredNews = newsData.filter((item) => {
    const term = search.trim().toLowerCase();

    const matchesCategory =
      filter === "All" || normalizeCategory(item.category) === filter;

    const matchesSearch =
      !term ||
      item.title?.toLowerCase().includes(term) ||
      item.summary?.toLowerCase().includes(term) ||
      item.area?.toLowerCase().includes(term);

    return matchesCategory && matchesSearch;
  });

  const filteredAlerts = alerts.filter((alert) => {
    if (alertFilter === "All") return true;

    if (alertFilter === "Official") return isOfficial(alert);

    if (alertFilter === "Priority") return isPriority(alert);

    return normalizeCategory(alert.category) === alertFilter;
  });

  return (
    <div className="updates-page">
      <CitizenNavbar />

      <main className="updates-container">
        <section className="updates-intro">
          <p className="eyebrow">CITY INFORMATION & PUBLIC AWARENESS</p>
          <h1>Delhi Updates</h1>
          <p>
            Stay informed about important city developments, public
            announcements, weather conditions and safety advisories.
          </p>
        </section>

        {/* NEWS */}
        <section className="updates-section">
          <div className="updates-heading">
            <div>
              <p className="eyebrow">LATEST DEVELOPMENTS</p>
              <h2>News & City Reports</h2>
              <p className="section-description">
                Explore important updates from across Delhi.
              </p>
            </div>

            <span className="updates-count">
              {filteredNews.length} Updates
            </span>
          </div>

          <div className="news-search">
            <input
              type="text"
              placeholder="Search by news, keyword or area..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="news-filters">
            {categories.map((category) => (
              <button
                key={category}
                className={filter === category ? "selected" : ""}
                onClick={() => setFilter(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="news-list">
            {filteredNews.map((item) => (
              <article className="news-item" key={item.id}>
                <div className="news-item-meta">
                  <span className="news-category">
                    {normalizeCategory(item.category)}
                  </span>
                  <span>{item.date}</span>
                </div>

                <h3>{item.title}</h3>

                <p className="news-summary">{item.summary}</p>

                <div className="news-item-footer">
                  <span>{item.area}</span>
                  {cleanSource(item.source) && (
                    <span>{cleanSource(item.source)}</span>
                  )}
                </div>

                {item.url && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="read-more-link"
                  >
                    Read Full Article <span>↗</span>
                  </a>
                )}
              </article>
            ))}

            {filteredNews.length === 0 && (
              <p className="empty-news">
                No updates found. Try another search or category.
              </p>
            )}
          </div>
        </section>

        {/* ALERTS */}
        <section className="updates-section">
          <div className="updates-heading">
            <div>
              <p className="eyebrow">IMPORTANT NOTIFICATIONS</p>
              <h2>Alerts & Advisories</h2>
              <p className="section-description">
                Important public notifications and safety information.
              </p>
            </div>

            <span className="updates-count">
              {filteredAlerts.length} Alerts
            </span>
          </div>

          <div className="alert-filters">
            {alertCategories.map((category) => (
              <button
                key={category}
                className={alertFilter === category ? "selected" : ""}
                onClick={() => setAlertFilter(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="updates-alerts">
            {filteredAlerts.map((alert) => {
              const official = isOfficial(alert);
              const priority = isPriority(alert);

              return (
                <article
                  className={`updates-alert ${
                    official ? "official-alert" : ""
                  } ${priority ? "priority-alert" : ""}`}
                  key={alert.id}
                >
                  <div className="updates-alert-top">
                    <span>{normalizeCategory(alert.category)}</span>
                    <span>
                      {alert.date} {alert.time ? `· ${alert.time}` : ""}
                    </span>
                  </div>

                  <div className="alert-labels">
                    {official && (
                      <span className="official-label">
                        OFFICIAL NOTIFICATION
                      </span>
                    )}

                    {priority && (
                      <span className="priority-label">
                        {String(alert.level).toUpperCase()} PRIORITY
                      </span>
                    )}
                  </div>

                  <h3>{alert.title}</h3>

                  <p className="alert-description">
                    {alert.description}
                  </p>

                  <div className="updates-alert-bottom">
                    <span>{alert.area}</span>
                    {cleanSource(alert.source) && (
                      <span>Source: {cleanSource(alert.source)}</span>
                    )}
                  </div>

                  {alert.url && (
                    <a
                      href={alert.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="alert-read-link"
                    >
                      Read Full Advisory <span>↗</span>
                    </a>
                  )}
                </article>
              );
            })}

            {filteredAlerts.length === 0 && (
              <p className="empty-news">
                No alerts available in this category.
              </p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default DelhiUpdates;
