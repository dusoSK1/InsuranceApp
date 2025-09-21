import React, { useState } from "react";
import "../styles/LoginRegister.css";
import { toast } from "react-toastify";
import api from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [newUser, setNewUser] = useState({ email: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const { email, password, confirmPassword } = newUser;

    if (!email || !password || !confirmPassword) {
      toast.error("All fields are required!");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      setLoading(true);
      await api.post("/users/register", { email, password });
      toast.success("Registration successful!");
      setNewUser({ email: "", password: "", confirmPassword: "" });
      navigate("/login");
    } catch (error) {
      if (error.response && error.response.status === 409) {
        toast.error("User with this email already exists!");
      } else {
        toast.error("Server error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h1>Register</h1>
      <form onSubmit={handleRegister}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={newUser.email}
          onChange={handleChange}
          disabled={loading}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={newUser.password}
          onChange={handleChange}
          disabled={loading}
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={newUser.confirmPassword}
          onChange={handleChange}
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
      <div className="link-text">
        <a href="/login">Already have an account? Login</a>
      </div>
    </div>
  );
}
