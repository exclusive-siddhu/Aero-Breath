package com.example.demo.repository;

import com.example.demo.entity.HealthObservation;
import com.example.demo.entity.SystemUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;
import java.util.List;

public interface HealthObservationRepository extends JpaRepository<HealthObservation, Long> {
    List<HealthObservation> findByProfileUserOrderByRecordedAtDesc(SystemUser user);

    @Query("SELECT o FROM HealthObservation o WHERE o.profile.user.city = :city AND o.recordedAt >= :since")
    List<HealthObservation> findRecentByCity(@Param("city") String city, @Param("since") LocalDateTime since);

    List<HealthObservation> findByProfile_User_CityIgnoreCase(String city);
}