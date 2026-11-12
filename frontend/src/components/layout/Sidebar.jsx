import React from "react";
import { NavLink } from "react-router-dom";
import Icon from "../common/Icon";

const modules = [
  ["/", "Overview", "grid"],
  ["/stations", "Air quality stations", "station"],
  ["/health", "Health journal", "heart"],
  ["/insights", "Research insights", "research"],
  ["/trends", "AQI trends", "chart"],
  ["/modules", "All modules", "grid"]
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <p className="nav-caption">WORKSPACE</p>

      <nav className="workspace-nav" aria-label="Workspace modules">
        {modules.map(([to, title, icon]) => (
          <NavLink
            end={to === "/"}
            to={to}
            key={to}
            className={({ isActive }) =>
              `workspace-link${isActive ? " selected" : ""}`
            }
          >
            <Icon name={icon} size={19} />
            <span>{title}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="sidebar-illustration" aria-hidden="true">
          <Icon name="leaf" size={28} />
        </div>
        <h3>A clearer perspective.</h3>
        <p>Your environment and health,<br />connected in one place.</p>
        <span className="sidebar-footnote">AEROBREATH WORKSPACE</span>
      </div>
    </aside>
  );
}