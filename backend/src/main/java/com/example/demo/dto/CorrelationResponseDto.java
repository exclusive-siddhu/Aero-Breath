package com.example.demo.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class CorrelationResponseDto {

    private String city;
    private BigDecimal averageAqi;
    private BigDecimal averageSymptomScore;
    private BigDecimal correlationScore;
    private String summary;
    private LocalDateTime generatedAt;

    public CorrelationResponseDto() {}

    public CorrelationResponseDto(String city, BigDecimal averageAqi, BigDecimal averageSymptomScore,
                                   BigDecimal correlationScore, String summary, LocalDateTime generatedAt) {
        this.city = city;
        this.averageAqi = averageAqi;
        this.averageSymptomScore = averageSymptomScore;
        this.correlationScore = correlationScore;
        this.summary = summary;
        this.generatedAt = generatedAt;
    }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public BigDecimal getAverageAqi() { return averageAqi; }
    public void setAverageAqi(BigDecimal averageAqi) { this.averageAqi = averageAqi; }
    public BigDecimal getAverageSymptomScore() { return averageSymptomScore; }
    public void setAverageSymptomScore(BigDecimal averageSymptomScore) { this.averageSymptomScore = averageSymptomScore; }
    public BigDecimal getCorrelationScore() { return correlationScore; }
    public void setCorrelationScore(BigDecimal correlationScore) { this.correlationScore = correlationScore; }
    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }
    public LocalDateTime getGeneratedAt() { return generatedAt; }
    public void setGeneratedAt(LocalDateTime generatedAt) { this.generatedAt = generatedAt; }
}