package com.example.demo.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "correlation_reports")
public class CorrelationReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String city;

    private BigDecimal averageAqi;
    private BigDecimal averageSymptomScore;
    private BigDecimal correlationScore;
    private String summary;

    @Column(nullable = false)
    private LocalDateTime generatedAt;

    public CorrelationReport() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
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