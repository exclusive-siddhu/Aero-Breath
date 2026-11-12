import React, { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

import {
  setStations,
  removeStation
} from "../../store/slices/stationSlice";

import { stationService } from "../../services/stationService";
import { metricService } from "../../services/metricService";
import { useFetch } from "../../hooks/useFetch";

import {
  asList,
  canManageStations,
  readUser,
  errorMessage
} from "../../utils/session";

import CapacityBar from "../common/CapacityBar";
import Icon from "../common/Icon";
import EmptyState from "../common/EmptyState";
import Loader from "../common/Loader";
import ErrorHandler from "../ErrorHandler";
import MetricDisplay from "./MetricDisplay";
import MetricForm from "./MetricForm";
import StationForm from "./StationForm.jsx";

const EMPTY = [];
const PAGE_SIZE = 6;

function getStationId(station) {
  return station.id ?? station.stationId;
}

function StationMetrics({ city }) {
  const fetchMetric = useCallback(
    () => metricService.getLatestMetric(city),
    [city]
  );

  const { data, loading, error, refetch } = useFetch(fetchMetric);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <ErrorHandler
        message={errorMessage(error)}
        onRetry={refetch}
      />
    );
  }

  if (!data) {
    return (
      <EmptyState
        message="No metric data available"
        detail={`No measurements are available for ${city}.`}
      />
    );
  }

  return <MetricDisplay metric={data} />;
}

