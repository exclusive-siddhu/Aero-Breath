package com.example.demo.controller;

import com.example.demo.entity.SensorStation;
import com.example.demo.service.StationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stations")
public class StationController {

    private final StationService stationService;

    public StationController(StationService stationService) {
        this.stationService = stationService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ENVIRONMENTAL_OFFICER', 'CITIZEN', 'SYSTEM_ADMIN', 'MEDICAL_RESEARCHER')")
    public ResponseEntity<List<SensorStation>> getAllStations() {
        return ResponseEntity.ok(stationService.getAllStations());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ENVIRONMENTAL_OFFICER', 'CITIZEN', 'SYSTEM_ADMIN', 'MEDICAL_RESEARCHER')")
    public ResponseEntity<SensorStation> getStationById(@PathVariable Long id) {
        return ResponseEntity.ok(stationService.getStationById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SYSTEM_ADMIN', 'ENVIRONMENTAL_OFFICER')")
    public ResponseEntity<Object> createStation(@Valid @RequestBody SensorStation station) {
        stationService.createStation(station);
        return ResponseEntity.status(HttpStatus.CREATED).body("SensorStation created successfully.");
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SYSTEM_ADMIN', 'ENVIRONMENTAL_OFFICER')")
    public ResponseEntity<Object> updateStation(@PathVariable Long id, @Valid @RequestBody SensorStation details) {
        stationService.updateStation(id, details);
        return ResponseEntity.ok("SensorStation updated successfully.");
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SYSTEM_ADMIN', 'ENVIRONMENTAL_OFFICER')")
    public ResponseEntity<String> deleteStation(@PathVariable Long id) {
        stationService.deleteStation(id);
        return ResponseEntity.ok("SensorStation deleted successfully.");
    }
}