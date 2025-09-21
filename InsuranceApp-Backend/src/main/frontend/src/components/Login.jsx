import React, { useState } from "react";
import "../styles/LoginRegister.css";
import { toast } from "react-toastify";
import { login as loginApi } from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";

export default function Login({ setLoggedInUser }) {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle input change
  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  // Handle login submit
  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = credentials;

    if (!email || !password) {
      toast.error("All fields are required!");
      return;
    }

    try {
      setLoading(true);

      // response je už parsed JSON { token, user }
      const response = await loginApi(email, password);

      // Uložíme JWT token do localStorage
      if (response.token) {
        localStorage.setItem("jwt", response.token);
      }

      // Uložíme user objekt do state
      setLoggedInUser(response.user);

      toast.success("Login successful!");
      navigate("/"); // presmerovanie po úspešnom login
    } catch (error) {
      // Ak server vrátil JSON s chybou
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error);
      } else if (error.response && error.response.status === 401) {
        toast.error("Invalid email or password!");
      } else {
        toast.error("Server error. Please try again.");
      }
    } finally {
      setLoading(false);
      setCredentials({ email: "", password: "" });
    }
  };

  return (
    <div className="form-container">
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={credentials.email}
          onChange={handleChange}
          disabled={loading}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={credentials.password}
          onChange={handleChange}
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <div className="link-text">
        <a href="/register">Don't have an account? Register</a>
      </div>
    </div>
  );
}
