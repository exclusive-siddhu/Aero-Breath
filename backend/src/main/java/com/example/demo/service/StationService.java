package com.example.demo.service;

import com.example.demo.exception.SensorStationNotFoundException;
import com.example.demo.entity.SensorStation;
import com.example.demo.repository.SensorStationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class StationService {

    private final SensorStationRepository stationRepository;

    public StationService(SensorStationRepository stationRepository) {
        this.stationRepository = stationRepository;
    }

    @Transactional(readOnly = true)
    public List<SensorStation> getAllStations() {
        return stationRepository.findAll();
    }

    @Transactional(readOnly = true)
    public SensorStation getStationById(Long id) {
        return stationRepository.findById(id)
                .orElseThrow(() -> new SensorStationNotFoundException("Sensor station not found with id: " + id));
    }

    @Transactional
    public SensorStation createStation(SensorStation station) {
        return stationRepository.save(station);
    }

    @Transactional
    public SensorStation updateStation(Long id, SensorStation details) {
        SensorStation station = stationRepository.findById(id)
                .orElseThrow(() -> new SensorStationNotFoundException("Sensor station not found with id: " + id));

        station.setStationName(details.getStationName());
        station.setCity(details.getCity());
        station.setLatitude(details.getLatitude());
        station.setLongitude(details.getLongitude());
        station.setStatus(details.getStatus());
        station.setDataCapacity(details.getDataCapacity());
        station.setOfficer(details.getOfficer());

        return stationRepository.save(station);
    }

    @Transactional
    public String deleteStation(Long id) {
        if (!stationRepository.existsById(id)) {
            throw new SensorStationNotFoundException("Sensor station not found with id: " + id);
        }
        stationRepository.deleteById(id);
        return "SensorStation deleted successfully.";
    }
}