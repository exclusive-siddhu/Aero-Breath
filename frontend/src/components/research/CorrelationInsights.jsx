import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const sampleAnalyticalReports = [
    {
        reportPeriod: 'Q3 2026 (Aug - Sep)',
        avgAqi: '58 (Moderate)',
        healthImpact: '+18% Asthma Inhaler Usage',
        riskLevel: 'MODERATE',
        findings: 'Concentrated PM2.5 emissions in heavy transit corridors correlate with heightened evening bronchospasm reports.'
    },
    {
        reportPeriod: 'Q2 2026 (May - Jul)',
        avgAqi: '36 (Good)',
        healthImpact: '-14% Acute Exacerbations',
        riskLevel: 'LOW',
        findings: 'Elevated precipitation and vegetative air filtration lowered particulate density, stabilizing chronic respiratory cohorts.'
    },
    {
        reportPeriod: 'Q1 2026 (Jan - Apr)',
        avgAqi: '112 (Unhealthy)',
        healthImpact: '+42% Pulmonary Clinic Visits',
        riskLevel: 'HIGH',
        findings: 'Prolonged atmospheric thermal inversion trapped particulate mass, triggering sharp spikes in citizen symptom scoring.'
    }
];

const CorrelationInsights = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchInsights();
    }, []);

    const fetchInsights = async () => {
        setLoading(true);
        try {
            const response = await api.get('/api/insights/correlation');
            const data = response?.data || response;
            if (Array.isArray(data) && data.length > 0) {
                setReports(data);
            }
        } catch (err) {
            console.warn('Failed to fetch correlation insights from API (using state):', err);
        } finally {
            setLoading(false);
        }
    };

    const handleLoadSample = () => {
        setReports(sampleAnalyticalReports);
    };

    const getRiskBadgeStyle = (level) => {
        const l = (level || '').toUpperCase();
        if (l.includes('HIGH') || l.includes('CRITICAL')) {
            return { background: 'rgba(239, 68, 68, 0.15)', color: '#b91c1c', border: '1px solid rgba(239, 68, 68, 0.4)' };
        }
        if (l.includes('MODERATE')) {
            return { background: 'rgba(245, 158, 11, 0.15)', color: '#b45309', border: '1px solid rgba(245, 158, 11, 0.4)' };
        }
        return { background: 'rgba(34, 197, 94, 0.15)', color: '#15803d', border: '1px solid rgba(34, 197, 94, 0.4)' };
    };

    return (
        <div style={{ padding: '10px 0', boxSizing: 'border-box' }}>
            <div className="glass-panel" style={{ padding: '32px 36px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
                    <div>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                            <span style={{ fontSize: '20px' }}>🔬</span>
                            <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 800, color: 'var(--text-main, #1e293b)', letterSpacing: '-0.02em' }}>
                                Cross-Domain Health Insights
                            </h2>
                        </div>
                        <p style={{ margin: 0, color: 'var(--text-muted, #64748b)', fontSize: '14px', lineHeight: 1.5 }}>
                            Displays analytical data tables comparing air quality metrics with health outcomes.
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                        {reports.length === 0 && (
                            <button
                                onClick={handleLoadSample}
                                className="glass-btn"
                                style={{
                                    fontSize: '13px',
                                    padding: '9px 16px',
                                    background: 'rgba(255, 255, 255, 0.6)',
                                    border: '1px solid rgba(255, 255, 255, 0.9)',
                                    color: 'var(--accent-color, #3b82f6)',
                                    borderRadius: '12px',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)'
                                }}
                            >
                                📊 Load Analytics Sample
                            </button>
                        )}
                        <button
                            onClick={fetchInsights}
                            className="glass-btn secondary"
                            style={{
                                fontSize: '13px',
                                padding: '9px 16px',
                                background: 'rgba(255, 255, 255, 0.6)',
                                border: '1px solid rgba(255, 255, 255, 0.9)',
                                color: 'var(--text-main, #1e293b)',
                                borderRadius: '12px',
                                fontWeight: 700,
                                cursor: 'pointer',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)'
                            }}
                        >
                            {loading ? 'Refreshing...' : '🔄 Refresh API'}
                        </button>
                    </div>
                </div>

                {/* Analytical KPIs Summary Bar */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '16px',
                    marginBottom: '28px'
                }}>
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.5)',
                        border: '1px solid rgba(255, 255, 255, 0.8)',
                        borderRadius: '16px',
                        padding: '18px 20px',
                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.03)'
                    }}>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted, #64748b)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>Correlation Index</span>
                        <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--accent-color, #3b82f6)', marginTop: '4px' }}>r = 0.82 (Strong)</div>
                    </div>
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.5)',
                        border: '1px solid rgba(255, 255, 255, 0.8)',
                        borderRadius: '16px',
                        padding: '18px 20px',
                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.03)'
                    }}>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted, #64748b)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>Primary Stressor</span>
                        <div style={{ fontSize: '20px', fontWeight: 800, color: '#b45309', marginTop: '4px' }}>PM2.5 Micro-particles</div>
                    </div>
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.5)',
                        border: '1px solid rgba(255, 255, 255, 0.8)',
                        borderRadius: '16px',
                        padding: '18px 20px',
                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.03)'
                    }}>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted, #64748b)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>Patient Cohort</span>
                        <div style={{ fontSize: '20px', fontWeight: 800, color: '#15803d', marginTop: '4px' }}>Asthma &amp; COPD</div>
                    </div>
                </div>

                <div className="glass-table-container">
                    <table 
                        className="glass-table"
                        style={{ 
                            width: '100%', 
                            borderCollapse: 'collapse'
                        }}
                    >
                        <thead>
                            <tr>
                                <th style={{ padding: '14px 18px', textAlign: 'left' }}>Report Period</th>
                                <th style={{ padding: '14px 18px', textAlign: 'left' }}>Avg AQI</th>
                                <th style={{ padding: '14px 18px', textAlign: 'left' }}>Health Impact</th>
                                <th style={{ padding: '14px 18px', textAlign: 'left' }}>Risk Level</th>
                                <th style={{ padding: '14px 18px', textAlign: 'left' }}>Findings</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reports.length > 0 ? (
                                reports.map((report, index) => {
                                    const period = report.reportPeriod || report.city || 'Regional Node';
                                    const avgAqi = report.avgAqi || (report.averageAqi !== undefined ? `${report.averageAqi} AQI` : 'N/A');
                                    const impact = report.healthImpact || (report.averageSymptomScore !== undefined ? `Symptom Score: ${report.averageSymptomScore}` : 'Nominal');
                                    const risk = report.riskLevel || (report.correlationScore !== undefined ? (Number(report.correlationScore) > 0.7 ? 'HIGH' : Number(report.correlationScore) > 0.4 ? 'MODERATE' : 'LOW') : 'LOW');
                                    const findings = report.findings || report.summary || 'Telemetry analysis complete.';
                                    return (
                                        <tr key={index} style={{ transition: 'background 0.2s' }}>
                                            <td style={{ padding: '14px 18px', fontWeight: 600, color: 'var(--text-main, #1e293b)' }}>
                                                {period}
                                            </td>
                                            <td style={{ padding: '14px 18px', color: 'var(--accent-color, #3b82f6)', fontWeight: 700 }}>
                                                {avgAqi}
                                            </td>
                                            <td style={{ padding: '14px 18px', color: 'var(--text-muted, #64748b)' }}>
                                                {impact}
                                            </td>
                                            <td style={{ padding: '14px 18px' }}>
                                                <span 
                                                    className="badge-pill"
                                                    style={{ ...getRiskBadgeStyle(risk), display: 'inline-block' }}
                                                >
                                                    {risk}
                                                </span>
                                            </td>
                                            <td style={{ padding: '14px 18px', color: 'var(--text-muted, #64748b)', fontSize: '13.5px', maxWidth: '420px', lineHeight: 1.5 }}>
                                                {findings}
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td 
                                        colSpan="5" 
                                        style={{ 
                                             textAlign: 'center', 
                                             padding: '40px 20px', 
                                             color: 'var(--text-muted, #64748b)',
                                             fontStyle: 'italic'
                                        }}
                                    >
                                        No correlation reports available.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CorrelationInsights;