package com.example.demo.entity;

import jakarta.persistence.*;
import java.util.List;


@Entity
@Table(name = "respiratory_profiles")
public class RespiratoryProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ConditionType conditionType;

    private Integer severityLevel;
    private Boolean isSmoker;

    @OneToOne
    @JoinColumn(name = "user_id", unique = true, nullable = false)
    private SystemUser user;

    @OneToMany(mappedBy = "profile", cascade = CascadeType.ALL)
    private List<HealthObservation> observations;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public ConditionType getConditionType() { return conditionType; }
    public void setConditionType(ConditionType conditionType) { this.conditionType = conditionType; }
    public Integer getSeverityLevel() { return severityLevel; }
    public void setSeverityLevel(Integer severityLevel) { this.severityLevel = severityLevel; }
    public Boolean getIsSmoker() { return isSmoker; }
    public void setIsSmoker(Boolean smoker) { isSmoker = smoker; }
    public SystemUser getUser() { return user; }
    public void setUser(SystemUser user) { this.user = user; }
    public List<HealthObservation> getObservations() { return observations; }
    public void setObservations(List<HealthObservation> observations) { this.observations = observations; }
}