export default function StationList({
  isAdmin,
  isEmbedded = false
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const reduxUser = useSelector((state) => state.auth?.user);
  const user = reduxUser || readUser();

  const stations = useSelector(
    (state) => state.stations?.items || EMPTY
  );

  const allowed =
    canManageStations(user?.role) ||
    (isAdmin === true && !user);

  const metricRole = String(user?.role || "").replace(/^ROLE_/, "");

  const canRecordMetrics = [
    "SYSTEM_ADMIN",
    "ENVIRONMENTAL_OFFICER"
  ].includes(metricRole);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [page, setPage] = useState(1);

  const [feedback, setFeedback] = useState(
    location.state?.message || ""
  );

  const [deleteError, setDeleteError] = useState("");
  const [deleting, setDeleting] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const [recordingStation, setRecordingStation] = useState(null);
  const [metricRevision, setMetricRevision] = useState(0);

  const fetchStations = useCallback(
    () => stationService.getAllStations(),
    []
  );

  const { data, loading, error, refetch } = useFetch(fetchStations);

  useEffect(() => {
    if (data !== null && data !== undefined) {
      dispatch(setStations(asList(data)));
    }
  }, [data, dispatch]);

  const filtered = stations.filter((station) => {
    const searchableText = [
      station.stationName || station.name || "",
      station.city || ""
    ]
      .join(" ")
      .toLowerCase();

    const matchesSearch = searchableText.includes(
      search.trim().toLowerCase()
    );

    const matchesStatus =
      filter === "ALL" || station.status === filter;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / PAGE_SIZE)
  );

  const currentPage = Math.min(page, totalPages);

  const visible = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const refresh = () => {
    refetch();
    setMetricRevision((value) => value + 1);
  };

  const handleDelete = async (id) => {
    if (id == null || deleting !== null) return;

    const confirmed = window.confirm(
      "Are you sure you want to decommission this station?"
    );

    if (!confirmed) return;

    const stationKey = String(id);

    setDeleting(stationKey);
    setDeleteError("");
    setFeedback("");

    try {
      await stationService.deleteStation(id);
      dispatch(removeStation(id));

      if (expanded === stationKey) {
        setExpanded(null);
      }

      setFeedback("SensorStation deleted successfully.");
    } catch (err) {
      setDeleteError(errorMessage(err));
    } finally {
      setDeleting(null);
    }
  };

  const handleMetricsSaved = (station) => {
    const id = getStationId(station);

    setRecordingStation(null);

    setFeedback(
      `Measurements saved for ${
        station.stationName ||
        station.name ||
        station.city ||
        "the selected station"
      }.`
    );

    setExpanded(id == null ? null : String(id));
    setMetricRevision((value) => value + 1);

    // The backend also updates capacity when a metric is saved.
    refetch();
  };

  if (showAddForm && allowed) {
    return (
      <StationForm
        onCancel={() => setShowAddForm(false)}
        onSuccess={(_station, message) => {
          setShowAddForm(false);
          setFeedback(message || "Station created successfully.");
          setSearch("");
          setFilter("ALL");
          setPage(1);
          refetch();
        }}
      />
    );
  }

  return (
    <div className="dashboard-root stations-page">
      <header className="page-heading heading-with-actions">
        <div>
          <span className="eyebrow">ENVIRONMENT</span>

          {isEmbedded ? (
            <h2>Air Quality Stations</h2>
          ) : (
            <h1>Air Quality Stations</h1>
          )}

          <p>Your monitoring network, at a glance.</p>
        </div>

        <div className="button-row">
          <button
            className="btn secondary"
            type="button"
            disabled={loading || recordingStation !== null}
            onClick={refresh}
          >
            <Icon name="refresh" size={17} />
            Refresh
          </button>

          {allowed && (
            <button
              type="button"
              className="btn primary"
              disabled={recordingStation !== null}
              onClick={() => {
                setFeedback("");
                setDeleteError("");
                setShowAddForm(true);
              }}
            >
              + Add Station
            </button>
          )}
        </div>
      </header>

      <div className="station-toolbar panel">
        <div className="search-field">
          <Icon name="search" size={18} />

          <input
            aria-label="Search stations"
            placeholder="Search by Station Name"
            value={search}
            disabled={recordingStation !== null}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
          />
        </div>

        <div className="filter-field">
          <label htmlFor="status-filter">Status</label>

          <select
            id="status-filter"
            aria-label="filter"
            value={filter}
            disabled={recordingStation !== null}
            onChange={(event) => {
              setFilter(event.target.value);
              setPage(1);
            }}
          >
            <option value="ALL">ALL</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="MAINTENANCE">MAINTENANCE</option>
            <option value="DECOMMISSIONED">
              DECOMMISSIONED
            </option>
          </select>
        </div>

        <span className="result-count">
          {filtered.length} stations
        </span>
      </div>

      {feedback && (
        <div className="alert-success" role="status">
          {feedback}
        </div>
      )}

      {deleteError && (
        <ErrorHandler message={deleteError} />
      )}

      {error && (
        <ErrorHandler
          message={errorMessage(error)}
          onRetry={refetch}
        />
      )}

      {loading && <Loader />}

      <section
        className="grid-cards-container"
        aria-label="Stations"
      >
        {/* Show the empty state after loading, including on failure. */}
        {!visible.length && !loading ? (
          <EmptyState
            message="No Stations Found"
            detail={
              error
                ? "Stations could not be loaded. Use Retry above."
                : search || filter !== "ALL"
                  ? "Try a different search or status filter."
                  : "Stations will appear here when they are available."
            }
          />
        ) : (
          visible.map((station, index) => {
            const stationId = getStationId(station);

            const stationKey =
              stationId == null
                ? `missing-${currentPage}-${index}`
                : String(stationId);

            const isExpanded = expanded === stationKey;
            const isRecording = recordingStation === stationKey;

            return (
              <article
                className="station-card panel hover-card"
                key={stationKey}
              >
                <div className="station-card-header">
                  <span className="icon-tile">
                    <Icon name="station" />
                  </span>

                  <span
                    className={`badge ${String(
                      station.status || ""
                    ).toLowerCase()}`}
                  >
                    {station.status || "UNKNOWN"}
                  </span>
                </div>

                <h3>
                  {station.stationName ||
                    station.name ||
                    "Unnamed station"}
                </h3>

                <p className="station-city">
                  <Icon name="pin" size={14} />
                  {station.city || "City not supplied"}
                </p>

                {station.dataCapacity != null ? (
                  <CapacityBar capacity={station.dataCapacity} />
                ) : (
                  <p className="muted">
                    Capacity not supplied
                  </p>
                )}

                <div
                  className="station-actions"
                  style={{ flexWrap: "wrap", gap: "8px" }}
                >
                  <button
                    type="button"
                    className="btn secondary small"
                    disabled={!station.city}
                    aria-expanded={isExpanded}
                    onClick={() => {
                      setExpanded((current) =>
                        current === stationKey
                          ? null
                          : stationKey
                      );
                    }}
                  >
                    {isExpanded
                      ? "Hide metrics"
                      : "View metrics"}
                  </button>

                  {canRecordMetrics && (
                    <button
                      type="button"
                      className="btn secondary small"
                      disabled={
                        stationId == null ||
                        recordingStation !== null ||
                        deleting !== null
                      }
                      onClick={() => {
                        setFeedback("");
                        setRecordingStation(stationKey);
                      }}
                    >
                      Record metrics
                    </button>
                  )}

                  {allowed && (
                    <>
                      <button
                        className="btn secondary small"
                        type="button"
                        disabled={
                          stationId == null ||
                          recordingStation !== null ||
                          deleting !== null
                        }
                        onClick={() => {
                          navigate("/add-station", {
                            state: {
                              station,
                              isEdit: true
                            }
                          });
                        }}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="btn danger small"
                        disabled={
                          stationId == null ||
                          deleting !== null ||
                          recordingStation !== null
                        }
                        onClick={() => handleDelete(stationId)}
                      >
                        {deleting === stationKey
                          ? "Deleting…"
                          : "Delete"}
                      </button>
                    </>
                  )}
                </div>

                {canRecordMetrics && isRecording && (
                  <MetricForm
                    key={`form-${stationKey}`}
                    station={station}
                    onCancel={() => setRecordingStation(null)}
                    onSaved={() => handleMetricsSaved(station)}
                  />
                )}

                {isExpanded && station.city && (
                  <StationMetrics
                    key={`${stationKey}-${metricRevision}`}
                    city={station.city}
                  />
                )}
              </article>
            );
          })
        )}
      </section>

      {filtered.length > 0 && (
        <nav
          className="pagination"
          aria-label="Station pagination"
        >
          <span>
            Showing {(currentPage - 1) * PAGE_SIZE + 1}–
            {Math.min(
              currentPage * PAGE_SIZE,
              filtered.length
            )}{" "}
            of {filtered.length}
          </span>

          <div className="button-row">
            <button
              type="button"
              className="btn secondary small"
              disabled={
                currentPage === 1 ||
                recordingStation !== null
              }
              onClick={() => setPage(currentPage - 1)}
            >
              Previous
            </button>

            <span>
              Page {currentPage} of {totalPages}
            </span>

            <button
              type="button"
              className="btn secondary small"
              disabled={
                currentPage === totalPages ||
                recordingStation !== null
              }
              onClick={() => setPage(currentPage + 1)}
            >
              Next
            </button>
          </div>
        </nav>
      )}
    </div>
  );
}