import { Link, useParams } from "react-router-dom";
import CitizenNavbar from "../shared/navbar";
import "./reportsuccess.css";

function ReportSuccess() {
  const { id } = useParams();

  return (
    <div className="success-page">
      <CitizenNavbar />

      <main className="success-container">
        <section className="success-card">
          <div className="success-mark">✓</div>

          <p className="success-label">REPORT RECORDED</p>

          <h1>Your report has been submitted.</h1>

          <p className="success-description">
            Your emergency report has been saved successfully.
            Keep your reference ID to check the report status later.
          </p>

          <div className="report-reference">
            <span>Report Reference ID</span>
            <strong>{id || "Not available"}</strong>
          </div>

          <p className="success-copy">
            Use this reference ID on the Track Report page to view
            the submitted details and current status.
          </p>

          <div className="success-actions">
            <Link
              to="/citizen/track"
              state={{ reportId: id }}
              className="success-primary"
            >
              Track Report
            </Link>

            <Link to="/citizen" className="success-secondary">
              Back to Dashboard
            </Link>
          </div>

          <div className="success-note">
            <strong>Need immediate assistance?</strong>
            <p>
              For urgent help in India, call{" "}
              <a href="tel:112">112</a>.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default ReportSuccess;