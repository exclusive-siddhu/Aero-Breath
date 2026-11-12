package com.example.demo.controller;

import com.example.demo.dto.ObservationDto;
import com.example.demo.service.HealthTrackingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/health")
public class HealthLogController {

    private final HealthTrackingService healthService;

    public HealthLogController(HealthTrackingService healthService) {
        this.healthService = healthService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN', 'CITIZEN', 'SYSTEM_ADMIN', 'ENVIRONMENTAL_OFFICER', 'MEDICAL_RESEARCHER')")
    public ResponseEntity<List<ObservationDto>> getUserHistory() {
        return ResponseEntity.ok(healthService.getUserHistory());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN', 'CITIZEN', 'SYSTEM_ADMIN', 'ENVIRONMENTAL_OFFICER', 'MEDICAL_RESEARCHER')")
    public ResponseEntity<ObservationDto> getObservationById(@PathVariable Long id) {
        return ResponseEntity.ok(healthService.getObservationById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN', 'CITIZEN', 'SYSTEM_ADMIN', 'ENVIRONMENTAL_OFFICER', 'MEDICAL_RESEARCHER')")
    public ResponseEntity<ObservationDto> logHealthObservation(@Valid @RequestBody ObservationDto observationDto) {
        return new ResponseEntity<>(healthService.logHealthObservation(observationDto), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN', 'CITIZEN', 'SYSTEM_ADMIN', 'ENVIRONMENTAL_OFFICER', 'MEDICAL_RESEARCHER')")
    public ResponseEntity<ObservationDto> updateHealthObservation(@PathVariable Long id, @Valid @RequestBody ObservationDto observationDto) {
        return ResponseEntity.ok(healthService.updateHealthObservation(id, observationDto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN', 'CITIZEN', 'SYSTEM_ADMIN', 'ENVIRONMENTAL_OFFICER', 'MEDICAL_RESEARCHER')")
    public ResponseEntity<String> deleteHealthObservation(@PathVariable Long id) {
        healthService.deleteHealthObservation(id);
        return ResponseEntity.ok("Observation deleted successfully.");
    }
}