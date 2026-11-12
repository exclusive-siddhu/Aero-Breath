import React from "react";
import Icon from "./Icon";

export default function EmptyState({
  message = "No data available",
  detail,
  children
}) {
  return (
    <div className="empty-state">
      <span className="empty-icon"><Icon name="air" size={26} /></span>
      <h3>{message || "No data available"}</h3>
      {detail && <p>{detail}</p>}
      {children}
    </div>
  );
}