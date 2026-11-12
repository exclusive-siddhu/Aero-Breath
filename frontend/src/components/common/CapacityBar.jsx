import React from "react";
import { finiteNumber } from "../../utils/session";

export default function CapacityBar({ capacity = 0 }) {
  const amount = Math.min(100, Math.max(0, finiteNumber(capacity) ?? 0));
  const tone = amount >= 90 ? "danger" : amount >= 70 ? "warning" : "success";

  return (
    <div className="capacity">
      <div className="capacity-label">
        <span>Utilization</span>
        <strong>{amount}%</strong>
      </div>
      <div
        className="capacity-track"
        role="progressbar"
        aria-label="Station utilization"
        aria-valuenow={amount}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={`capacity-fill ${tone}`}
          style={{ width: `${amount}%` }}
        />
      </div>
    </div>
  );
}