package com.example.demo.repository;

import com.example.demo.entity.AirQualityMetric;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface AirQualityMetricRepository extends JpaRepository<AirQualityMetric, Long> {
    List<AirQualityMetric> findByStationIdOrderByRecordedAtDesc(Long stationId);

    @Query("SELECT AVG(m.aqiValue) FROM AirQualityMetric m WHERE m.station.city = :city")
    Double calculateAverageAqiForCity(@Param("city") String city);

    List<AirQualityMetric> findByStation_CityIgnoreCaseOrderByRecordedAtDesc(String city);
}