package com.example.demo.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class ObservationDto {

    private Long id;

    @NotNull(message = "Symptom score is required")
    @Min(value = 1, message = "Symptom score must be at least 1")
    @Max(value = 10, message = "Symptom score must be at most 10")
    private Integer symptomScore;

    private String notes;

    private String activityLevel;

    private String date;

    private String conditionType;

    public ObservationDto() {}

    public ObservationDto(Integer symptomScore, String notes, String activityLevel) {
        this.symptomScore = symptomScore;
        this.notes = notes;
        this.activityLevel = activityLevel;
    }

    public ObservationDto(Integer symptomScore, String notes, String activityLevel, String date, String conditionType) {
        this.symptomScore = symptomScore;
        this.notes = notes;
        this.activityLevel = activityLevel;
        this.date = date;
        this.conditionType = conditionType;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Integer getSymptomScore() { return symptomScore; }
    public void setSymptomScore(Integer symptomScore) { this.symptomScore = symptomScore; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public String getActivityLevel() { return activityLevel; }
    public void setActivityLevel(String activityLevel) { this.activityLevel = activityLevel; }
    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }
    public String getConditionType() { return conditionType; }
    public void setConditionType(String conditionType) { this.conditionType = conditionType; }
}