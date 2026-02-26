import { useState } from "react";
import axios from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Auth.css";

const Register = () => {
  const [form, setForm] = useState({});
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    await axios.post("/auth/register", form);
    alert("Account Created Successfully");
    navigate("/login");
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-box">
        <h2 className="auth-logo">Amazon</h2>
        <form onSubmit={submit}>
          <h3>Create Account</h3>

          <label>Name</label>
          <input
            required
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

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

          <label>Choose Plan</label>
          <select
            onChange={(e) =>
              setForm({ ...form, account_type: e.target.value })
            }
          >
            <option value="free">Free</option>
            <option value="pro">Pro</option>
            <option value="premium">Premium</option>
          </select>

          <button>Create Account</button>

          <p className="auth-switch">
            Already have account? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;