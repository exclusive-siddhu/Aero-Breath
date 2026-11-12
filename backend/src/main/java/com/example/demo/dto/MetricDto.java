package com.example.demo.dto;

import java.math.BigDecimal;

public class MetricDto extends MetricRequestDto {
    public MetricDto() {
        super();
    }

    public MetricDto(Long stationId, Integer aqiValue, BigDecimal pm25, BigDecimal pm10) {
        super(stationId, aqiValue, pm25, pm10);
    }
}
