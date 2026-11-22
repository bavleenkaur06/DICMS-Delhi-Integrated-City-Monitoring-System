import { useEffect, useMemo, useState } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  useMap,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";
import CitizenNavbar from "../shared/navbar";
import { localityData } from "../../data/citizendata";
import "./areaconditions.css";

const localityCoordinates = {
  "Anand Vihar": [28.6469, 77.3160],
  "Dwarka": [28.5921, 77.0460],
  "Rohini": [28.7495, 77.0565],
  "ITO": [28.6289, 77.2410],
  "Saket": [28.5245, 77.2066],
  "Connaught Place": [28.6315, 77.2167],
  "Punjabi Bagh": [28.6683, 77.1325],
  "Lodhi Road": [28.5918, 77.2273],
};

// Only localities present in citizendata.js are searchable/selectable.
const localityDirectory = (Array.isArray(localityData) ? localityData : []).map(
  (item) => ({
    name: item.name,
    district: item.district,
    position: localityCoordinates[item.name] || [28.6139, 77.2090],
  })
);

const initialIssues = [
  {
    id: "RN-1024",
    locality: "Saket",
    title: "Damaged road surface",
    location: "Saket main road",
    category: "Road damage",
    department: "MCD / PWD (verify road ownership)",
    status: "Open",
    votes: 16,
    date: "22 Nov 2026",
    description: "Residents have reported damage to the road surface.",
    history: ["Issue reported", "Residents confirmed the issue"],
  },
  {
    id: "RN-1025",
    locality: "Saket",
    title: "Water leakage",
    location: "Residential area, Saket",
    category: "Water leakage",
    department: "Delhi Jal Board",
    status: "Under review",
    votes: 8,
    date: "22 Nov 2026",
    description: "Water leakage reported near the residential street.",
    history: ["Issue reported", "Forwarded for evaluation"],
  },
  {
    id: "RN-1026",
    locality: "Saket",
    title: "Streetlight not working",
    location: "Saket residential block",
    category: "Streetlight",
    department: "MCD / Relevant authority",
    status: "Resolved",
    votes: 5,
    date: "20 Nov 2026",
    description: "Streetlight complaint marked as resolved.",
    history: ["Issue reported", "Work marked completed"],
  },
  {
    id: "RN-2041",
    locality: "Anand Vihar",
    title: "Road maintenance concern",
    location: "Anand Vihar road corridor",
    category: "Road damage",
    department: "MCD / PWD (verify road ownership)",
    status: "Open",
    votes: 12,
    date: "22 Nov 2026",
    description: "Road maintenance concern reported by a resident.",
    history: ["Issue reported"],
  },
  {
    id: "RN-3041",
    locality: "Dwarka",
    title: "Drainage concern",
    location: "Dwarka sector road",
    category: "Drainage",
    department: "MCD / Relevant drainage authority",
    status: "Under review",
    votes: 7,
    date: "21 Nov 2026",
    description: "Drainage concern reported in the locality.",
    history: ["Issue reported", "Forwarded for evaluation"],
  },
  {
    id: "RN-4041",
    locality: "ITO",
    title: "Traffic disruption",
    location: "ITO road corridor",
    category: "Traffic",
    department: "Delhi Traffic Police",
    status: "Open",
    votes: 10,
    date: "22 Nov 2026",
    description: "Traffic disruption reported near the main road.",
    history: ["Issue reported"],
  },
];

const facilityTypes = [
  { name: "Hospitals", search: "hospitals", icon: "🏥" },
  { name: "Trauma centres", search: "trauma centres", icon: "✚" },
  { name: "Fire stations", search: "fire stations", icon: "🚒" },
  { name: "Police stations", search: "police stations", icon: "🚔" },
  { name: "Pharmacies", search: "pharmacies", icon: "＋" },
  { name: "ATMs", search: "ATMs", icon: "▣" },
  { name: "Metro stations", search: "metro stations", icon: "🚇" },
  { name: "Toll plazas", search: "toll plazas", icon: "🛣" },
];

function MapUpdater({ position }) {
  const map = useMap();

  useEffect(() => {
    map.flyTo(position, 14, { duration: 1 });
  }, [position, map]);

  return null;
}

function getStatusClass(status) {
  if (status === "Resolved") return "resolved";
  if (status === "Under review") return "review";
  if (status === "Reopened") return "reopened";
  return "open";
}

