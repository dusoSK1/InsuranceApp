import React, { useState, useEffect } from "react";
import api from "../api/axiosConfig";
import "../styles/Insurance.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Insurance() {
  const [policies, setPolicies] = useState([]);
  const [newPolicy, setNewPolicy] = useState({ firstName: "", lastName: "", number: "", phone: "" });
  const [editId, setEditId] = useState(null);

  // Get all insurances on component mount
  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    try {
      const res = await api.get("/insurances", { withCredentials: true });
      setPolicies(res.data);
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 403) {
        toast.error("You are not authorized. Please log in.");
      } else {
        toast.error("Failed to fetch insurances!");
      }
    }
  };

  const handleChange = (e) => {
    setNewPolicy({ ...newPolicy, [e.target.name]: e.target.value });
  };

  const handleAddOrEditPolicy = async () => {
    const { firstName, lastName, number, phone } = newPolicy;

    if (!firstName || !lastName || !number || !phone) {
      toast.error("All fields are required!");
      return;
    }

    if (!/^\d+$/.test(number)) {
      toast.error("Insurance number must be numeric!");
      return;
    }

    try {
      if (editId !== null) {
        await api.put(`/insurances/${editId}`, newPolicy, { withCredentials: true });
        toast.success("Insurance edited!");
        setEditId(null);
      } else {
        const payload = { ...newPolicy };
        delete payload.id;
        await api.post("/insurances", payload, { withCredentials: true });
        toast.success("Insurance added!");
      }

      setNewPolicy({ firstName: "", lastName: "", number: "", phone: "" });
      fetchPolicies();

    } catch (err) {
      if (err.response && err.response.status === 409) {
        toast.error("Insurance with this number or name already exists!");
      } else if (err.response && err.response.status === 403) {
        toast.error("You are not authorized. Please log in.");
      } else {
        toast.error("An error occurred while saving the insurance!");
      }
    }
  };

  const handleEditClick = (policy) => {
    setNewPolicy({
      firstName: policy.firstName,
      lastName: policy.lastName,
      number: policy.number,
      phone: policy.phone,
    });
    setEditId(policy.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/insurances/${id}`, { withCredentials: true });
      toast.success("Insurance deleted!");
      fetchPolicies();
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 403) {
        toast.error("You are not authorized. Please log in");
      } else {
        toast.error("Failed to delete insurance!");
      }
    }
  };

  return (
    <div className="insurance-container">
      <h2>{editId !== null ? "Edit Insurance" : "Add New Insurance"}</h2>
      <div className="insurance-form">
        <input type="text" name="firstName" placeholder="First Name" value={newPolicy.firstName} onChange={handleChange} />
        <input type="text" name="lastName" placeholder="Surname" value={newPolicy.lastName} onChange={handleChange} />
        <input type="number" name="number" placeholder="Insurance number" value={newPolicy.number} onChange={handleChange} />
        <input type="text" name="phone" placeholder="Phone number" value={newPolicy.phone} onChange={handleChange} />
        <button onClick={handleAddOrEditPolicy}>{editId !== null ? "Update Insurance" : "Add Insurance"}</button>
      </div>

      <h2>Insurances</h2>
      {policies.length === 0 ? (
        <div className="empty-message">No insured persons found.</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Surname</th>
              <th>Insurance number</th>
              <th>Phone number</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {policies.map((policy) => (
              <tr key={policy.id}>
                <td>{policy.firstName}</td>
                <td>{policy.lastName}</td>
                <td style={{ textAlign: "center" }}>{policy.number}</td>
                <td>{policy.phone}</td>
                <td>
                  <button onClick={() => handleEditClick(policy)}>Edit</button>
                  <button onClick={() => handleDelete(policy.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
