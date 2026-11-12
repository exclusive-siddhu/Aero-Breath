import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Icon from "../common/Icon";
import { finiteNumber } from "../../utils/session";
import { metricService } from "../../services/metricService";

export default function StatCards({
  stations = [],
  latest = null,
  loading = false,
  unavailable = false,
  city = ""
}) {
  const reduxStations = useSelector((state) => state.stations?.items || []);
  const displayStations = stations?.length > 0 ? stations : reduxStations;

  // Find the active city to query (e.g., "cbe")
  const activeCity = city || (displayStations.find(s => s.city)?.city) || "";

  const [fetchedAqi, setFetchedAqi] = useState(null);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    let mounted = true;
    
    // Only fetch if parent didn't provide 'latest' AND we have a valid city
    if (!latest && activeCity) {
      setIsFetching(true);
      metricService.getLatestMetric(activeCity)
        .then(res => {
          if (!mounted) return;
          
          // 🛑 DEBUGGING: Look for this in your browser console!
          console.log(`📊 Fetched Data for ${activeCity}:`, res); 
          
          const payload = res?.data || res;
          if (payload) {
            // Check for aqiValue (Java) or standard aqi
            const rawAqi = payload.aqiValue ?? payload.aqi;
            setFetchedAqi(finiteNumber(rawAqi));
          } else {
            setFetchedAqi(null);
          }
        })
        .catch(err => {
            console.error("Error fetching AQI for StatCards:", err);
            if (mounted) setFetchedAqi(null);
        })
        .finally(() => {
          if (mounted) setIsFetching(false);
        });
    }
    return () => { mounted = false; };
  }, [latest, activeCity]);

  // Determine what to display
  const finalLoading = loading || isFetching;
  let displayAqi = "—";
  
  if (latest) {
      const parentPayload = latest?.data || latest;
      const parentAqi = finiteNumber(parentPayload?.aqiValue ?? parentPayload?.aqi);
      if (parentAqi !== null && parentAqi !== undefined) displayAqi = parentAqi;
  } else if (fetchedAqi !== null && fetchedAqi !== undefined) {
      displayAqi = fetchedAqi;
  }

  const activeCount = displayStations.filter(s => s.status === "ACTIVE").length;
  const alertCount = displayStations.filter(s => (finiteNumber(s.dataCapacity) ?? 0) >= 90).length;

  const stats = [
    {
      label: "TOTAL STATIONS",
      value: unavailable ? "—" : displayStations.length,
      detail: unavailable
        ? "Station data unavailable"
        : `${activeCount} active in your network`,
      icon: "station",
      tone: "teal"
    },
    {
      label: "ACTIVE ALERTS",
      value: unavailable ? "—" : alertCount,
      detail: "Stations at 90% capacity or above",
      icon: "alert",
      tone: "amber"
    },
    {
      label: "CITY AQI",
      value: finalLoading ? "…" : displayAqi,
      detail: activeCity
        ? `Latest reported reading · ${activeCity}`
        : "Set a city to view its latest reading",
      icon: "air",
      tone: "blue"
    }
  ];

  return (
    <div className="stats-grid">
      {stats.map((stat) => (
        <article className="stat-card panel hover-card" key={stat.label}>
          <div className="stat-card-top">
            <span>{stat.label}</span>
            <span className={`icon-tile ${stat.tone}`}>
              <Icon name={stat.icon} />
            </span>
          </div>
          <strong className="stat-value">{stat.value}</strong>
          <p>{stat.detail}</p>
        </article>
      ))}
    </div>
  );
}