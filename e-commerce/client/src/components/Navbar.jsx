import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="amazon-navbar">
      <div className="nav-left" onClick={() => navigate("/products")}>
        <h2>amazon</h2>
      </div>

      <div className="nav-search">
        <input type="text" placeholder="Search Amazon" />
        <button>Search</button>
      </div>

      <div className="nav-right">
        <span>Hello, {user?.role}</span>
        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;