function AreaConditions() {
  const [search, setSearch] = useState("Saket");
  const [selectedLocality, setSelectedLocality] = useState("Saket");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [issues, setIssues] = useState(initialIssues);
  const [activeIssue, setActiveIssue] = useState(null);
  const [activeLayer, setActiveLayer] = useState("All");
  const [message, setMessage] = useState("");

  const selectedArea = localityDirectory.find(
    (area) => area.name === selectedLocality
  );

  // citizendata.js stores the locality name in `name`, not `locality`.
  const selectedConditions = Array.isArray(localityData)
    ? localityData.find(
        (item) =>
          item?.name?.trim().toLowerCase() === selectedLocality.trim().toLowerCase()
      )
    : undefined;


  const suggestions = useMemo(() => {
    if (!search.trim()) return localityDirectory.slice(0, 7);

    return localityDirectory.filter((area) =>
      area.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const areaIssues = issues.filter(
    (issue) => issue.locality === selectedLocality
  );

  const openCount = areaIssues.filter(
    (issue) => issue.status !== "Resolved"
  ).length;

  const resolvedCount = areaIssues.filter(
    (issue) => issue.status === "Resolved"
  ).length;

  const mapPosition = selectedArea?.position || [28.6139, 77.2090];

  const visibleIssues = areaIssues.filter((issue) => {
    if (activeLayer === "Open") return issue.status !== "Resolved";
    if (activeLayer === "Resolved") return issue.status === "Resolved";
    return true;
  });

  const selectArea = (area) => {
    setSelectedLocality(area.name);
    setSearch(area.name);
    setShowSuggestions(false);
    setActiveIssue(null);
    setMessage("");
  };

  const handleSearch = (event) => {
    event.preventDefault();

    const exactMatch = localityDirectory.find(
      (area) => area.name.toLowerCase() === search.trim().toLowerCase()
    );

    if (exactMatch) {
      selectArea(exactMatch);
      return;
    }

    if (suggestions.length > 0) {
      selectArea(suggestions[0]);
      return;
    }

    if (search.trim()) {
      setShowSuggestions(false);
      setMessage("Choose one of the eight localities available in the citizen dataset.");
      setSearch(selectedLocality);
    }
  };

  const confirmIssue = (issueId) => {
    setIssues((previous) =>
      previous.map((issue) =>
        issue.id === issueId
          ? { ...issue, votes: issue.votes + 1 }
          : issue
      )
    );
    setMessage("Your confirmation has been added to this issue.");
  };

  const reopenIssue = (issueId) => {
    setIssues((previous) =>
      previous.map((issue) =>
        issue.id === issueId
          ? {
              ...issue,
              status: "Reopened",
              history: [
                ...issue.history,
                "Citizen requested reopening for evaluation",
              ],
            }
          : issue
      )
    );
    setMessage("Issue reopened for evaluation.");
  };

  const getFacilityUrl = (facility) => {
    const query = `${facility} near ${selectedLocality}, Delhi`;
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  };

  const rainfallValue = selectedConditions?.rainfall;
  const rainfallDisplay =
    rainfallValue === undefined || rainfallValue === null
      ? "—"
      : typeof rainfallValue === "number"
        ? `${rainfallValue} mm`
        : rainfallValue;

  return (
    <div className="area-page">
      <CitizenNavbar />

      <main className="area-container">
        <section className="area-heading">
          <div>
            <p className="area-eyebrow">CITIZEN PORTAL / LOCAL INFORMATION</p>
            <h1>Area Insights</h1>
            <p className="area-subtitle">
              Explore local conditions, civic issues and essential facilities.
            </p>
          </div>
        </section>

        <section className="locality-search-section">
          <div className="search-heading">
            <div>
              <h2>Explore a locality</h2>
              <p>Search one of the eight localities available in the citizen dataset.</p>
            </div>
            <span className="delhi-label">DELHI, INDIA</span>
          </div>

          <form className="locality-search" onSubmit={handleSearch}>
            <span className="search-symbol">⌕</span>
            <input
              type="text"
              value={search}
              placeholder="Search Anand Vihar, Dwarka, Rohini..."
              onChange={(event) => {
                setSearch(event.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            />
            <button type="submit">Explore area</button>

            {showSuggestions && suggestions.length > 0 && (
              <div className="locality-suggestions">
                {suggestions.map((area) => (
                  <button
                    type="button"
                    key={area.name}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => selectArea(area)}
                  >
                    <span className="suggestion-pin">●</span>
                    <span>
                      <strong>{area.name}</strong>
                      <small>{area.district}</small>
                    </span>
                  </button>
                ))}
              </div>
            )}
          </form>

          <div className="popular-localities">
            <span>Popular:</span>
            {localityDirectory.map((area) => (
              <button
                type="button"
                key={area.name}
                onClick={() => selectArea(area)}
              >
                {area.name}
              </button>
            ))}
          </div>
        </section>

        <section className="selected-locality">
          <div>
            <span className="selected-label">SELECTED LOCALITY</span>
            <h2>{selectedLocality}</h2>
            <p>{selectedArea?.district || "Delhi"}</p>
          </div>
          <div className="locality-summary">
            <div>
              <strong>{String(openCount).padStart(2, "0")}</strong>
              <span>Open issues</span>
            </div>
            <div>
              <strong>{String(resolvedCount).padStart(2, "0")}</strong>
              <span>Resolved issues</span>
            </div>
          </div>
        </section>

        {message && (
          <div className="area-message">
            <span>{message}</span>
            <button type="button" onClick={() => setMessage("")}>×</button>
          </div>
        )}

        <section className="area-section">
          <div className="section-heading">
            <div>
              <span className="section-number">01</span>
              <h2>Environmental conditions</h2>
            </div>
            <p>Available readings for the selected locality</p>
          </div>

          {selectedConditions ? (
            <div className="environment-grid">
              <article className="environment-card environment-aqi">
                <span className="metric-label">Air Quality Index</span>
                <div className="metric-main">
                  <strong>{selectedConditions.aqi ?? "—"}</strong>
                  <span>AQI</span>
                </div>
                <span className="metric-description">
                  {selectedConditions.category || "Category unavailable"}
                </span>
              </article>

              <article className="environment-card">
                <span className="metric-label">Temperature</span>
                <div className="metric-main">
                  <strong>{selectedConditions.temperature ?? "—"}</strong>
                  <span>°C</span>
                </div>
                <span className="metric-description">Local temperature</span>
              </article>

              <article className="environment-card">
                <span className="metric-label">Rainfall</span>
                <div className="metric-main metric-rainfall">
                  <strong>{rainfallDisplay}</strong>
                </div>
                <span className="metric-description">Recorded rainfall</span>
              </article>

              <article className="environment-card">
                <span className="metric-label">Traffic movement</span>
                <div className="metric-main metric-traffic">
                  <strong>{selectedConditions.road || "—"}</strong>
                </div>
                <span className="metric-description">Reported road movement</span>
              </article>
            </div>
          ) : (
            <div className="data-unavailable">
              <strong>Locality readings are not available yet.</strong>
              <p>
                No environmental readings are currently available for this locality.
              </p>
            </div>
          )}

          {selectedConditions && (
            <div className="environment-note">
              <span>
                <strong>Local observation:</strong>{" "}
                {selectedConditions.condition || "No additional observation available."}
              </span>
              <span>
                <strong>Last updated:</strong>{" "}
                {selectedConditions.updated || "Not provided"}
              </span>
            </div>
          )}
        </section>

        <section className="area-section">
          <div className="section-heading">
            <div>
              <span className="section-number">02</span>
              <h2>Community civic issues</h2>
            </div>
            <p>Issues reported and confirmed by local residents</p>
          </div>

          <div className="issue-overview">
            <div><strong>{areaIssues.length}</strong><span>Total tickets</span></div>
            <div><strong>{openCount}</strong><span>Need attention</span></div>
            <div><strong>{resolvedCount}</strong><span>Marked resolved</span></div>
          </div>

          {areaIssues.length > 0 ? (
            <div className="civic-issue-list">
              {areaIssues.map((issue) => (
                <article className="civic-issue-card" key={issue.id}>
                  <div className="issue-card-main">
                    <div className="issue-title-line">
                      <h3>{issue.title}</h3>
                      <span className={`issue-status ${getStatusClass(issue.status)}`}>
                        {issue.status}
                      </span>
                    </div>
                    <p className="issue-location">⌖ {issue.location}</p>
                    <p className="issue-description">{issue.description}</p>
                    <div className="issue-meta">
                      <span>{issue.id}</span>
                      <span>{issue.category}</span>
                      <span>{issue.department}</span>
                    </div>
                  </div>

                  <div className="issue-card-actions">
                    <div className="issue-votes">
                      <strong>{issue.votes}</strong>
                      <span>Residents affected</span>
                    </div>
                    <button
                      type="button"
                      className="confirm-issue-button"
                      onClick={() => confirmIssue(issue.id)}
                    >
                      I've faced this too
                    </button>
                    {issue.status === "Resolved" && (
                      <button
                        type="button"
                        className="reopen-button"
                        onClick={() => reopenIssue(issue.id)}
                      >
                        Reopen issue
                      </button>
                    )}
                    <button
                      type="button"
                      className="history-button"
                      onClick={() =>
                        setActiveIssue(activeIssue === issue.id ? null : issue.id)
                      }
                    >
                      {activeIssue === issue.id ? "Hide ticket history" : "View ticket history"}
                    </button>
                  </div>

                  {activeIssue === issue.id && (
                    <div className="issue-history">
                      <strong>Ticket activity</strong>
                      {(issue.history || []).map((entry, index) => (
                        <div className="history-entry" key={`${issue.id}-${index}`}>
                          <span className="history-dot" />
                          <span>{entry}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-issues">
              <span>✓</span>
              <h3>No civic tickets listed</h3>
              <p>There are currently no issue records available for this locality.</p>
            </div>
          )}
        </section>

        <section className="area-section">
          <div className="section-heading">
            <div>
              <span className="section-number">03</span>
              <h2>Nearby facilities</h2>
            </div>
            <p>Find essential services around {selectedLocality}</p>
          </div>

          <div className="facility-grid">
            {facilityTypes.map((facility) => (
              <a
                className="facility-card"
                key={facility.name}
                href={getFacilityUrl(facility.search)}
                target="_blank"
                rel="noreferrer"
              >
                <span className="facility-icon">{facility.icon}</span>
                <span className="facility-name">{facility.name}</span>
                <span className="facility-action">Find nearby ↗</span>
              </a>
            ))}
          </div>
        </section>

        <section className="area-section">
          <div className="section-heading">
            <div>
              <span className="section-number">04</span>
              <h2>Locality issue map</h2>
            </div>
            <p>Explore open and resolved civic issue locations</p>
          </div>

          <div className="map-panel">
            <div className="map-toolbar">
              <div>
                <h3>{selectedLocality} map</h3>
                <p>Issue markers for the selected locality</p>
              </div>
              <div className="map-filters">
                {["All", "Open", "Resolved"].map((layer) => (
                  <button
                    type="button"
                    key={layer}
                    className={activeLayer === layer ? "active" : ""}
                    onClick={() => setActiveLayer(layer)}
                  >
                    {layer}
                  </button>
                ))}
              </div>
            </div>

            <div className="leaflet-map">
              <MapContainer
                center={mapPosition}
                zoom={13}
                scrollWheelZoom
                key={selectedLocality}
              >
                <MapUpdater position={mapPosition} />
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {visibleIssues.map((issue, index) => {
                  const offset = 0.003 * (index + 1);
                  const isResolved = issue.status === "Resolved";
                  return (
                    <CircleMarker
                      key={issue.id}
                      center={[mapPosition[0] + offset, mapPosition[1] + offset]}
                      radius={9}
                      pathOptions={{
                        color: isResolved ? "#23845f" : "#c84b4b",
                        fillColor: isResolved ? "#23845f" : "#c84b4b",
                        fillOpacity: 0.9,
                      }}
                    >
                      <Popup>
                        <strong>{issue.title}</strong>
                        <br />
                        {issue.id}
                        <br />
                        Status: {issue.status}
                      </Popup>
                    </CircleMarker>
                  );
                })}
                <CircleMarker
                  center={mapPosition}
                  radius={6}
                  pathOptions={{
                    color: "#347e9c",
                    fillColor: "#347e9c",
                    fillOpacity: 1,
                  }}
                >
                  <Popup>{selectedLocality}</Popup>
                </CircleMarker>
              </MapContainer>
            </div>

            <div className="map-legend">
              <span><i className="legend-dot red" /> Open issue</span>
              <span><i className="legend-dot green" /> Resolved issue</span>
              <span><i className="legend-dot blue" /> Selected locality</span>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}

export default AreaConditions;
