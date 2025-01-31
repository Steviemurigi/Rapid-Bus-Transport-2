import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_API_URL;

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {  // ✅ Fixed backticks
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user_role", data.role);
        navigate("/dashboard");
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (error) {
      setError("Server error. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-container">
        <h3>Welcome back!</h3>
        <p>Log into your account</p>

        {error && <p className="error-message">{error}</p>}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              className="login-input"
              required
            />
          </div>

          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              className="login-input"
              required
            />
          </div>

          <button type="submit" className="login-button">Login</button>
        </form>

        <div className="login-footer">
          <p><Link to="/forgot-password">Forgot password?</Link></p>
          <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Login;
