
import { useEffect, useMemo, useState } from "react";
import OfficerLayout from "./layout";
import { getReports } from "../../data/citizendata";
import "./incidentmanagement.css";

const STORAGE_KEY = "rescuenet_citizen_reports";
const UPDATE_EVENT = "rescuenet-reports-updated";

const STATUSES = [
  "Submitted",
  "Under Review",
  "Assigned",
  "Dispatched",
  "In Progress",
  "Resolved",
  "Closed"
];

const PRIORITIES = ["Critical", "High", "Medium", "Low"];

const TEAMS = [
  { id: "POL-01", department: "Police" },
  { id: "POL-02", department: "Police" },
  { id: "FIR-01", department: "Fire" },
  { id: "FIR-02", department: "Fire" },
  { id: "MED-01", department: "Health" },
  { id: "MED-02", department: "Health" },
  { id: "MUN-01", department: "Municipal" },
  { id: "MUN-02", department: "Municipal" }
];

const DEPARTMENTS = ["Police", "Fire", "Health", "Municipal"];

const RESOURCE_DETAILS = {
  Police: { name: "Police Vehicles", capacity: 12 },
  Fire: { name: "Fire Engines", capacity: 6 },
  Health: { name: "Ambulances", capacity: 10 }
};

const CLOSED_STATUSES = ["Resolved", "Closed"];

function loadReports() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (stored !== null) {
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    }

    return getReports() || [];
  } catch {
    return getReports() || [];
  }
}

function saveReports(reports) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
  window.dispatchEvent(new Event(UPDATE_EVENT));
}

function slug(value = "") {
  return String(value).toLowerCase().replaceAll(" ", "-");
}

