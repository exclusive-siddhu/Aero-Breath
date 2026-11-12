import React from "react";
import { Link } from "react-router-dom";
import Icon from "../common/Icon";
import ThemeToggle from "../ThemeToggle";

export default function AuthFrame({ children }) {
  return (
    <div className="auth-page">
      <div className="auth-top">
        <Link to="/" className="wordmark">
          <span className="brand-mark"><Icon name="air" /></span>
          AeroBreath.
        </Link>
        <ThemeToggle />
      </div>

      <div className="auth-frame">
        <aside className="auth-story">
          <span className="eyebrow">ENVIRONMENT MEETS HEALTH</span>
          <h2>
            A clearer view.<br /> A healthier<br /> <em>perspective.</em>
          </h2>
          <p>
            Connect your surroundings with your respiratory health.
            One observation at a time.
          </p>

          <div className="auth-orbit" aria-hidden="true">
            <span /><span /><span />
            <Icon name="air" size={60} />
          </div>

          <div className="auth-story-footer">
            <Icon name="leaf" size={18} />
            <span>Observe. Understand. Breathe easier.</span>
          </div>
        </aside>

        <section className="auth-form-panel">
          {children}
          <p className="auth-footnote">
            <Icon name="lock" size={14} />
            Environmental monitoring &amp; respiratory health
          </p>
        </section>
      </div>
    </div>
  );
}