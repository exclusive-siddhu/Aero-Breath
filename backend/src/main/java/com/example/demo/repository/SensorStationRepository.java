package com.example.demo.repository;

import com.example.demo.entity.SensorStation;
import com.example.demo.entity.StationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface SensorStationRepository extends JpaRepository<SensorStation, Long> {
    List<SensorStation> findByCityAndStatus(String city, StationStatus status);

    @Query("SELECT s FROM SensorStation s WHERE s.dataCapacity > :minCapacity")
    List<SensorStation> findByHighCapacity(@Param("minCapacity") int minCapacity);
}