package com.example.demo.dto;

import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class MetricRequestDto {

    @NotNull(message = "Station id is required")
    private Long stationId;

    @NotNull(message = "AQI value is required")
    private Integer aqiValue;

    private BigDecimal pm25;

    private BigDecimal pm10;

    public MetricRequestDto() {}

    public MetricRequestDto(Long stationId, Integer aqiValue, BigDecimal pm25, BigDecimal pm10) {
        this.stationId = stationId;
        this.aqiValue = aqiValue;
        this.pm25 = pm25;
        this.pm10 = pm10;
    }

    public Long getStationId() { return stationId; }
    public void setStationId(Long stationId) { this.stationId = stationId; }
    public Integer getAqiValue() { return aqiValue; }
    public void setAqiValue(Integer aqiValue) { this.aqiValue = aqiValue; }
    public BigDecimal getPm25() { return pm25; }
    public void setPm25(BigDecimal pm25) { this.pm25 = pm25; }
    public BigDecimal getPm10() { return pm10; }
    public void setPm10(BigDecimal pm10) { this.pm10 = pm10; }
}