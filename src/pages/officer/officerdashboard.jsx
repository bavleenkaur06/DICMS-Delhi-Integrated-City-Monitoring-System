
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import OfficerLayout from "./layout";
import { getReports } from "../../data/citizendata";
import "./officerdashboard.css";

const TEAMS = [
  { id: "POL-01", name: "Police Response 01", department: "Police" },
  { id: "POL-02", name: "Police Response 02", department: "Police" },
  { id: "FIR-01", name: "Fire Response 01", department: "Fire" },
  { id: "FIR-02", name: "Fire Response 02", department: "Fire" },
  { id: "MED-01", name: "Medical Response 01", department: "Health" },
  { id: "MED-02", name: "Medical Response 02", department: "Health" },
  { id: "MUN-01", name: "Municipal Team 01", department: "Municipal" },
  { id: "MUN-02", name: "Municipal Team 02", department: "Municipal" }
];

const RESOURCES = [
  { name: "Police Vehicles", total: 12, icon: "🚓" },
  { name: "Fire Engines", total: 6, icon: "🚒" },
  { name: "Ambulances", total: 10, icon: "🚑" }
];

const CLOSED = ["Resolved", "Closed"];
const ACTIVE = ["Dispatched", "In Progress", "Assigned"];

function readReports() {
  try {
    return getReports() || [];
  } catch {
    return [];
  }
}

function formatStatus(value = "") {
  return String(value).toLowerCase().replaceAll(" ", "-");
}

