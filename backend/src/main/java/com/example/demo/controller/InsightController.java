package com.example.demo.controller;

import com.example.demo.dto.CorrelationResponseDto;
import com.example.demo.entity.CorrelationReport;
import com.example.demo.service.CorrelationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/insights")
public class InsightController {

    private final CorrelationService correlationService;

    public InsightController(CorrelationService correlationService) {
        this.correlationService = correlationService;
    }

    @GetMapping("/correlation")
    @PreAuthorize("hasAnyRole('MEDICAL_RESEARCHER','SYSTEM_ADMIN')")
    public ResponseEntity<List<CorrelationResponseDto>> getAllCorrelations() {
        return ResponseEntity.ok(correlationService.getAllCorrelations());
    }

    @GetMapping("/correlation/{city}")
    @PreAuthorize("hasAnyRole('MEDICAL_RESEARCHER','SYSTEM_ADMIN')")
    public ResponseEntity<CorrelationReport> getCorrelationByCity(@PathVariable String city) {
        return ResponseEntity.ok(correlationService.analyzeCityCorrelations(city));
    }
}
