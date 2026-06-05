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
      <div style={{ display: "flex", justifyContent: "center", padding: "40px 20px" }}>
        <div style={{ width: "100%", maxWidth: "420px", background: "white", padding: "30px", border: "1px solid #ddd", borderRadius: "6px" }}>
          <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Login</h2>

          {loginError && <p style={{ backgroundColor: "#fdecea", color: "#d32f2f", padding: "10px", borderRadius: "4px", fontSize: "14px" }}>{loginError}</p>}

          <form onSubmit={handleLogin}>
            <label style={{ display: "block", marginBottom: "4px", marginTop: "12px", fontWeight: "bold", fontSize: "14px" }}>Login Name</label>
            <input
              style={{ width: "100%", padding: "8px 10px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "14px", boxSizing: "border-box" }}
              type="text"
              value={loginName}
              onChange={(e) => setLoginName(e.target.value)}
              placeholder="Enter login name"
            />

            <label style={{ display: "block", marginBottom: "4px", marginTop: "12px", fontWeight: "bold", fontSize: "14px" }}>Password</label>
            <input
              style={{ width: "100%", padding: "8px 10px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "14px", boxSizing: "border-box" }}
              type="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              placeholder="Enter password"
            />

            <button type="submit" style={{ width: "100%", padding: "10px", marginTop: "20px", border: "none", borderRadius: "4px", fontSize: "16px", color: "white", cursor: "pointer", backgroundColor: "#1976d2" }}>
              Login
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: "20px", fontSize: "14px" }}>
            Don't have an account?{" "}
            <button
              type="button"
              style={{ background: "none", border: "none", padding: 0, color: "#1976d2", cursor: "pointer", textDecoration: "underline", fontSize: "14px" }}
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
    <div style={{ display: "flex", justifyContent: "center", padding: "40px 20px" }}>
      <div style={{ width: "100%", maxWidth: "420px", background: "white", padding: "30px", border: "1px solid #ddd", borderRadius: "6px" }}>
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Register New Account</h2>

        {regError && <p style={{ backgroundColor: "#fdecea", color: "#d32f2f", padding: "10px", borderRadius: "4px", fontSize: "14px" }}>{regError}</p>}
        {regSuccess && <p style={{ backgroundColor: "#edf7ed", color: "#2e7d32", padding: "10px", borderRadius: "4px", fontSize: "14px" }}>{regSuccess}</p>}

        <form onSubmit={handleRegister}>
          <label style={{ display: "block", marginBottom: "4px", marginTop: "12px", fontWeight: "bold", fontSize: "14px" }}>Login Name *</label>
          <input
            style={{ width: "100%", padding: "8px 10px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "14px", boxSizing: "border-box" }}
            type="text"
            value={regLoginName}
            onChange={(e) => setRegLoginName(e.target.value)}
            placeholder="Enter login name"
          />

          <div style={{ display: "flex", gap: "10px" }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: "block", marginBottom: "4px", marginTop: "12px", fontWeight: "bold", fontSize: "14px" }}>First Name *</label>
              <input
                style={{ width: "100%", padding: "8px 10px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "14px", boxSizing: "border-box" }}
                type="text"
                value={regFirstName}
                onChange={(e) => setRegFirstName(e.target.value)}
                placeholder="First name"
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: "block", marginBottom: "4px", marginTop: "12px", fontWeight: "bold", fontSize: "14px" }}>Last Name *</label>
              <input
                style={{ width: "100%", padding: "8px 10px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "14px", boxSizing: "border-box" }}
                type="text"
                value={regLastName}
                onChange={(e) => setRegLastName(e.target.value)}
                placeholder="Last name"
              />
            </div>
          </div>

          <label style={{ display: "block", marginBottom: "4px", marginTop: "12px", fontWeight: "bold", fontSize: "14px" }}>Password *</label>
          <input
            style={{ width: "100%", padding: "8px 10px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "14px", boxSizing: "border-box" }}
            type="password"
            value={regPassword}
            onChange={(e) => setRegPassword(e.target.value)}
            placeholder="Enter password"
          />

          <label style={{ display: "block", marginBottom: "4px", marginTop: "12px", fontWeight: "bold", fontSize: "14px" }}>Confirm Password *</label>
          <input
            style={{ width: "100%", padding: "8px 10px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "14px", boxSizing: "border-box" }}
            type="password"
            value={regPasswordConfirm}
            onChange={(e) => setRegPasswordConfirm(e.target.value)}
            placeholder="Confirm password"
          />

          <label style={{ display: "block", marginBottom: "4px", marginTop: "12px", fontWeight: "bold", fontSize: "14px" }}>Location</label>
          <input
            style={{ width: "100%", padding: "8px 10px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "14px", boxSizing: "border-box" }}
            type="text"
            value={regLocation}
            onChange={(e) => setRegLocation(e.target.value)}
            placeholder="Location"
          />

          <label style={{ display: "block", marginBottom: "4px", marginTop: "12px", fontWeight: "bold", fontSize: "14px" }}>Occupation</label>
          <input
            style={{ width: "100%", padding: "8px 10px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "14px", boxSizing: "border-box" }}
            type="text"
            value={regOccupation}
            onChange={(e) => setRegOccupation(e.target.value)}
            placeholder="Occupation"
          />

          <label style={{ display: "block", marginBottom: "4px", marginTop: "12px", fontWeight: "bold", fontSize: "14px" }}>Description</label>
          <textarea
            style={{ width: "100%", padding: "8px 10px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "14px", boxSizing: "border-box", resize: "vertical" }}
            value={regDescription}
            onChange={(e) => setRegDescription(e.target.value)}
            placeholder="About yourself"
            rows={3}
          />

          <button type="submit" style={{ width: "100%", padding: "10px", marginTop: "20px", border: "none", borderRadius: "4px", fontSize: "16px", color: "white", cursor: "pointer", backgroundColor: "#2e7d32" }}>
            Register Me
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "20px", fontSize: "14px" }}>
          Already have an account?{" "}
          <button
            type="button"
            style={{ background: "none", border: "none", padding: 0, color: "#1976d2", cursor: "pointer", textDecoration: "underline", fontSize: "14px" }}
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
