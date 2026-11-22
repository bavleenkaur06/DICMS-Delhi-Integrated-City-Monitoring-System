
import { NavLink, useNavigate } from "react-router-dom";
import "./layout.css";

function OfficerLayout({ children }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("rescuenet_role");
    localStorage.removeItem("rescuenet_user");
    navigate("/", { replace: true });
  };

  const officerName =
    localStorage.getItem("rescuenet_user") || "City Officer";

  const displayName = officerName.includes("@")
    ? officerName.split("@")[0]
    : officerName;

  const initials = displayName
    .split(/[.\s_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="officer-layout">

      <aside className="officer-sidebar">

        <NavLink to="/officer" className="officer-brand">
          <div className="officer-brand-mark">D</div>
          <div className="officer-brand-text">
            <strong>DICMS</strong>
            <small>Delhi Integrated City<br />Monitoring System</small>
          </div>
        </NavLink>

        <div className="officer-sidebar-label">
          WORKSPACE
        </div>

        <nav className="officer-menu">
          <NavLink to="/officer" end>
            <span className="menu-symbol">▦</span>
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/officer/incidents">
            <span className="menu-symbol">▤</span>
            <span>Incident Management</span>
          </NavLink>

          <NavLink to="/officer/monitoring">
            <span className="menu-symbol">⌖</span>
            <span>City Monitoring</span>
          </NavLink>
        </nav>

        <div className="officer-sidebar-bottom">

          <div className="officer-profile-label">
            SIGNED IN AS
          </div>

          <div className="officer-user">
            <div className="officer-avatar">
              {initials || "CO"}
            </div>

            <div className="officer-user-info">
              <strong title={officerName}>{displayName}</strong>
              <small>Authorized Officer</small>
            </div>
          </div>

          <button
            className="officer-logout"
            onClick={logout}
            type="button"
          >
            <span>↪</span>
            Logout
          </button>

        </div>
      </aside>

      <main className="officer-main">

        <header className="officer-topbar">
          <div className="officer-topbar-title">
            <span className="topbar-heading">City Administration</span>
            <span className="topbar-subheading">
              Delhi Integrated City Monitoring System
            </span>
          </div>

          <div className="topbar-right">
            <span className="officer-status-dot"></span>
            <span>Officer Access</span>
          </div>
        </header>

        <div className="officer-content">
          {children}
        </div>

      </main>
    </div>
  );
}

export default OfficerLayout;
