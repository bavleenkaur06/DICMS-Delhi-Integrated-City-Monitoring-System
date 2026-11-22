import { useState } from "react";
import { useLocation } from "react-router-dom";
import CitizenNavbar from "../shared/navbar";
import { getReports } from "../../data/citizendata";
import "./trackreports.css";

const statusSteps = [
  "Submitted",
  "Under Review",
  "Dispatched",
  "Resolved"
];

function TrackReports() {
  const location = useLocation();

  const [search, setSearch] = useState(
    location.state?.reportId || ""
  );
  const [reports, setReports] = useState(() => getReports());
  const [searched, setSearched] = useState(false);
  const [searchedId, setSearchedId] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();

    const term = search.trim().toLowerCase();

    setReports(getReports());
    setSearchedId(term);
    setSearched(true);
  };

  const matchedReport = searched
    ? reports.find(
        (report) =>
          String(report.id || "").trim().toLowerCase() === searchedId
      )
    : null;

  const getStatusIndex = (status) => {
    const index = statusSteps.findIndex(
      (step) => step.toLowerCase() === String(status || "").toLowerCase()
    );

    return index === -1 ? 0 : index;
  };

  const getStatusClass = (status) => {
    const value = String(status || "").toLowerCase();

    if (value.includes("resolved")) return "track-resolved";
    if (value.includes("dispatch")) return "track-dispatched";
    if (value.includes("review")) return "track-review";

    return "track-submitted";
  };

  return (
    <div className="track-page">
      <CitizenNavbar />

      <main className="track-container">

        <section className="track-heading">
          <p className="eyebrow">CITIZEN SERVICES</p>
          <h1>Track your report</h1>
          <p>
            Enter your report reference ID to view the submitted
            incident details and its current status.
          </p>
        </section>

        <section className="track-search-panel">
          <h2>Find your emergency report</h2>
          <p>Enter the reference ID received after submission.</p>

          <form onSubmit={handleSearch} className="track-search-form">
            <input
              type="text"
              placeholder="Example: RSN-123456"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              required
            />

            <button type="submit">Search Report</button>
          </form>
        </section>

        {searched && (
          <section className="track-results">
            {matchedReport ? (
              <>
                <div className="track-results-heading">
                  <div>
                    <h2>Report details</h2>
                    <p>Your submitted emergency report</p>
                  </div>

                  <span
                    className={`track-status ${getStatusClass(
                      matchedReport.status
                    )}`}
                  >
                    {matchedReport.status || "Submitted"}
                  </span>
                </div>

                <article className="track-report-card">
                  <div className="track-report-top">
                    <div>
                      <span className="track-report-label">
                        REPORT REFERENCE
                      </span>
                      <h3>{matchedReport.id}</h3>
                    </div>
                  </div>

                  <div className="track-report-details">
                    <div>
                      <span>Incident type</span>
                      <strong>{matchedReport.type || "Not specified"}</strong>
                    </div>

                    <div>
                      <span>Location</span>
                      <strong>{matchedReport.location || "Not specified"}</strong>
                    </div>

                    <div>
                      <span>Priority</span>
                      <strong>{matchedReport.priority || "Not specified"}</strong>
                    </div>

                    <div>
                      <span>Reported by</span>
                      <strong>{matchedReport.reporter || "Citizen"}</strong>
                    </div>

                    <div>
                      <span>Date submitted</span>
                      <strong>{matchedReport.date || "Not available"}</strong>
                    </div>

                    <div>
                      <span>Time submitted</span>
                      <strong>{matchedReport.time || "Not available"}</strong>
                    </div>
                  </div>

                  {matchedReport.description && (
                    <div className="track-description">
                      <span>Incident description</span>
                      <p>{matchedReport.description}</p>
                    </div>
                  )}

                  <div className="track-progress-section">
                    <h3>Report progress</h3>

                    <div className="track-progress">
                      {statusSteps.map((step, index) => {
                        const currentIndex = getStatusIndex(
                          matchedReport.status
                        );

                        const isDone = index < currentIndex;
                        const isCurrent = index === currentIndex;

                        return (
                          <div
                            key={step}
                            className={
                              isDone
                                ? "progress-done"
                                : isCurrent
                                ? "progress-current"
                                : "progress-pending"
                            }
                          >
                            <span />
                            <small>{step}</small>
                          </div>
                        );
                      })}
                    </div>

                    <p className="track-current-status">
                      Current status:{" "}
                      <strong>{matchedReport.status || "Submitted"}</strong>
                    </p>
                  </div>

                </article>
              </>
            ) : (
              <div className="track-empty">
                <h3>No matching report found</h3>
                <p>
                  Check the reference ID and try again.
                </p>
              </div>
            )}
          </section>
        )}

      </main>
    </div>
  );
}

export default TrackReports;