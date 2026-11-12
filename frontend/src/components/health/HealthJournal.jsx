import React, { useCallback, useState } from "react";
import { healthService } from "../../services/healthService";
import { useFetch } from "../../hooks/useFetch";
import { asList, errorMessage } from "../../utils/session";
import Icon from "../common/Icon";
import Loader from "../common/Loader";
import ErrorHandler from "../ErrorHandler";

export default function HealthJournal() {
  const [symptomScore, setSymptomScore] = useState(1);
  const [conditionType, setConditionType] = useState("NONE");
  const [activityLevel, setActivityLevel] = useState("");
  const [notes, setNotes] = useState("");
  const [savedEntries, setSavedEntries] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchHistory = useCallback(() => healthService.getUserHistory(), []);
  const { data, loading, error: historyError, refetch } = useFetch(fetchHistory);

  const history = [
    ...savedEntries,
    ...asList(data).filter((log) =>
      !savedEntries.some((saved) =>
        saved.id != null && String(saved.id) === String(log.id)
      )
    )
  ];

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (saving) return;

    const score = Number(symptomScore);
    if (
      !Number.isInteger(score) ||
      score < 1 ||
      score > 10 ||
      symptomScore === ""
    ) {
      setError("Symptom score must be a whole number from 1 to 10.");
      return;
    }

    const today = new Date();
    const date = [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, "0"),
      String(today.getDate()).padStart(2, "0")
    ].join("-");

    const observation = {
      symptomScore: score,
      conditionType,
      activityLevel: activityLevel.trim(),
      notes: notes.trim(),
      date
    };

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await healthService.logSymptoms(observation);
      const saved = response?.data ?? response;

      setSavedEntries((entries) => [
        {
          ...observation,
          ...(saved && typeof saved === "object" ? saved : {})
        },
        ...entries
      ]);

      setSymptomScore(1);
      setConditionType("NONE");
      setActivityLevel("");
      setNotes("");
      setSuccess("Health observation saved successfully.");
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="health-dashboard-root">
      <header className="page-heading">
        <span className="eyebrow">PERSONAL HEALTH</span>
        <h1>My Respiratory Journal</h1>
        <p>A little reflection today. A clearer picture over time.</p>
      </header>

      <div className="health-layout">
        <section className="panel">
          <div className="panel-heading">
            <span className="icon-tile"><Icon name="heart" /></span>
            <div>
              <h2>Log Daily Observation</h2>
              <p>How are you feeling today?</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="health-form">
            {error && <div className="alert-error" role="alert">{error}</div>}
            {success && <div className="alert-success" role="status">{success}</div>}

            <div className="field">
              <label htmlFor="symptom-score">Symptom score (1–10)</label>
              <input
                id="symptom-score"
                type="number"
                min="1"
                max="10"
                step="1"
                value={symptomScore}
                onChange={(event) => setSymptomScore(event.target.value)}
                required
              />
              <small>1 is mild; 10 is severe.</small>
            </div>

            <div className="field">
              <label htmlFor="condition-type">Condition Type</label>
              <select
                id="condition-type"
                value={conditionType}
                onChange={(event) => setConditionType(event.target.value)}
              >
                <option value="NONE">NONE</option>
                <option value="ASTHMA">ASTHMA</option>
                <option value="COPD">COPD</option>
                <option value="ALLERGY">ALLERGY</option>
              </select>
            </div>

            <div className="field">
              <label htmlFor="activity-level">Activity Level</label>
              <input
                id="activity-level"
                placeholder="Activity Level"
                value={activityLevel}
                onChange={(event) => setActivityLevel(event.target.value)}
              />
            </div>

            <div className="field">
              <label htmlFor="health-notes">Notes</label>
              <textarea
                id="health-notes"
                placeholder="Any chest tightness, wheezing, or shortness of breath?"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
              />
            </div>

            <button type="submit" className="btn primary wide" disabled={saving}>
              {saving ? "Saving…" : "Submit Log"}
              <Icon name="plus" size={17} />
            </button>
          </form>
        </section>

        <section className="panel history-panel">
          <div className="section-heading">
            <div>
              <h2>Previous Logs</h2>
              <p>Your recorded observations</p>
            </div>
            <span className="badge neutral">
              {historyError && !history.length
                ? "—"
                : `${history.length} ${history.length === 1 ? "entry" : "entries"}`}
            </span>
          </div>

          {historyError && (
            <ErrorHandler message={errorMessage(historyError)} onRetry={refetch} />
          )}
          {loading && <Loader />}

          <div className="table-scroll">
            <table className="glass-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Symptom Score</th>
                  <th>Condition</th>
                  <th>Activity</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {history.length ? history.map((log, index) => (
                  <tr key={log.id ?? index}>
                    <td>{log.date || log.recordedAt || "—"}</td>
                    <td><span className="score-badge">{log.symptomScore ?? "—"}</span></td>
                    <td>{log.conditionType || "NONE"}</td>
                    <td>{log.activityLevel || "—"}</td>
                    <td className="notes-cell">{log.notes || "—"}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="empty-table">
                      {loading
                        ? "Retrieving observations…"
                        : historyError
                          ? "Failed to load observations."
                          : "No health logs found."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}