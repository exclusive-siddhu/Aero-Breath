package com.example.demo.service;

import com.example.demo.dto.CorrelationResponseDto;
import com.example.demo.entity.AirQualityMetric;
import com.example.demo.entity.CorrelationReport;
import com.example.demo.entity.HealthObservation;
import com.example.demo.repository.AirQualityMetricRepository;
import com.example.demo.repository.CorrelationReportRepository;
import com.example.demo.repository.HealthObservationRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CorrelationService {

    private final AirQualityMetricRepository airQualityMetricRepository;
    private final HealthObservationRepository healthObservationRepository;
    private final CorrelationReportRepository correlationReportRepository;

    public CorrelationService(AirQualityMetricRepository airQualityMetricRepository,
                               HealthObservationRepository healthObservationRepository,
                               CorrelationReportRepository correlationReportRepository) {
        this.airQualityMetricRepository = airQualityMetricRepository;
        this.healthObservationRepository = healthObservationRepository;
        this.correlationReportRepository = correlationReportRepository;
    }

    public List<CorrelationResponseDto> getAllCorrelations() {
        return correlationReportRepository.findAllByOrderByGeneratedAtDesc().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public CorrelationReport analyzeCityCorrelations(String city) {
        List<AirQualityMetric> metrics = airQualityMetricRepository
                .findByStation_CityIgnoreCaseOrderByRecordedAtDesc(city);
        List<HealthObservation> observations = healthObservationRepository
                .findByProfile_User_CityIgnoreCase(city);

        BigDecimal avgAqi = average(metrics.stream().map(m -> BigDecimal.valueOf(m.getAqiValue())).collect(Collectors.toList()));
        BigDecimal avgSymptom = average(observations.stream().map(o -> BigDecimal.valueOf(o.getSymptomScore())).collect(Collectors.toList()));
        BigDecimal correlationScore = computeCorrelationScore(avgAqi, avgSymptom);
        String summary = "Correlation report for " + city + ": average AQI " + avgAqi
                + " vs average symptom score " + avgSymptom + " (index " + correlationScore + ").";

        CorrelationReport report = new CorrelationReport();
        report.setCity(city);
        report.setAverageAqi(avgAqi);
        report.setAverageSymptomScore(avgSymptom);
        report.setCorrelationScore(correlationScore);
        report.setSummary(summary);
        report.setGeneratedAt(LocalDateTime.now());

        return correlationReportRepository.save(report);
    }

    private BigDecimal average(List<BigDecimal> values) {
        if (values.isEmpty()) return BigDecimal.ZERO;
        BigDecimal sum = values.stream().reduce(BigDecimal.ZERO, BigDecimal::add);
        return sum.divide(BigDecimal.valueOf(values.size()), 2, RoundingMode.HALF_UP);
    }

    private BigDecimal computeCorrelationScore(BigDecimal avgAqi, BigDecimal avgSymptom) {
        if (avgAqi.compareTo(BigDecimal.ZERO) == 0 || avgSymptom.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }
        BigDecimal raw = avgSymptom.multiply(BigDecimal.TEN).divide(avgAqi, 4, RoundingMode.HALF_UP);
        return raw.min(BigDecimal.ONE).setScale(2, RoundingMode.HALF_UP);
    }

    private CorrelationResponseDto toDto(CorrelationReport report) {
        return new CorrelationResponseDto(
                report.getCity(),
                report.getAverageAqi(),
                report.getAverageSymptomScore(),
                report.getCorrelationScore(),
                report.getSummary(),
                report.getGeneratedAt()
        );
    }
}