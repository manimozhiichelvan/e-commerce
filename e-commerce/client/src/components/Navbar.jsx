import { Link, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const accountType = localStorage.getItem("account_type");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className={`navbar ${role === "admin" ? "admin-nav" : ""}`}>
      <div className="navbar-left">
        <h2
          style={{ cursor: "pointer" }}
          onClick={() =>
            role === "admin"
              ? navigate("/admin")
              : navigate("/products")
          }
        >
          {role === "admin" ? "Amazon Admin Panel" : "Amazon"}
        </h2>
      </div>

      <div className="navbar-right">
        {role === "admin" ? (
          <>
            <Link to="/admin">Dashboard</Link>
          </>
        ) : (
          <>
            <Link to="/products">Products</Link>
            <Link to="/cart">Cart</Link>
            <Link to="/my-orders">My Orders</Link>

            <span className={`badge ${accountType}`}>
              {accountType?.toUpperCase()}
            </span>
          </>
        )}

        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;