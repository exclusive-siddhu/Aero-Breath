import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { logout } from "../../store/slices/authSlice";
import {
  clearSession,
  readUser,
  roleLabel
} from "../../utils/session";

import ThemeToggle from "../ThemeToggle.jsx";
import Icon from "../common/Icon.jsx";

export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const reduxUser = useSelector((state) => state.auth?.user);
  const user = reduxUser || readUser() || {};

  const handleLogout = () => {
    clearSession();
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  return (
    <nav className="topbar" aria-label="Account navigation">
      <Link to="/" className="wordmark">
        <span className="brand-mark">
          <Icon name="air" size={23} />
        </span>

        <span>
          AeroBreath<span className="wordmark-dot">.</span>
        </span>
      </Link>

      <div className="account-actions">
        <span className="welcome">
          Welcome back,{" "}
          <strong>{user.username || "User"}</strong>
        </span>

        <span className="role-badge">
          {roleLabel(user.role)}
        </span>

        <ThemeToggle />

        <span className="action-divider" aria-hidden="true" />

        <button
          type="button"
          className="logout-button"
          onClick={handleLogout}
        >
          <Icon name="logout" size={17} />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
}