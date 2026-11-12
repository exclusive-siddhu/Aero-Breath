package com.example.demo.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "air_quality_metrics")
public class AirQualityMetric {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Integer aqiValue;

    private BigDecimal pm25;
    private BigDecimal pm10;

    @Column(nullable = false)
    private LocalDateTime recordedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "station_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "metrics"})
    private SensorStation station;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Integer getAqiValue() { return aqiValue; }
    public void setAqiValue(Integer aqiValue) { this.aqiValue = aqiValue; }
    public BigDecimal getPm25() { return pm25; }
    public void setPm25(BigDecimal pm25) { this.pm25 = pm25; }
    public BigDecimal getPm10() { return pm10; }
    public void setPm10(BigDecimal pm10) { this.pm10 = pm10; }
    public LocalDateTime getRecordedAt() { return recordedAt; }
    public void setRecordedAt(LocalDateTime recordedAt) { this.recordedAt = recordedAt; }
    public SensorStation getStation() { return station; }
    public void setStation(SensorStation station) { this.station = station; }
}