
import { NavLink, useNavigate } from "react-router-dom";
import "./navbar.css";

function CitizenNavbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("rescuenet_role");
    localStorage.removeItem("rescuenet_user");
    navigate("/");
  };

  return (
    <header className="citizen-navbar">
      <div className="citizen-nav-inner">
        <NavLink to="/citizen" className="citizen-logo">
          <span className="logo-short">DICMS</span>
          <span className="logo-full">
            Delhi Integrated City Monitoring System
          </span>
        </NavLink>

        <nav className="citizen-nav-links">
          <NavLink to="/citizen" end>Overview</NavLink>
          <NavLink to="/citizen/updates">Delhi Updates</NavLink>
          <NavLink to="/citizen/areas">Area Insights</NavLink>
          <NavLink to="/citizen/track">Track Reports</NavLink>
        </nav>

        <div className="citizen-nav-actions">
          <button
            className="nav-report-button"
            onClick={() => navigate("/citizen/report")}
          >
            Report Emergency
          </button>

          <button className="nav-logout" onClick={logout}>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

export default CitizenNavbar;
