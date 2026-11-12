import React from "react";

export default function Loader({ text = "Loading..." }) {
  return (
    <div className="loading-indicator" role="status">
      <span className="spinner" aria-hidden="true" />
      <span>{text || "Loading..."}</span>
    </div>
  );
}