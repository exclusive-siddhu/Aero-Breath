import React from "react";
import Icon from "../common/Icon";

export default function MetricDisplay({ metric }) {
  if (!metric) {
    return (
      <div className="empty-state">
        No metric data available.
      </div>
    );
  }

  return (
    <section className="metric-display">
      <h3>
        <Icon name="chart" size={18} />
        Latest City Measurements
      </h3>

      <dl className="metric-grid">
        <div>
          <dt>AQI Value:</dt>
          <dd>{metric.aqiValue ?? metric.aqi ?? "N/A"}</dd>
        </div>

        <div>
          <dt>PM2.5:</dt>
          <dd>{metric.pm25 ?? "N/A"}</dd>
        </div>

        <div>
          <dt>PM10:</dt>
          <dd>{metric.pm10 ?? "N/A"}</dd>
        </div>
      </dl>

      <p className="muted">
        Recorded at: {metric.recordedAt || "Not supplied"}
      </p>
    </section>
  );
}