function IncidentManagement() {
  const [reports, setReports] = useState(loadReports);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    const refresh = () => setReports(loadReports());

    window.addEventListener(UPDATE_EVENT, refresh);
    window.addEventListener("storage", refresh);

    return () => {
      window.removeEventListener(UPDATE_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const filteredReports = useMemo(() => {
    const term = search.trim().toLowerCase();

    return reports.filter(report => {
      const matchesSearch =
        !term ||
        [
          report.id,
          report.type,
          report.location,
          report.reporter
        ].some(value =>
          String(value || "").toLowerCase().includes(term)
        );

      const matchesStatus =
        statusFilter === "All" || report.status === statusFilter;

      const matchesPriority =
        priorityFilter === "All" || report.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [reports, search, statusFilter, priorityFilter]);

  const summary = useMemo(() => ({
    total: reports.length,

    pending: reports.filter(report =>
      ["Submitted", "Under Review"].includes(report.status)
    ).length,

    active: reports.filter(report =>
      ["Assigned", "Dispatched", "In Progress"].includes(report.status)
    ).length,

    critical: reports.filter(report =>
      ["Critical", "High"].includes(report.priority) &&
      !CLOSED_STATUSES.includes(report.status)
    ).length
  }), [reports]);

  const availableTeams = useMemo(() => {
    if (!form.assignedDepartment) return [];

    return TEAMS.filter(team => {
      if (team.department !== form.assignedDepartment) return false;

      const occupied = reports.some(report =>
        report.id !== selected?.id &&
        report.assignedTeam === team.id &&
        !CLOSED_STATUSES.includes(report.status)
      );

      return !occupied || team.id === form.assignedTeam;
    });
  }, [form.assignedDepartment, form.assignedTeam, reports, selected]);

  const availableResources = useMemo(() => {
    const resource = RESOURCE_DETAILS[form.assignedDepartment];

    if (!resource) return [];

    const occupied = reports.filter(report =>
      report.id !== selected?.id &&
      report.assignedResource === resource.name &&
      !CLOSED_STATUSES.includes(report.status)
    ).length;

    const hasCapacity = occupied < resource.capacity;
    const alreadyAssigned = form.assignedResource === resource.name;

    return hasCapacity || alreadyAssigned ? [resource.name] : [];
  }, [form.assignedDepartment, form.assignedResource, reports, selected]);

  const openReport = report => {
    setSelected(report);

    setForm({
      status: report.status || "Submitted",
      priority: report.priority || "Medium",
      assignedDepartment: report.assignedDepartment || "",
      assignedTeam: report.assignedTeam || "",
      assignedResource: report.assignedResource || "",
      officerRemarks: report.officerRemarks || "",
      escalated: Boolean(report.escalated)
    });

    setMessage("");
  };

  const updateForm = (field, value) => {
    setForm(current => ({
      ...current,
      [field]: value
    }));
  };

  const handleDepartmentChange = department => {
    setForm(current => ({
      ...current,
      assignedDepartment: department,
      assignedTeam: "",
      assignedResource: ""
    }));
  };

  const handleSave = event => {
    event.preventDefault();

    if (!selected) return;

    if (form.assignedTeam) {
      const teamExists = availableTeams.some(
        team => team.id === form.assignedTeam
      );

      if (!teamExists) {
        alert("The selected response team is no longer available.");
        return;
      }
    }

    const updated = reports.map(report =>
      report.id === selected.id
        ? {
            ...report,
            ...form,
            officerUpdatedAt: new Date().toLocaleString("en-IN")
          }
        : report
    );

    saveReports(updated);
    setReports(updated);
    setSelected(null);
    setMessage(`Incident ${selected.id} has been updated.`);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const closeModal = () => setSelected(null);

  return (
    <OfficerLayout>
      <div className="officer-page incident-page">

        <div className="officer-page-heading">
          <div>
            <div className="page-eyebrow">RESPONSE OPERATIONS</div>
            <h1>Incident Management</h1>
            <p>
              Review citizen reports, assign departments and coordinate response resources.
            </p>
          </div>
        </div>

        {message && (
          <div className="officer-success-message">
            <span>✓</span>
            {message}
            <button onClick={() => setMessage("")} aria-label="Dismiss">×</button>
          </div>
        )}

        <section className="incident-summary-grid">
          <SummaryCard label="Total Reports" value={summary.total} />
          <SummaryCard label="Pending Review" value={summary.pending} />
          <SummaryCard label="Active Responses" value={summary.active} />
          <SummaryCard label="High Priority" value={summary.critical} />
        </section>

        <section className="incident-management-panel">

          <div className="panel-heading">
            <div>
              <h3>Incident Register</h3>
              <p>Search and review reports submitted by citizens</p>
            </div>

            <span className="record-count">
              {filteredReports.length} records
            </span>
          </div>

          <div className="incident-filters">
            <input
              className="officer-search"
              type="search"
              placeholder="Search ID, incident, location or reporter..."
              value={search}
              onChange={event => setSearch(event.target.value)}
            />

            <select
              value={statusFilter}
              onChange={event => setStatusFilter(event.target.value)}
            >
              <option value="All">All statuses</option>
              {STATUSES.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>

            <select
              value={priorityFilter}
              onChange={event => setPriorityFilter(event.target.value)}
            >
              <option value="All">All priorities</option>
              {PRIORITIES.map(priority => (
                <option key={priority} value={priority}>{priority}</option>
              ))}
            </select>
          </div>

          <div className="officer-table-wrap">
            <table className="officer-table incident-table">
              <thead>
                <tr>
                  <th>Reference ID</th>
                  <th>Incident Details</th>
                  <th>Location</th>
                  <th>Date & Time</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Assignment</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredReports.length ? (
                  filteredReports.map(report => (
                    <tr key={report.id}>
                      <td><strong>{report.id}</strong></td>

                      <td>
                        <strong>{report.type}</strong>
                        <small className="table-subtext">
                          {report.reporter || "Citizen report"}
                        </small>
                      </td>

                      <td>{report.location || "—"}</td>

                      <td>
                        {report.date || "—"}
                        <small className="table-subtext">
                          {report.time || ""}
                        </small>
                      </td>

                      <td>
                        <span className={`priority-pill ${slug(report.priority)}`}>
                          {report.priority || "Medium"}
                        </span>
                      </td>

                      <td>
                        <span className={`status-pill ${slug(report.status)}`}>
                          {report.status || "Submitted"}
                        </span>
                      </td>

                      <td>{report.assignedTeam || "Unassigned"}</td>

                      <td>
                        <button
                          className="table-action-button"
                          onClick={() => openReport(report)}
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8">
                      <div className="empty-state">
                        No incidents match your search or filters.
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {selected && (
        <div
          className="officer-modal-backdrop"
          onMouseDown={event => {
            if (event.target === event.currentTarget) closeModal();
          }}
        >
          <form className="officer-modal" onSubmit={handleSave}>

            <div className="officer-modal-heading">
              <div>
                <div className="page-eyebrow">INCIDENT REVIEW</div>
                <h2>{selected.id}</h2>
                <p>{selected.type} · {selected.location}</p>
              </div>

              <button
                type="button"
                className="modal-close"
                onClick={closeModal}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="incident-detail-grid">
              <Detail label="Reported By" value={selected.reporter || "Not provided"} />
              <Detail label="Contact Number" value={selected.phone || "Not provided"} />
              <Detail label="Reported On" value={`${selected.date || "—"} ${selected.time || ""}`} />
              <Detail label="Current Status" value={selected.status || "Submitted"} />
            </div>

            <div className="incident-description">
              <h4>Incident Description</h4>
              <p>{selected.description || "No additional description provided."}</p>
            </div>

            <div className="modal-form-grid">

              <FormField label="Priority">
                <select
                  value={form.priority}
                  onChange={event => updateForm("priority", event.target.value)}
                >
                  {PRIORITIES.map(priority => (
                    <option key={priority} value={priority}>{priority}</option>
                  ))}
                </select>
              </FormField>

              <FormField label="Incident Status">
                <select
                  value={form.status}
                  onChange={event => updateForm("status", event.target.value)}
                >
                  {STATUSES.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </FormField>

              <FormField label="Assign Department">
                <select
                  value={form.assignedDepartment}
                  onChange={event => handleDepartmentChange(event.target.value)}
                >
                  <option value="">Select department</option>
                  {DEPARTMENTS.map(department => (
                    <option key={department} value={department}>{department}</option>
                  ))}
                </select>
              </FormField>

              <FormField label="Allocate Response Team">
                <select
                  value={form.assignedTeam}
                  onChange={event => updateForm("assignedTeam", event.target.value)}
                  disabled={!form.assignedDepartment}
                >
                  <option value="">Select available team</option>
                  {availableTeams.map(team => (
                    <option key={team.id} value={team.id}>{team.id}</option>
                  ))}
                </select>

                {form.assignedDepartment && !availableTeams.length && (
                  <small className="field-hint">
                    No team currently available in this department.
                  </small>
                )}
              </FormField>

              <FormField label="Allocate Vehicle / Resource">
                <select
                  value={form.assignedResource}
                  onChange={event => updateForm("assignedResource", event.target.value)}
                  disabled={!form.assignedDepartment || form.assignedDepartment === "Municipal"}
                >
                  <option value="">Select resource</option>
                  {availableResources.map(resource => (
                    <option key={resource} value={resource}>{resource}</option>
                  ))}
                </select>

                {form.assignedDepartment === "Municipal" && (
                  <small className="field-hint">
                    No vehicle allocation is configured for Municipal teams.
                  </small>
                )}

                {form.assignedDepartment &&
                  form.assignedDepartment !== "Municipal" &&
                  !availableResources.length && (
                    <small className="field-hint">
                      No resource currently available for this department.
                    </small>
                  )}
              </FormField>

              <FormField label="Officer Remarks" full>
                <textarea
                  rows="3"
                  placeholder="Add response notes or instructions..."
                  value={form.officerRemarks}
                  onChange={event => updateForm("officerRemarks", event.target.value)}
                />
              </FormField>

              <label className="escalation-control full-width">
                <input
                  type="checkbox"
                  checked={form.escalated}
                  onChange={event => updateForm("escalated", event.target.checked)}
                />
                <span>Escalate this incident for senior officer attention</span>
              </label>
            </div>

            <div className="officer-modal-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={closeModal}
              >
                Cancel
              </button>

              <button type="submit" className="primary-button">
                Save Incident Updates
              </button>
            </div>
          </form>
        </div>
      )}
    </OfficerLayout>
  );
}

function SummaryCard({ label, value }) {
  return (
    <article className="incident-summary-card">
      <p>{label}</p>
      <strong>{value}</strong>
    </article>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <small>{label}</small>
      <strong>{value}</strong>
    </div>
  );
}

function FormField({ label, children, full }) {
  return (
    <div className={`officer-form-group ${full ? "full-width" : ""}`}>
      <label>{label}</label>
      {children}
    </div>
  );
}

export default IncidentManagement;
