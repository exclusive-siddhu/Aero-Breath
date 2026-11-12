import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { stationService } from "../../services/stationService";
import { addStation } from "../../store/slices/stationSlice";
import { errorMessage } from "../../utils/session";
import Icon from "../common/Icon";

function initialValues(station) {
  return {
    stationId: station?.id ?? station?.stationId ?? "",
    stationName: station?.stationName || station?.name || "",
    city: station?.city || "",
    status: station?.status || "ACTIVE",
    dataCapacity: station?.dataCapacity ?? 0
  };
}

// Reusable form for both creating and editing stations.
// It does not require Redux or Router providers.
export default function StationForm({
  editStation = null,
  onSuccess,
  onCancel
}) {
  const isEdit = Boolean(editStation);

  const [form, setForm] = useState(() =>
    initialValues(editStation)
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const nameRef = useRef(null);
  const submittingRef = useRef(false);

  useEffect(() => {
    setForm(initialValues(editStation));
    setError("");
    setMessage("");

    if (editStation) {
      nameRef.current?.focus();
    }
  }, [editStation]);

  const change = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value
    }));

    setMessage("");
  };

  const resetForm = () => {
    setForm(initialValues(editStation));
    setError("");
    setMessage("");
  };

  const submit = async (event) => {
    event.preventDefault();

    if (submittingRef.current) return;

    const stationName = form.stationName.trim();
    const city = form.city.trim();
    const capacity = Number(form.dataCapacity);

    if (
      !stationName ||
      !city ||
      String(form.dataCapacity).trim() === "" ||
      !Number.isFinite(capacity) ||
      capacity < 0 ||
      capacity > 100
    ) {
      setError(
        "Enter a station name, city, and capacity from 0 to 100."
      );
      return;
    }

    const stationId =
      editStation?.id ?? editStation?.stationId;

    if (
      isEdit &&
      (stationId === undefined ||
        stationId === null ||
        stationId === "")
    ) {
      setError(
        "The existing station ID is missing. Return to the station list and select Edit again."
      );
      return;
    }

    const payload = {
      stationName,
      city,
      status: form.status,
      dataCapacity: capacity
    };

    // Preserve the existing identity when editing.
    // For creation, let the backend generate the ID.
    if (isEdit) {
      payload.id = stationId;

      if (editStation.version != null) {
        payload.version = editStation.version;
      }
    }

    submittingRef.current = true;
    setLoading(true);
    setError("");
    setMessage("");

    let savedStation;

    try {
      const response = isEdit
        ? await stationService.updateStation(stationId, payload)
        : await stationService.createStation(payload);

      const saved = response?.data ?? response;

      savedStation = {
        ...payload,
        ...(saved &&
        typeof saved === "object" &&
        !Array.isArray(saved)
          ? saved
          : {})
      };
    } catch (err) {
      setError(errorMessage(err));
      return;
    } finally {
      submittingRef.current = false;
      setLoading(false);
    }

    const successMessage = isEdit
      ? "Station updated successfully."
      : "Station created successfully.";

    if (!isEdit) {
      setForm(initialValues(null));
    }

    setMessage(successMessage);
    onSuccess?.(savedStation, successMessage);
  };

  return (
    <div className="form-page">
      <header className="page-heading">
        <span className="eyebrow">STATION MANAGEMENT</span>

        <h1>
          {isEdit
            ? "Update monitoring station"
            : "Add a monitoring station"}
        </h1>

        <p>
          {isEdit
            ? "Update the details of your existing monitoring station."
            : "Keep your station network organised and up to date."}
        </p>
      </header>

      <section className="panel form-panel">
        <div className="panel-heading">
          <span className="icon-tile">
            <Icon name="station" />
          </span>

          <div>
            <h2>
              {isEdit
                ? "Station configuration"
                : "Station registration"}
            </h2>

            <p>Fields marked with * are required.</p>
          </div>
        </div>

        <form
          className="form-grid"
          onSubmit={submit}
          onReset={resetForm}
        >
          {error && (
            <div className="alert-error full" role="alert">
              {error}
            </div>
          )}

          {message && (
            <div className="alert-success full" role="status">
              {message}
            </div>
          )}

          <div className="field">
            <label htmlFor="stationId">Registration ID</label>

            <input
              id="stationId"
              name="stationId"
              placeholder="Registration ID"
              value={form.stationId}
              readOnly
              aria-describedby="registration-help"
            />

            <small id="registration-help">
              {isEdit
                ? "This identifies the existing station and cannot be changed."
                : "Generated automatically when the station is saved."}
            </small>
          </div>

          <div className="field">
            <label htmlFor="stationName">Station Name *</label>

            <input
              ref={nameRef}
              id="stationName"
              name="stationName"
              placeholder="Station Name (e.g., Alpha Node)"
              value={form.stationName}
              onChange={change}
              disabled={loading}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="city">City / Location *</label>

            <input
              id="city"
              name="city"
              placeholder="City / Location (e.g., Downtown)"
              value={form.city}
              onChange={change}
              disabled={loading}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="status">Condition / Status</label>

            <select
              id="status"
              name="status"
              value={form.status}
              onChange={change}
              disabled={loading}
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="MAINTENANCE">MAINTENANCE</option>
              <option value="DECOMMISSIONED">
                DECOMMISSIONED
              </option>
            </select>
          </div>

          <div className="field full">
            <label htmlFor="capacity">Data capacity (%) *</label>

            <input
              id="capacity"
              name="dataCapacity"
              type="number"
              min="0"
              max="100"
              step="any"
              value={form.dataCapacity}
              onChange={change}
              disabled={loading}
              required
            />

            <small>
              Enter a capacity between 0 and 100.
              Air quality measurements are recorded separately.
            </small>
          </div>

          <div className="form-actions full">
            <button
              type="button"
              className="btn secondary"
              disabled={loading}
              onClick={() => {
                resetForm();
                onCancel?.();
              }}
            >
              Cancel
            </button>

            <button
              type="reset"
              className="btn secondary"
              disabled={loading}
            >
              Reset
            </button>

            <button
              type="submit"
              className="btn primary"
              disabled={loading}
              aria-busy={loading}
            >
              {loading
                ? "Saving…"
                : isEdit
                  ? "Update"
                  : "Submit"}

              <Icon name="check" size={17} />
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

// Used by App.js for the /add-station route.
// Reads the existing station supplied by the Edit button.
export function StationFormPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const editStation = location.state?.station ?? null;

  const requestedEdit =
    location.state?.isEdit === true || editStation !== null;

  const stationId =
    editStation?.id ?? editStation?.stationId;

  // Never turn an incomplete edit request into a create request.
  if (
    requestedEdit &&
    (!editStation || stationId == null || stationId === "")
  ) {
    return (
      <div className="form-page">
        <section className="panel form-panel">
          <h1>Unable to edit this station</h1>

          <p role="alert">
            The existing station details or registration ID are
            missing. Return to the station list and select Edit
            again.
          </p>

          <button
            type="button"
            className="btn secondary"
            onClick={() => navigate("/stations")}
          >
            Back to stations
          </button>
        </section>
      </div>
    );
  }

  const handleSuccess = (station, message) => {
    const savedId =
      station.id ?? station.stationId ?? stationId;

    if (savedId != null) {
      dispatch(
        addStation({
          ...station,
          id: savedId
        })
      );
    }

    navigate("/stations", {
      replace: true,
      state: { message }
    });
  };

  return (
    <StationForm
      key={requestedEdit ? `edit-${stationId}` : "create"}
      editStation={editStation}
      onSuccess={handleSuccess}
      onCancel={() => navigate("/stations")}
    />
  );
}