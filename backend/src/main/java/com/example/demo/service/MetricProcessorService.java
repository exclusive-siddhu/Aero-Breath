package com.example.demo.service;

import com.example.demo.dto.MetricDto;
import com.example.demo.dto.MetricRequestDto;
import com.example.demo.entity.AirQualityMetric;
import com.example.demo.entity.SensorStation;
import com.example.demo.exception.SensorStationNotFoundException;
import com.example.demo.repository.AirQualityMetricRepository;
import com.example.demo.repository.SensorStationRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MetricProcessorService {

    private final AirQualityMetricRepository metricRepository;
    private final SensorStationRepository stationRepository;

    public MetricProcessorService(AirQualityMetricRepository metricRepository, SensorStationRepository stationRepository) {
        this.metricRepository = metricRepository;
        this.stationRepository = stationRepository;
    }

    public AirQualityMetric recordMetric(Long stationId, MetricDto dto) {
        SensorStation station = stationRepository.findById(stationId)
                .orElseThrow(() -> new SensorStationNotFoundException("SensorStation not found with id: " + stationId));

        AirQualityMetric metric = new AirQualityMetric();
        metric.setStation(station);
        metric.setAqiValue(dto.getAqiValue());
        metric.setPm25(dto.getPm25());
        metric.setPm10(dto.getPm10());
        metric.setRecordedAt(LocalDateTime.now());

        AirQualityMetric saved = metricRepository.save(metric);

        if (station.getDataCapacity() != null) {
            station.setDataCapacity(Math.min(100, station.getDataCapacity() + 1));
            stationRepository.save(station);
        }

        return saved;
    }

    public MetricRequestDto recordMetric(MetricRequestDto metricDto) {
        if (metricDto.getStationId() != null) {
            SensorStation station = stationRepository.findById(metricDto.getStationId())
                    .orElseThrow(() -> new SensorStationNotFoundException("SensorStation not found with id: " + metricDto.getStationId()));

            AirQualityMetric metric = new AirQualityMetric();
            metric.setStation(station);
            metric.setAqiValue(metricDto.getAqiValue());
            metric.setPm25(metricDto.getPm25());
            metric.setPm10(metricDto.getPm10());
            metric.setRecordedAt(LocalDateTime.now());

            metricRepository.save(metric);

            if (station.getDataCapacity() != null) {
                station.setDataCapacity(Math.min(100, station.getDataCapacity() + 1));
                stationRepository.save(station);
            }
        }
        return metricDto;
    }

    public List<AirQualityMetric> getAllMetrics() {
        return metricRepository.findAll();
    }

    public AirQualityMetric getMetricById(Long id) {
        return metricRepository.findById(id).orElse(null);
    }

    public AirQualityMetric getLatestMetricForCity(String city) {
        List<AirQualityMetric> metrics = metricRepository.findByStation_CityIgnoreCaseOrderByRecordedAtDesc(city);
        return metrics.isEmpty() ? null : metrics.get(0);
    }

    public void deleteMetric(Long id) {
        if (metricRepository.existsById(id)) {
            metricRepository.deleteById(id);
        }
    }
}
