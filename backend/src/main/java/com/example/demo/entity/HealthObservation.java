package com.example.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "health_observations")
public class HealthObservation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer symptomScore;

    @Column(length = 500)
    private String notes;

    private String activityLevel;

    private LocalDateTime recordedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "profile_id", nullable = false)
    private RespiratoryProfile profile;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Integer getSymptomScore() { return symptomScore; }
    public void setSymptomScore(Integer symptomScore) { this.symptomScore = symptomScore; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public String getActivityLevel() { return activityLevel; }
    public void setActivityLevel(String activityLevel) { this.activityLevel = activityLevel; }
    public LocalDateTime getRecordedAt() { return recordedAt; }
    public void setRecordedAt(LocalDateTime recordedAt) { this.recordedAt = recordedAt; }
    public RespiratoryProfile getProfile() { return profile; }
    public void setProfile(RespiratoryProfile profile) { this.profile = profile; }
}