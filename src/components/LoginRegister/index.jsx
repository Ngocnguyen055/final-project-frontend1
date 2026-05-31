import React, { useState } from "react";
import {
  Typography,
  TextField,
  Button,
  Paper,
  Divider,
  Alert,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { fetchModelPost } from "../../lib/fetchModelData";
import "./styles.css";

function LoginRegister({ onLogin }) {
  const navigate = useNavigate();

  // Toggle between login and register view
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
      setLoginError("Vui lòng nhập tên đăng nhập");
      return;
    }
    if (!loginPassword.trim()) {
      setLoginError("Vui lòng nhập mật khẩu");
      return;
    }

    try {
      const response = await fetchModelPost("/admin/login", {
        login_name: loginName,
        password: loginPassword,
      });

      // Save token and user info to localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data));

      // Notify parent component
      onLogin(response.data);

      // Navigate to the logged-in user's detail page
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
      // Clear the form
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
      <div className="login-register-container">
        <Paper elevation={3} className="login-register-paper">
          <Typography variant="h5" gutterBottom className="section-title">
            🔐 Login
          </Typography>
          <Divider style={{ marginBottom: "20px" }} />

          {loginError && (
            <Alert severity="error" style={{ marginBottom: "15px" }}>
              {loginError}
            </Alert>
          )}

          <form onSubmit={handleLogin}>
            <TextField
              label="Login Name"
              variant="outlined"
              fullWidth
              margin="normal"
              value={loginName}
              onChange={(e) => setLoginName(e.target.value)}
              autoFocus
            />
            <TextField
              label="Password"
              variant="outlined"
              type="password"
              fullWidth
              margin="normal"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              style={{ marginTop: "15px" }}
            >
              Login
            </Button>
          </form>

          <Box mt={3} textAlign="center">
            <Typography variant="body2">
              Don't have an account?{" "}
              <Button
                color="primary"
                onClick={() => {
                  setIsRegisterMode(true);
                  setLoginError("");
                }}
              >
                Register here
              </Button>
            </Typography>
          </Box>
        </Paper>
      </div>
    );
  }

  // ==================== REGISTER VIEW ====================
  return (
    <div className="login-register-container">
      <Paper elevation={3} className="login-register-paper">
        <Typography variant="h5" gutterBottom className="section-title">
          📝 Register New Account
        </Typography>
        <Divider style={{ marginBottom: "20px" }} />

        {regError && (
          <Alert severity="error" style={{ marginBottom: "15px" }}>
            {regError}
          </Alert>
        )}
        {regSuccess && (
          <Alert severity="success" style={{ marginBottom: "15px" }}>
            {regSuccess}
          </Alert>
        )}

        <form onSubmit={handleRegister}>
          <TextField
            label="Login Name *"
            variant="outlined"
            fullWidth
            margin="dense"
            value={regLoginName}
            onChange={(e) => setRegLoginName(e.target.value)}
            autoFocus
          />
          <Box display="flex" gap={2}>
            <TextField
              label="First Name *"
              variant="outlined"
              fullWidth
              margin="dense"
              value={regFirstName}
              onChange={(e) => setRegFirstName(e.target.value)}
            />
            <TextField
              label="Last Name *"
              variant="outlined"
              fullWidth
              margin="dense"
              value={regLastName}
              onChange={(e) => setRegLastName(e.target.value)}
            />
          </Box>
          <TextField
            label="Password *"
            variant="outlined"
            type="password"
            fullWidth
            margin="dense"
            value={regPassword}
            onChange={(e) => setRegPassword(e.target.value)}
          />
          <TextField
            label="Confirm Password *"
            variant="outlined"
            type="password"
            fullWidth
            margin="dense"
            value={regPasswordConfirm}
            onChange={(e) => setRegPasswordConfirm(e.target.value)}
          />
          <TextField
            label="Location"
            variant="outlined"
            fullWidth
            margin="dense"
            value={regLocation}
            onChange={(e) => setRegLocation(e.target.value)}
          />
          <TextField
            label="Occupation"
            variant="outlined"
            fullWidth
            margin="dense"
            value={regOccupation}
            onChange={(e) => setRegOccupation(e.target.value)}
          />
          <TextField
            label="Description"
            variant="outlined"
            fullWidth
            margin="dense"
            multiline
            rows={2}
            value={regDescription}
            onChange={(e) => setRegDescription(e.target.value)}
          />
          <Button
            type="submit"
            variant="contained"
            color="success"
            fullWidth
            size="large"
            style={{ marginTop: "15px" }}
          >
            Register Me
          </Button>
        </form>

        <Box mt={3} textAlign="center">
          <Typography variant="body2">
            Already have an account?{" "}
            <Button
              color="primary"
              onClick={() => {
                setIsRegisterMode(false);
                setRegError("");
                setRegSuccess("");
              }}
            >
              Login here
            </Button>
          </Typography>
        </Box>
      </Paper>
    </div>
  );
}

export default LoginRegister;
