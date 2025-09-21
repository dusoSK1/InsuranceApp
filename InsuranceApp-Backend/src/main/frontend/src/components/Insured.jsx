import React, { useState, useEffect } from "react";
import api from "../api/axiosConfig";
import "../styles/Insured.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Insured() {
  const [policies, setPolicies] = useState([]);

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    try {
      const res = await api.get("/insurances", { withCredentials: true });
      setPolicies(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch insured persons!");
    }
  };

  return (
    <div className="insured-container">
      <h1>All Insured</h1>
      {policies.length === 0 ? (
        <div className="empty-message">No insured persons found.</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Insurance Number</th>
              <th>Phone Number</th>
            </tr>
          </thead>
          <tbody>
            {policies.map((p, idx) => (
              <tr key={idx}>
                <td>{p.firstName}</td>
                <td>{p.lastName}</td>
                <td>{p.number}</td>
                <td>{p.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
