package com.example.demo.repository;

import com.example.demo.entity.CorrelationReport;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CorrelationReportRepository extends JpaRepository<CorrelationReport, Long> {
    List<CorrelationReport> findAllByOrderByGeneratedAtDesc();
}