import React, { useId, useState } from "react";
import { finiteNumber } from "../../utils/session";
import EmptyState from "../common/EmptyState.jsx";

const SAMPLE = [35, 42, 50, 48, 62, 55, 40];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function DomainChart({ data = [] }) {
  const [showSample, setShowSample] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const chartId = useId();

  const source = showSample
    ? SAMPLE
    : Array.isArray(data)
      ? data
      : [];

  const readings = source.map((item, index) => {
    const value = finiteNumber(
      item && typeof item === "object"
        ? item.aqiValue ?? item.aqi
        : item
    );

    const date = item?.date || item?.recordedAt || item?.timestamp;

    return {
      value: value !== null && value >= 0 ? value : null,
      label: showSample
        ? DAYS[index]
        : date
          ? String(date).slice(0, 10)
          : `Reading ${index + 1}`
    };
  });

  const validValues = readings
    .filter((reading) => reading.value !== null)
    .map((reading) => reading.value);

  const maximum = Math.max(
    100,
    Math.ceil(Math.max(0, ...validValues) / 50) * 50
  );

  const getX = (index) =>
    readings.length === 1
      ? 400
      : 48 + (index * 704) / (readings.length - 1);

  const getY = (value) => 210 - (value / maximum) * 164;

  let path = "";
  let connected = false;

  readings.forEach((reading, index) => {
    if (reading.value === null) {
      connected = false;
      return;
    }

    path += `${connected ? " L" : " M"}${getX(index)},${getY(reading.value)}`;
    connected = true;
  });

  const average = validValues.length
    ? Math.round(
        validValues.reduce((total, value) => total + value, 0) /
          validValues.length
      )
    : null;

  return (
    <section className="panel domain-chart">
      <div className="section-heading">
        <div>
          <span className="eyebrow">AIR QUALITY</span>
          <h2>AQI trends over time</h2>
          <p>
            {showSample
              ? "Illustrative seven-day series"
              : "Available readings from your metric history"}
          </p>
        </div>

        <button
          type="button"
          className="btn secondary small"
          onClick={() => {
            setShowSample((current) => !current);
            setActiveIndex(null);
          }}
        >
          {showSample ? "Show actual readings" : "Preview sample chart"}
        </button>
      </div>

      {showSample && (
        <p className="sample-notice">
          Sample data · not live readings
        </p>
      )}

      {validValues.length > 0 ? (
        <>
          <div className="chart-meta">
            <span>
              MIN / MAX{" "}
              <strong>
                {Math.min(...validValues)} / {Math.max(...validValues)}
              </strong>
            </span>

            <span>
              AVERAGE <strong>{average} AQI</strong>
            </span>
          </div>

          <svg
            className="aqi-chart"
            viewBox="0 0 800 258"
            role="img"
            aria-labelledby={chartId}
          >
            <title id={chartId}>
              {showSample ? "Sample " : ""}AQI readings:{" "}
              {validValues.join(", ")}
            </title>

            {[0, maximum / 2, maximum].map((value) => (
              <g key={value}>
                <line
                  className="chart-grid"
                  x1="48"
                  x2="752"
                  y1={getY(value)}
                  y2={getY(value)}
                />
                <text
                  className="chart-axis"
                  x="34"
                  y={getY(value) + 4}
                  textAnchor="end"
                >
                  {value}
                </text>
              </g>
            ))}

            <path className="chart-line" d={path} />

            {readings.map((reading, index) => {
              if (reading.value === null) return null;

              const active = activeIndex === index;
              const showLabel =
                index === 0 ||
                index === readings.length - 1 ||
                index % Math.max(1, Math.ceil(readings.length / 7)) === 0;

              return (
                <g
                  key={index}
                  tabIndex={0}
                  role="img"
                  aria-label={`${reading.label}: ${reading.value} AQI`}
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                  onFocus={() => setActiveIndex(index)}
                  onBlur={() => setActiveIndex(null)}
                >
                  <circle
                    cx={getX(index)}
                    cy={getY(reading.value)}
                    r="13"
                    fill="transparent"
                  />

                  {active && (
                    <circle
                      className="chart-halo"
                      cx={getX(index)}
                      cy={getY(reading.value)}
                      r="11"
                    />
                  )}

                  <circle
                    className="chart-point"
                    cx={getX(index)}
                    cy={getY(reading.value)}
                    r={active ? 5.5 : 4}
                  />

                  {(readings.length <= 12 || active) && (
                    <text
                      className="chart-value"
                      x={getX(index)}
                      y={getY(reading.value) - 15}
                      textAnchor="middle"
                    >
                      {reading.value}
                    </text>
                  )}

                  {showLabel && (
                    <text
                      className="chart-axis"
                      x={getX(index)}
                      y="243"
                      textAnchor="middle"
                    >
                      {reading.label}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          <details className="chart-details">
            <summary>View readings as a table</summary>
            <div className="table-scroll">
              <table className="glass-table">
                <thead>
                  <tr>
                    <th>Observation</th>
                    <th>AQI</th>
                  </tr>
                </thead>
                <tbody>
                  {readings.map((reading, index) => (
                    <tr key={index}>
                      <td>{reading.label}</td>
                      <td>{reading.value ?? "Not available"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        </>
      ) : (
        <EmptyState
          message="No historical readings yet"
          detail="Recorded AQI history will appear here when available. Use the sample preview to explore the chart."
        />
      )}
    </section>
  );
}