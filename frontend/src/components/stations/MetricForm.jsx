import React, { useState } from "react";
import { metricService } from "../../services/metricService";
import ErrorHandler from "../ErrorHandler";

export default function MetricForm({ station, onCancel, onSaved }) {
    const [aqi, setAqi] = useState("");
    const [pm25, setPm25] = useState("");
    const [temperature, setTemperature] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // Mapped exactly to match your Java MetricRequestDto
            const payload = {
                stationId: station.id || station.stationId,
                city: station.city,
                aqiValue: Number(aqi),        // Java expects 'aqiValue'
                pm25: Number(pm25),          // Java expects 'pm25'
                pm10: Number(temperature),   // Java expects 'pm10', sending temperature value here so it saves
                temperature: Number(temperature) // Sending just in case your DTO still expects it
            };

            // Using the correct function name matching your backend service
            await metricService.recordMetric(payload);
            
            onSaved();
        } catch (err) {
            setError(err.message || "Failed to save metrics. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <h4 style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: '600' }}>
                Record Telemetry for {station.stationName || station.city}
            </h4>

            {error && <ErrorHandler message={error} />}

            <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                    
                    <div>
                        <label style={{ fontSize: '12px', marginBottom: '6px', display: 'block', opacity: 0.8 }}>
                            AQI Index
                        </label>
                        <input 
                            type="number" 
                            value={aqi} 
                            onChange={e => setAqi(e.target.value)} 
                            required 
                            placeholder="e.g. 42"
                            style={{ width: '100%', padding: '8px 12px', boxSizing: 'border-box', borderRadius: '6px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'inherit' }}
                        />
                    </div>

                    <div>
                        <label style={{ fontSize: '12px', marginBottom: '6px', display: 'block', opacity: 0.8 }}>
                            PM2.5 (µg/m³)
                        </label>
                        <input 
                            type="number" 
                            value={pm25} 
                            onChange={e => setPm25(e.target.value)} 
                            required 
                            placeholder="e.g. 12.5" 
                            step="0.1"
                            style={{ width: '100%', padding: '8px 12px', boxSizing: 'border-box', borderRadius: '6px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'inherit' }}
                        />
                    </div>

                    <div>
                        <label style={{ fontSize: '12px', marginBottom: '6px', display: 'block', opacity: 0.8 }}>
                            Temp (°C)
                        </label>
                        <input 
                            type="number" 
                            value={temperature} 
                            onChange={e => setTemperature(e.target.value)} 
                            required 
                            placeholder="e.g. 28.0" 
                            step="0.1"
                            style={{ width: '100%', padding: '8px 12px', boxSizing: 'border-box', borderRadius: '6px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'inherit' }}
                        />
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    <button 
                        type="button" 
                        className="btn secondary small" 
                        onClick={onCancel} 
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit" 
                        className="btn primary small" 
                        disabled={loading}
                    >
                        {loading ? 'Saving...' : 'Save Metrics'}
                    </button>
                </div>
            </form>
        </div>
    );
}