import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchModelPost } from "../../lib/fetchModelData";
import "./styles.css";

function LoginRegister({ onLogin }) {
  const navigate = useNavigate();

  // Toggle between Login and Register
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  // Login state
  const [loginName, setLoginName] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Register state
  const [regLoginName, setRegLoginName] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regPasswordConfirm, setRegPasswordConfirm] = useState("");
  const [regFirstName, setRegFirstName] = useState("");
  const [regLastName, setRegLastName] = useState("");
  const [regLocation, setRegLocation] = useState("");
  const [regDescription, setRegDescription] = useState("");
  const [regOccupation, setRegOccupation] = useState("");
  const [regError, setRegError] = useState("");
  const [regSuccess, setRegSuccess] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");

    if (!loginName.trim()) {
      setLoginError("Please enter login name");
      return;
    }
    if (!loginPassword.trim()) {
      setLoginError("Please enter password");
      return;
    }

    try {
      const response = await fetchModelPost("/admin/login", {
        login_name: loginName,
        password: loginPassword,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data));
      onLogin(response.data);
      navigate(`/users/${response.data._id}`);
    } catch (error) {
      setLoginError(error.message || "Login failed. Please try again.");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegError("");
    setRegSuccess("");

    if (!regLoginName.trim()) {
      setRegError("Login name is required");
      return;
    }
    if (!regFirstName.trim()) {
      setRegError("First name is required");
      return;
    }
    if (!regLastName.trim()) {
      setRegError("Last name is required");
      return;
    }
    if (!regPassword.trim()) {
      setRegError("Password is required");
      return;
    }
    if (regPassword !== regPasswordConfirm) {
      setRegError("Passwords do not match");
      return;
    }

    try {
      await fetchModelPost("/user", {
        login_name: regLoginName,
        password: regPassword,
        first_name: regFirstName,
        last_name: regLastName,
        location: regLocation,
        description: regDescription,
        occupation: regOccupation,
      });

      setRegSuccess("Registration successful! You can now login.");
      setRegLoginName("");
      setRegPassword("");
      setRegPasswordConfirm("");
      setRegFirstName("");
      setRegLastName("");
      setRegLocation("");
      setRegDescription("");
      setRegOccupation("");
    } catch (error) {
      setRegError(error.message || "Registration failed. Please try again.");
    }
  };

  // ==================== LOGIN VIEW ====================
  if (!isRegisterMode) {
    return (
      <div className="login-container">
        <div className="login-box">
          <h2>Login</h2>

          {loginError && <p className="error-msg">{loginError}</p>}

          <form onSubmit={handleLogin}>
            <label>Login Name</label>
            <input
              type="text"
              value={loginName}
              onChange={(e) => setLoginName(e.target.value)}
              placeholder="Enter login name"
            />

            <label>Password</label>
            <input
              type="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              placeholder="Enter password"
            />

            <button type="submit" className="btn-primary">
              Login
            </button>
          </form>

          <p className="switch-text">
            Don't have an account?{" "}
            <button
              type="button"
              className="switch-link"
              onClick={() => {
                setIsRegisterMode(true);
                setLoginError("");
              }}
            >
              Register here
            </button>
          </p>
        </div>
      </div>
    );
  }

  // ==================== REGISTER VIEW ====================
  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Register New Account</h2>

        {regError && <p className="error-msg">{regError}</p>}
        {regSuccess && <p className="success-msg">{regSuccess}</p>}

        <form onSubmit={handleRegister}>
          <label>Login Name *</label>
          <input
            type="text"
            value={regLoginName}
            onChange={(e) => setRegLoginName(e.target.value)}
            placeholder="Enter login name"
          />

          <div className="form-row">
            <div className="form-group">
              <label>First Name *</label>
              <input
                type="text"
                value={regFirstName}
                onChange={(e) => setRegFirstName(e.target.value)}
                placeholder="First name"
              />
            </div>
            <div className="form-group">
              <label>Last Name *</label>
              <input
                type="text"
                value={regLastName}
                onChange={(e) => setRegLastName(e.target.value)}
                placeholder="Last name"
              />
            </div>
          </div>

          <label>Password *</label>
          <input
            type="password"
            value={regPassword}
            onChange={(e) => setRegPassword(e.target.value)}
            placeholder="Enter password"
          />

          <label>Confirm Password *</label>
          <input
            type="password"
            value={regPasswordConfirm}
            onChange={(e) => setRegPasswordConfirm(e.target.value)}
            placeholder="Confirm password"
          />

          <label>Location</label>
          <input
            type="text"
            value={regLocation}
            onChange={(e) => setRegLocation(e.target.value)}
            placeholder="Location"
          />

          <label>Occupation</label>
          <input
            type="text"
            value={regOccupation}
            onChange={(e) => setRegOccupation(e.target.value)}
            placeholder="Occupation"
          />

          <label>Description</label>
          <textarea
            value={regDescription}
            onChange={(e) => setRegDescription(e.target.value)}
            placeholder="About yourself"
            rows={3}
          />

          <button type="submit" className="btn-success">
            Register Me
          </button>
        </form>

        <p className="switch-text">
          Already have an account?{" "}
          <button
            type="button"
            className="switch-link"
            onClick={() => {
              setIsRegisterMode(false);
              setRegError("");
              setRegSuccess("");
            }}
          >
            Login here
          </button>
        </p>
      </div>
    </div>
  );
}

export default LoginRegister;
