import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import { errorMessage } from "../utils/session";
import AuthFrame from "./layout/AuthFrame";
import Icon from "./common/Icon";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    city: "",
    password: "",
    role: "CITIZEN"
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const change = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value
    }));
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    if (loading) return;

    if (!form.username.trim() || !form.city.trim()) {
      setError("Enter a username and city.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await authService.register({
        ...form,
        username: form.username.trim(),
        email: form.email.trim(),
        city: form.city.trim()
      });
      navigate("/login", { replace: true, state: { registered: true } });
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthFrame>
      <span className="eyebrow">GET STARTED</span>
      <h1>Create your account</h1>
      <p className="form-intro">
        A connected view of your environment and health.
      </p>

      <form onSubmit={handleRegister} className="auth-form">
        {error && <div role="alert" className="alert-error">{error}</div>}

        <div className="field">
          <label htmlFor="register-username">Username</label>
          <input
            id="register-username"
            name="username"
            placeholder="Username"
            autoComplete="username"
            value={form.username}
            onChange={change}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="register-email">Email</label>
          <input
            id="register-email"
            name="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            value={form.email}
            onChange={change}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="register-city">City</label>
          <input
            id="register-city"
            name="city"
            placeholder="City"
            autoComplete="address-level2"
            value={form.city}
            onChange={change}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="register-password">Password</label>
          <div className="password-field">
            <input
              id="register-password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a password"
              autoComplete="new-password"
              value={form.password}
              onChange={change}
              required
            />
            <button
              className="password-eye"
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              onClick={() => setShowPassword((value) => !value)}
            >
              <Icon name="eye" size={18} />
            </button>
          </div>
        </div>

        <div className="field">
          <label htmlFor="register-role">Account role</label>
          <select
            id="register-role"
            name="role"
            value={form.role}
            onChange={change}
          >
            <option value="CITIZEN">Citizen</option>
            <option value="ENVIRONMENTAL_OFFICER">Environmental Officer</option>
            <option value="MEDICAL_RESEARCHER">Medical Researcher</option>
            <option value="SYSTEM_ADMIN">System Admin</option>
          </select>
          <small>Role access is validated by the server.</small>
        </div>

        <button className="btn primary wide" type="submit" disabled={loading}>
          {loading ? "Creating account…" : "SIGN UP"}
          <Icon name="arrow" size={18} />
        </button>

        <p className="auth-register">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </AuthFrame>
  );
}