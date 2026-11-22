
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

function Login() {
  const [role, setRole] = useState("citizen");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    const enteredEmail = email.trim();
    const enteredPassword = password.trim();

    if (!enteredEmail || !enteredPassword) {
      alert("Enter your login details.");
      return;
    }

    const selectedRole = role;

    localStorage.setItem("rescuenet_role", selectedRole);
    localStorage.setItem("rescuenet_user", enteredEmail);

    if (selectedRole === "officer") {
      window.location.assign("/officer");
    } else {
      window.location.assign("/citizen");
    }
  };

  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);
    setEmail("");
    setPassword("");
    setShowPassword(false);
  };

  return (
    <main className="login-page">
      <div className="login-card">
        <h2 className="brand-name">DICMS</h2>

        <div className="login-heading">
          <h1>Welcome back</h1>
          <p>Sign in to continue to the portal</p>
        </div>

        <div className="role-switch">
          <button
            type="button"
            className={role === "citizen" ? "active" : ""}
            onClick={() => handleRoleChange("citizen")}
          >
            Citizen
          </button>

          <button
            type="button"
            className={role === "officer" ? "active" : ""}
            onClick={() => handleRoleChange("officer")}
          >
            Officer
          </button>
        </div>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>
              {role === "citizen" ? "Email or Mobile Number" : "Official Email"}
            </label>

            <input
              type="text"
              placeholder={
                role === "citizen"
                  ? "Enter email or mobile number"
                  : "Enter official email"
              }
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <div className="label-row">
              <label>Password</label>

              <button
                type="button"
                className="text-button"
                onClick={() =>
                  alert("Password recovery will be added later.")
                }
              >
                Forgot password?
              </button>
            </div>

            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button
                type="button"
                className="show-password"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button type="submit" className="submit-button">
            Sign In as {role === "citizen" ? "Citizen" : "Officer"}
          </button>
        </form>

        {role === "officer" && (
          <div className="officer-note">
            Authorized personnel only
          </div>
        )}
      </div>
    </main>
  );
}

export default Login;
