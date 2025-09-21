import "../styles/Home.css";
import MyNavbar from './MyNavbar';


export default function HomePage({ loggedInUser }) {
  return (
    <div className="home-container">
      <h1>Welcome to InsuranceApp</h1>
      {loggedInUser ? (
        <p>Hello, {loggedInUser.email}! You are logged in.</p>
      ) : (
        <p>Please login or register to continue.</p>
      )}
    </div>
  );
}