function OfficerDashboard() {
  const [reports, setReports] = useState(readReports);

  const refreshReports = useCallback(() => {
    setReports(readReports());
  }, []);

  useEffect(() => {
    window.addEventListener("rescuenet-reports-updated", refreshReports);
    window.addEventListener("rescuenet-reports-updated", refreshReports);
    window.addEventListener("storage", refreshReports);

    return () => {
      window.removeEventListener("rescuenet-reports-updated", refreshReports);
      window.removeEventListener("storage", refreshReports);
    };
  }, [refreshReports]);

  const stats = useMemo(() => {
    const total = reports.length;
    const resolved = reports.filter(r => CLOSED.includes(r.status)).length;
    const pending = reports.filter(r =>
      ["Submitted", "Under Review"].includes(r.status)
    ).length;
    const active = reports.filter(r => ACTIVE.includes(r.status)).length;
    const critical = reports.filter(r =>
      ["Critical", "High"].includes(r.priority) && !CLOSED.includes(r.status)
    ).length;
    const escalated = reports.filter(r =>
      r.escalated && !CLOSED.includes(r.status)
    ).length;

    return {
      total,
      resolved,
      pending,
      active,
      critical,
      escalated,
      resolutionRate: total ? Math.round((resolved / total) * 100) : 0
    };
  }, [reports]);

  const teamStats = useMemo(() => TEAMS.map(team => {
    const deployed = reports.filter(r =>
      r.assignedTeam === team.id && !CLOSED.includes(r.status)
    ).length;

    return { ...team, deployed, available: deployed === 0 };
  }), [reports]);

  const resourceStats = useMemo(() => RESOURCES.map(resource => {
    const deployed = reports.filter(r =>
      r.assignedResource === resource.name && !CLOSED.includes(r.status)
    ).length;

    const available = Math.max(0, resource.total - deployed);

    return { ...resource, deployed, available };
  }), [reports]);

  const departments = useMemo(() =>
    ["Police", "Fire", "Health", "Municipal"].map(department => {
      const count = reports.filter(r =>
        r.assignedDepartment === department && !CLOSED.includes(r.status)
      ).length;

      return { department, count };
    }), [reports]
  );

  const priorityActions = useMemo(() =>
    reports.filter(r => {
      if (CLOSED.includes(r.status)) return false;

      return (
        ["Critical", "High"].includes(r.priority) ||
        r.escalated ||
        !r.assignedTeam
      );
    }).slice(0, 5), [reports]);

  const recentReports = useMemo(() =>
    [...reports].sort((a, b) => {
      const dateA = new Date(a.createdAt || a.date || 0).getTime();
      const dateB = new Date(b.createdAt || b.date || 0).getTime();
      return dateB - dateA;
    }).slice(0, 6), [reports]);

  const totalTeams = TEAMS.length;
  const deployedTeams = teamStats.filter(t => t.deployed > 0).length;
  const availableTeams = totalTeams - deployedTeams;

  return (
    <OfficerLayout>
      <div className="officer-page">

        <div className="officer-page-heading">
          <div>
            <div className="page-eyebrow">CITY OPERATIONS</div>
            <h1>Officer Dashboard</h1>
            <p>Delhi-wide incident overview, response teams and operational performance.</p>
          </div>

          <Link className="primary-link" to="/officer/incidents">
            Manage incidents <span>→</span>
          </Link>
        </div>

        <section className="officer-stats-grid">
          <StatCard label="Total Incidents" value={stats.total} icon="▤" tone="teal" note="All reported incidents" />
          <StatCard label="Pending Review" value={stats.pending} icon="◷" tone="orange" note="Awaiting officer action" />
          <StatCard label="Active Responses" value={stats.active} icon="↗" tone="blue" note="Teams currently deployed" />
          <StatCard label="Resolved" value={stats.resolved} icon="✓" tone="green" note="Completed incidents" />
          <StatCard label="High Priority" value={stats.critical} icon="!" tone="red" note="Critical and high priority" />
        </section>

        <div className="officer-dashboard-grid">

          <section className="officer-panel">
            <PanelHeading title="Response Team Availability" subtitle="Deployment status across response units" />

            <div className="team-summary">
              <SummaryItem label="Total Teams" value={totalTeams} />
              <SummaryItem label="Available" value={availableTeams} />
              <SummaryItem label="Deployed" value={deployedTeams} />
            </div>

            <div className="team-list">
              {teamStats.map(team => (
                <div className="team-list-row" key={team.id}>
                  <div className="team-list-info">
                    <div className="team-avatar">{team.id.split("-")[0]}</div>
                    <div>
                      <strong>{team.name}</strong>
                      <small>{team.id} · {team.department}</small>
                    </div>
                  </div>

                  <span className={`availability-status ${team.deployed ? "deployed" : "available"}`}>
                    {team.deployed ? "Deployed" : "Available"}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="officer-panel">
            <PanelHeading title="Resource Availability" subtitle="Current vehicle allocation" />

            <div className="resource-list">
              {resourceStats.map(resource => (
                <div className="resource-item" key={resource.name}>
                  <div className="resource-top">
                    <div className="resource-name">
                      <span className="resource-icon">{resource.icon}</span>
                      {resource.name}
                    </div>
                    <strong className="resource-number">
                      {resource.available}/{resource.total}
                    </strong>
                  </div>

                  <div className="resource-track">
                    <div style={{ width: `${(resource.available / resource.total) * 100}%` }} />
                  </div>

                  <div className="resource-note">
                    <span>{resource.available} available</span>
                    <span>{resource.deployed} allocated</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="performance-block">
              <div className="performance-copy">
                <strong>Incident Resolution</strong>
                <span>{stats.resolved} of {stats.total} incidents resolved</span>
              </div>

              <div className="resolution-ring" style={{ "--progress": `${stats.resolutionRate}%` }}>
                <strong>{stats.resolutionRate}%</strong>
              </div>
            </div>
          </section>

        </div>

        <div className="officer-dashboard-grid">

          <section className="officer-panel">
            <PanelHeading title="Department Deployment" subtitle="Open incidents assigned to each department" />

            <div className="department-list">
              {departments.map(item => (
                <div className="department-row" key={item.department}>
                  <div className="department-info">
                    <span className="department-icon">{departmentIcon(item.department)}</span>
                    <div>
                      <strong>{item.department}</strong>
                      <small>{item.count} active assignment{item.count === 1 ? "" : "s"}</small>
                    </div>
                  </div>

                  <span className="department-status">
                    {item.count ? "Operational" : "Available"}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="officer-panel">
            <PanelHeading title="Priority Actions" subtitle="Incidents requiring attention" />

            {priorityActions.length ? (
              <div className="priority-action-list">
                {priorityActions.map(report => (
                  <Link to="/officer/incidents" className="priority-action" key={report.id}>
                    <span className="priority-action-icon">!</span>
                    <span className="priority-action-info">
                      <strong>{report.id} · {report.type}</strong>
                      <small>
                        {report.location} · {
                          report.escalated
                            ? "Escalated"
                            : !report.assignedTeam
                              ? "Team not assigned"
                              : `${report.priority} priority`
                        }
                      </small>
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="empty-state">No priority actions at the moment.</div>
            )}
          </section>

        </div>

        <section className="officer-panel recent-activity-panel">
          <PanelHeading title="Recent Incident Activity" subtitle="Latest reports received by the city" />

          <div className="officer-table-wrap">
            <table className="officer-table">
              <thead>
                <tr>
                  <th>Reference ID</th>
                  <th>Incident</th>
                  <th>Location</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Assigned Team</th>
                </tr>
              </thead>

              <tbody>
                {recentReports.length ? recentReports.map(report => (
                  <tr key={report.id}>
                    <td><strong>{report.id}</strong></td>
                    <td>{report.type}</td>
                    <td>{report.location}</td>
                    <td>
                      <span className={`priority-pill ${formatStatus(report.priority)}`}>
                        {report.priority || "Not set"}
                      </span>
                    </td>
                    <td>
                      <span className={`status-pill ${formatStatus(report.status)}`}>
                        {report.status || "Submitted"}
                      </span>
                    </td>
                    <td>{report.assignedTeam || "Not assigned"}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="6">
                      <div className="empty-state">No incident reports have been received yet.</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="panel-footer-link">
            <Link to="/officer/incidents">View all incidents →</Link>
          </div>
        </section>

        {stats.escalated > 0 && (
          <div className="officer-inline-alert">
            <strong>{stats.escalated} escalated incident{stats.escalated === 1 ? "" : "s"}</strong>
            <span>Review escalated cases in Incident Management.</span>
            <Link to="/officer/incidents">Review now →</Link>
          </div>
        )}

      </div>
    </OfficerLayout>
  );
}

function StatCard({ label, value, icon, tone, note }) {
  return (
    <article className="officer-stat-card">
      <div className="stat-card-top">
        <p>{label}</p>
        <span className={`stat-icon ${tone}`}>{icon}</span>
      </div>
      <h2>{value}</h2>
      <small>{note}</small>
    </article>
  );
}

function PanelHeading({ title, subtitle }) {
  return (
    <div className="panel-heading">
      <div>
        <h3>{title}</h3>
        <p>{subtitle}</p>
      </div>
    </div>
  );
}

function SummaryItem({ label, value }) {
  return (
    <div className="team-summary-item">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function departmentIcon(name) {
  return {
    Police: "🚓",
    Fire: "🚒",
    Health: "✚",
    Municipal: "🏙"
  }[name] || "•";
}

export default OfficerDashboard;
