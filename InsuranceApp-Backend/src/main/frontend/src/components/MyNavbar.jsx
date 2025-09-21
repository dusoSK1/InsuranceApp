import React from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/MyNavbar.css";
import api from "../api/axiosConfig";

export default function MyNavbar({ loggedInUser, setLoggedInUser, users, setUsers }) {

  const handleLogout = () => {
    setLoggedInUser(null);
    localStorage.removeItem("loggedInUser");
  };

  const handleDeleteUser = async () => {
    if (!loggedInUser) return;

    if (!window.confirm("Are you sure you want to delete your account? This cannot be undone.")) return;

    try {
      await api.delete(`/users/${loggedInUser.id}`, { withCredentials: true });

      alert("Account deleted successfully");
      setLoggedInUser(null);
      localStorage.removeItem("loggedInUser");
      setUsers(users.filter(u => u.id !== loggedInUser.id));
      window.location.href = "/login"; // redirect after deletion

    } catch (err) {
      console.error(err);
      alert(err.response?.data || "Something went wrong");
    }
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand>InsuranceApp</Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <LinkContainer to="/insurance">
              <Nav.Link>Insurance</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/insured">
              <Nav.Link>Insured</Nav.Link>
            </LinkContainer>
          </Nav>
          <Nav className="ms-auto">
            {loggedInUser ? (
              <>
                <Navbar.Text className="me-2">Hi, {loggedInUser.email}</Navbar.Text>
                <Button variant="outline-light" size="sm" onClick={handleLogout}>Logout</Button>
                <Button variant="outline-danger" size="sm" className="ms-2" onClick={handleDeleteUser}>Delete Account</Button>
              </>
            ) : (
              <>
                <LinkContainer to="/login">
                  <Nav.Link>Login</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/register">
                  <Nav.Link>Register</Nav.Link>
                </LinkContainer>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
