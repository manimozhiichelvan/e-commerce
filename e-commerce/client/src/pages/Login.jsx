import { useState } from "react";
import axios from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Auth.css";

const Login = () => {
  const [form, setForm] = useState({});
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/auth/login", form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("account_type", res.data.account_type);

      if (res.data.role === "admin") navigate("/admin");
      else navigate("/products");
    } catch {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-box">
        <h2 className="auth-logo">Amazon</h2>
        <form onSubmit={submit}>
          <h3>Sign-In</h3>

          <label>Email</label>
          <input
            type="email"
            required
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <label>Password</label>
          <input
            type="password"
            required
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />

          <button>Login</button>

          <p className="auth-switch">
            New to Amazon? <Link to="/register">Create account</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;