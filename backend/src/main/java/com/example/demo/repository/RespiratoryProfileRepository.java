package com.example.demo.repository;

import com.example.demo.entity.RespiratoryProfile;
import com.example.demo.entity.SystemUser;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RespiratoryProfileRepository extends JpaRepository<RespiratoryProfile, Long> {
    Optional<RespiratoryProfile> findByUser(SystemUser user);
}