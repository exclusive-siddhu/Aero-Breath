import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authService } from "../services/authService";
import { loginSuccess } from "../store/slices/authSlice";
import { saveSession, errorMessage } from "../utils/session";
import AuthFrame from "./layout/AuthFrame";
import Icon from "./common/Icon";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (event) => {
    event.preventDefault();
    if (loading) return;

    if (!username.trim() || !password) {
      setError("Enter your username and password.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await authService.login({
        username: username.trim(),
        password
      });

      const data = response?.data ?? response;

      if (!data?.token) {
        throw new Error(
          "The server did not return a valid session. Please try again."
        );
      }

      const user = {
        username: data.username || username.trim(),
        role: data.role || "CITIZEN",
        city: data.city || ""
      };

      saveSession(user, data.token, rememberMe);
      dispatch(loginSuccess({ ...user, token: data.token }));
      navigate("/", { replace: true });
    } catch (err) {
      setError(
        err?.response?.status === 401
          ? "Incorrect username or password."
          : errorMessage(err)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthFrame>
      <span className="eyebrow">YOUR WORKSPACE</span>
      <h1 id="login-title">Welcome back</h1>
      <p className="form-intro">
        Enter your credentials to access your workspace.
      </p>

      {location.state?.expired && (
        <p className="alert-error" role="alert">
          Your session has expired. Please log in again.
        </p>
      )}
      {location.state?.registered && (
        <p className="alert-success" role="status">
          Account created. You can now log in.
        </p>
      )}

      <form
        className="auth-form"
        onSubmit={handleLogin}
        aria-labelledby="login-title"
      >
        {error && <div className="alert-error" role="alert">{error}</div>}

        <div className="field">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            placeholder="Email (user@aerobreath.com)"
            autoComplete="username"
            autoCapitalize="none"
            spellCheck={false}
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="password">Password</label>
          <div className="password-field">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            <button
              type="button"
              className="password-eye"
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              onClick={() => setShowPassword((value) => !value)}
            >
              <Icon name="eye" size={18} />
            </button>
          </div>
        </div>

        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(event) => setRememberMe(event.target.checked)}
          />
          Remember me
        </label>

        <button
          type="submit"
          className="btn primary wide"
          disabled={loading}
          aria-busy={loading}
        >
          {loading ? "Signing in…" : "Sign In"}
          <Icon name="arrow" size={18} />
        </button>

        <p className="auth-register">
          New to AeroBreath? <Link to="/register">Create an account</Link>
        </p>
      </form>
    </AuthFrame>
  );
}