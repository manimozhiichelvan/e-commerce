import { Link, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const accountType = localStorage.getItem("account_type");
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (!token) return null;

  return (
    <nav className="navbar">
      <div className="nav-left">
        <h2
          className="logo"
          onClick={() => navigate("/products")}
        >
          Amazon
        </h2>
      </div>

      <div className="nav-right">

        <Link to="/products">Products</Link>

        {role !== "admin" && (
          <>
            <Link to="/cart">Cart</Link>
            <Link to="/my-orders">My Orders</Link>

            <span className={`badge ${accountType}`}>
              {accountType?.toUpperCase()}
            </span>
          </>
        )}
        {role === "admin" && (
          <Link to="/admin">Dashboard</Link>
        )}

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>

      </div>
    </nav>
  );
};

export default Navbar;