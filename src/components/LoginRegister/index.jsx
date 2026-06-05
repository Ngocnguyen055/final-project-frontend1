import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchModelPost } from "../../lib/fetchModelData";

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
      <div style={{ padding: "30px", maxWidth: "400px", margin: "40px auto", border: "1px solid #ccc" }}>
        <h2 style={{ textAlign: "center" }}>Login</h2>

        {loginError && <p style={{ color: "red" }}>{loginError}</p>}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "10px" }}>
            <label>Login Name</label><br />
            <input
              style={{ width: "100%", boxSizing: "border-box", padding: "6px" }}
              type="text"
              value={loginName}
              onChange={(e) => setLoginName(e.target.value)}
            />
          </div>

          <div style={{ marginBottom: "10px" }}>
            <label>Password</label><br />
            <input
              style={{ width: "100%", boxSizing: "border-box", padding: "6px" }}
              type="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
            />
          </div>

          <button type="submit" style={{ width: "100%", padding: "8px", backgroundColor: "blue", color: "white", border: "none", cursor: "pointer" }}>Login</button>
        </form>

        <p style={{ textAlign: "center" }}>
          Don't have an account?{" "}
          <button
            type="button"
            onClick={() => {
              setIsRegisterMode(true);
              setLoginError("");
            }}
          >
            Register here
          </button>
        </p>
      </div>
    );
  }

  // ==================== REGISTER VIEW ====================
  return (
    <div style={{ padding: "30px", maxWidth: "400px", margin: "40px auto", border: "1px solid #ccc" }}>
      <h2 style={{ textAlign: "center" }}>Register New Account</h2>

      {regError && <p style={{ color: "red" }}>{regError}</p>}
      {regSuccess && <p style={{ color: "green" }}>{regSuccess}</p>}

      <form onSubmit={handleRegister}>
        <div style={{ marginBottom: "10px" }}>
          <label>Login Name *</label><br />
          <input
            style={{ width: "100%", boxSizing: "border-box", padding: "6px" }}
            type="text"
            value={regLoginName}
            onChange={(e) => setRegLoginName(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>First Name *</label><br />
          <input
            style={{ width: "100%", boxSizing: "border-box", padding: "6px" }}
            type="text"
            value={regFirstName}
            onChange={(e) => setRegFirstName(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Last Name *</label><br />
          <input
            style={{ width: "100%", boxSizing: "border-box", padding: "6px" }}
            type="text"
            value={regLastName}
            onChange={(e) => setRegLastName(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Password *</label><br />
          <input
            style={{ width: "100%", boxSizing: "border-box", padding: "6px" }}
            type="password"
            value={regPassword}
            onChange={(e) => setRegPassword(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Confirm Password *</label><br />
          <input
            style={{ width: "100%", boxSizing: "border-box", padding: "6px" }}
            type="password"
            value={regPasswordConfirm}
            onChange={(e) => setRegPasswordConfirm(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Location</label><br />
          <input
            style={{ width: "100%", boxSizing: "border-box", padding: "6px" }}
            type="text"
            value={regLocation}
            onChange={(e) => setRegLocation(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Occupation</label><br />
          <input
            style={{ width: "100%", boxSizing: "border-box", padding: "6px" }}
            type="text"
            value={regOccupation}
            onChange={(e) => setRegOccupation(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Description</label><br />
          <textarea
            style={{ width: "100%", boxSizing: "border-box", padding: "6px" }}
            value={regDescription}
            onChange={(e) => setRegDescription(e.target.value)}
            rows={3}
          />
        </div>

        <button type="submit" style={{ width: "100%", padding: "8px", backgroundColor: "green", color: "white", border: "none", cursor: "pointer" }}>Register Me</button>
      </form>

      <p style={{ textAlign: "center" }}>
        Already have an account?{" "}
        <button
          type="button"
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
  );
}

export default LoginRegister;
