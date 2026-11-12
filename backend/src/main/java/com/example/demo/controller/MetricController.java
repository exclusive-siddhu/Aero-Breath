package com.example.demo.controller;

import com.example.demo.dto.MetricRequestDto;
import com.example.demo.entity.AirQualityMetric;
import com.example.demo.service.MetricProcessorService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/metrics")
public class MetricController {

    private final MetricProcessorService metricService;

    public MetricController(MetricProcessorService metricService) {
        this.metricService = metricService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('SYSTEM_ADMIN','ENVIRONMENTAL_OFFICER')")
    public ResponseEntity<List<AirQualityMetric>> getAllMetrics() {
        return ResponseEntity.ok(metricService.getAllMetrics());
    }

    @GetMapping("/latest/{city}")
    public ResponseEntity<AirQualityMetric> getLatestMetric(@PathVariable String city) {
        AirQualityMetric metric = metricService.getLatestMetricForCity(city);
        return ResponseEntity.ok(metric);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SYSTEM_ADMIN','ENVIRONMENTAL_OFFICER')")
    public ResponseEntity<MetricRequestDto> addMetric(
            @RequestBody MetricRequestDto metricDto) {

        MetricRequestDto savedMetric = metricService.recordMetric(metricDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedMetric);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SYSTEM_ADMIN','ENVIRONMENTAL_OFFICER')")
    public ResponseEntity<String> deleteMetric(@PathVariable Long id) {
        metricService.deleteMetric(id);
        return ResponseEntity.ok("AirQualityMetric deleted successfully.");
    }
}
