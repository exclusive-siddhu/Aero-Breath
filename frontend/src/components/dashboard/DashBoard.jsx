import React, { useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { useFetch } from "../../hooks/useFetch";
import { stationService } from "../../services/stationService";
import { metricService } from "../../services/metricService";

import { setStations } from "../../store/slices/stationSlice";
import { setLatestMetric } from "../../store/slices/metricSlice";

import { asList, errorMessage } from "../../utils/session";

import Icon from "../common/Icon.jsx";
import StatCards from "./StatCards.jsx";
import DomainChart from "./DomainChart.jsx";
import ErrorHandler from "../ErrorHandler.jsx";

const EMPTY = [];

export default function Dashboard({ user, trendsOnly = false }) {
  const dispatch = useDispatch();

  const storedStations = useSelector(
    (state) => state.stations?.items
  );

  const storedHistory = useSelector(
    (state) => state.metrics?.history
  );

  const stations = Array.isArray(storedStations)
    ? storedStations
    : EMPTY;

  const history = Array.isArray(storedHistory)
    ? storedHistory
    : EMPTY;

  const city = typeof user?.city === "string"
    ? user.city.trim()
    : "";

  const loadStations = useCallback(
    () => stationService.getAllStations(),
    []
  );

  const loadMetric = useCallback(
    () =>
      city
        ? metricService.getLatestMetric(city)
        : Promise.resolve(null),
    [city]
  );

  const network = useFetch(loadStations);
  const metric = useFetch(loadMetric);

  useEffect(() => {
    if (network.data !== null && network.data !== undefined) {
      dispatch(setStations(asList(network.data)));
    }
  }, [network.data, dispatch]);

  // Do not display an old metric as current after a failed request.
  const latestMetric =
    city && !metric.loading && !metric.error
      ? metric.data
      : null;

  useEffect(() => {
    dispatch(setLatestMetric(latestMetric));
  }, [latestMetric, dispatch]);

  const refresh = () => {
    network.refetch();
    metric.refetch();
  };

  const pending = network.loading || metric.loading;

  const formattedDate = new Date().toLocaleDateString("en", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric"
  });

  const stationMessage = network.loading
    ? "Loading stations…"
    : network.error
      ? "Station data could not be loaded."
      : "No stations available yet.";

  // Avoid showing cached station rows after a failed refresh.
  const previewStations = network.error
    ? EMPTY
    : stations.slice(0, 4);

  return (
    <div className="dashboard-container">
      <div className="page-kicker">
        <span>
          {trendsOnly ? "AIR QUALITY HISTORY" : "YOUR DAILY OVERVIEW"}
        </span>

        <span>
          <Icon name="clock" size={14} />
          {formattedDate}
        </span>
      </div>

      <header className="page-heading heading-with-actions">
        <div>
          <h1>
            {trendsOnly
              ? "Air quality over time"
              : "Welcome to AeroBreath"}
          </h1>

          <p>
            Understand your air. Stay connected to your health.
          </p>
        </div>

        <button
          type="button"
          className="btn secondary"
          onClick={refresh}
          disabled={pending}
          aria-busy={pending}
        >
          <Icon name="refresh" size={17} />
          {pending ? "Refreshing…" : "Refresh overview"}
        </button>
      </header>

      <div className="overview-location">
        <span>
          <Icon name="pin" size={15} />
          {city || "No city associated with your account"}
        </span>

        <span className="muted">
          Environmental &amp; respiratory health
        </span>
      </div>

      {network.error && (
        <ErrorHandler
          message={`Station network: ${errorMessage(network.error)}`}
          onRetry={network.refetch}
        />
      )}

      {metric.error && city && (
        <ErrorHandler
          message={`City air quality: ${errorMessage(metric.error)}`}
          onRetry={metric.refetch}
        />
      )}

      {/* Render the summary cards only once. */}
      <StatCards
        stations={stations}
        latest={latestMetric}
        loading={network.loading}
        unavailable={Boolean(network.error)}
        city={city}
      />

      <div className={trendsOnly ? "" : "overview-columns"}>
        {/* DomainChart.jsx must contain the chart component. */}
        <DomainChart data={history} />

        {!trendsOnly && (
          <aside className="journal-prompt">
            <div className="prompt-top">
              <span className="eyebrow">
                A MOMENT FOR YOU
              </span>

              <Icon name="heart" size={23} />
            </div>

            <h2>
              How are you
              <br />{" "}
              feeling today?
            </h2>

            <p>
              Small observations help build a better picture of
              your respiratory health.
            </p>

            <div className="breathing-art" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>

            <Link className="btn prompt-button" to="/health">
              <span>Log an observation</span>
              <Icon name="arrow" size={17} />
            </Link>

            <span className="prompt-footnote">
              Your journal. Your perspective.
            </span>
          </aside>
        )}
      </div>

      {!trendsOnly && (
        <section
          className="panel station-preview"
          aria-labelledby="station-preview-title"
        >
          <div className="section-heading">
            <div>
              <h2 id="station-preview-title">
                Your station network
              </h2>

              <p>
                A quick look at your monitoring locations.
              </p>
            </div>

            <Link to="/stations" className="text-link">
              <span>View all stations</span>
              <Icon name="arrow" size={16} />
            </Link>
          </div>

          <div className="table-scroll">
            <table className="glass-table">
              <thead>
                <tr>
                  <th scope="col">Station</th>
                  <th scope="col">Location</th>
                  <th scope="col">Status</th>
                  <th scope="col">Capacity</th>
                </tr>
              </thead>

              <tbody>
                {previewStations.length > 0 ? (
                  previewStations.map((station, index) => (
                    <tr key={station.id ?? index}>
                      <td className="strong-cell">
                        {station.stationName ||
                          station.name ||
                          "Unnamed station"}
                      </td>

                      <td>{station.city || "—"}</td>

                      <td>
                        <span
                          className={`badge ${String(
                            station.status || "unknown"
                          ).toLowerCase()}`}
                        >
                          {station.status || "UNKNOWN"}
                        </span>
                      </td>

                      <td>
                        {station.dataCapacity != null
                          ? `${station.dataCapacity}%`
                          : "—"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="empty-table">
                      {stationMessage}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <footer className="workspace-footer">
        <span>AeroBreath · Connected observations</span>
        <span>Environment. Health. Perspective.</span>
      </footer>
    </div>
  );
}