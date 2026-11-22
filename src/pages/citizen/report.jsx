import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CitizenNavbar from "../shared/navbar";
import { addReport } from "../../data/citizendata";
import "./report.css";

function ReportEmergency() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    type: "Road Accident",
    priority: "High",
    location: "",
    description: "",
    reporter: "",
    phone: ""
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (
      !form.location.trim() ||
      !form.description.trim() ||
      !form.reporter.trim() ||
      !form.phone.trim()
    ) {
      setError("Please complete all required fields.");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(form.phone.trim())) {
      setError("Enter a valid 10-digit Indian mobile number.");
      return;
    }

    const now = new Date();
    const reportId = `RSN-${Date.now().toString().slice(-6)}`;

    const newReport = {
      id: reportId,
      type: form.type,
      priority: form.priority,
      location: form.location.trim(),
      description: form.description.trim(),
      reporter: form.reporter.trim(),
      phone: form.phone.trim(),
      status: "Submitted",
      date: now.toLocaleDateString("en-IN"),
      time: now.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit"
      })
    };

    addReport(newReport);
    navigate(`/citizen/success/${reportId}`);
  };

  return (
    <div className="report-page">
      <CitizenNavbar />

      <main className="report-container">
       

        <section className="report-heading">
          <p className="eyebrow">CITIZEN SERVICES</p>
          <h1>Report an Emergency</h1>
          <p>
            Share the incident details and location to create an
            emergency report.
          </p>
        </section>

        <div className="report-layout">
          <form className="report-form" onSubmit={handleSubmit}>
            <div className="report-form-heading">
              <div>
                <h2>Incident details</h2>
                <p>Provide accurate information about the incident.</p>
              </div>
              <span>Required fields *</span>
            </div>

            <div className="report-field-grid">
              <div className="report-field">
                <label htmlFor="type">Incident type *</label>
                <select
                  id="type"
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                >
                  <option>Road Accident</option>
                  <option>Fire</option>
                  <option>Medical Emergency</option>
                  <option>Waterlogging</option>
                  <option>Building Collapse</option>
                  <option>Public Safety</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="report-field">
                <label htmlFor="priority">Priority level *</label>
                <select
                  id="priority"
                  name="priority"
                  value={form.priority}
                  onChange={handleChange}
                >
                  <option>Critical</option>
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </div>
            </div>

            <div className="report-field">
              <label htmlFor="location">Incident location *</label>
              <input
                id="location"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Enter area, street or nearby landmark"
                required
              />
            </div>

            <div className="report-field">
              <label htmlFor="description">Incident description *</label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe what happened, people affected and any immediate danger..."
                rows="5"
                required
              />
            </div>

            <div className="report-divider" />

            <div className="report-form-heading contact-heading">
              <div>
                <h2>Contact information</h2>
                <p>Provide details so the report can be identified.</p>
              </div>
            </div>

            <div className="report-field-grid">
              <div className="report-field">
                <label htmlFor="reporter">Your name *</label>
                <input
                  id="reporter"
                  name="reporter"
                  value={form.reporter}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="report-field">
                <label htmlFor="phone">Mobile number *</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  maxLength="10"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                  required
                />
              </div>
            </div>

            {error && (
              <p className="report-error" role="alert">
                {error}
              </p>
            )}

            <button type="submit" className="report-submit">
              Submit Emergency Report
            </button>

            <p className="report-form-note">
              Your report will receive a unique reference ID after submission.
            </p>
          </form>

          <aside className="report-side">
            <div className="report-side-card emergency-card">
        
              <h3>Immediate danger?</h3>
              <p>
                Contact emergency services directly.
              </p>

              <a href="tel:112" className="emergency-number">
                112
              </a>
              <span>National Emergency Number · India</span>
            </div>

            <div className="report-side-card tips-card">
              <h3>Information to include</h3>
              <ul>
                <li>Exact location or nearby landmark</li>
                <li>Type of incident</li>
                <li>Number of people affected, if known</li>
                <li>Any immediate danger at the location</li>
                <li>A reachable contact number</li>
              </ul>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default ReportEmergency;