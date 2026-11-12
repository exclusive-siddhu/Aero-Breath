package com.example.demo.service;

import com.example.demo.dto.ObservationDto;
import com.example.demo.entity.ConditionType;
import com.example.demo.entity.HealthObservation;
import com.example.demo.entity.RespiratoryProfile;
import com.example.demo.entity.SystemUser;
import com.example.demo.repository.HealthObservationRepository;
import com.example.demo.repository.RespiratoryProfileRepository;
import com.example.demo.repository.SystemUserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class HealthTrackingService {

    private final HealthObservationRepository healthObservationRepository;
    private final RespiratoryProfileRepository respiratoryProfileRepository;
    private final SystemUserRepository systemUserRepository;

    public HealthTrackingService(HealthObservationRepository healthObservationRepository,
                                 RespiratoryProfileRepository respiratoryProfileRepository,
                                 SystemUserRepository systemUserRepository) {
        this.healthObservationRepository = healthObservationRepository;
        this.respiratoryProfileRepository = respiratoryProfileRepository;
        this.systemUserRepository = systemUserRepository;
    }

    public HealthObservation logSymptoms(SystemUser userPrincipal, ObservationDto request) {
        RespiratoryProfile profile = respiratoryProfileRepository.findByUser(userPrincipal)
                .orElseGet(() -> {
                    RespiratoryProfile newProfile = new RespiratoryProfile();
                    newProfile.setConditionType(ConditionType.NONE);
                    newProfile.setUser(userPrincipal);
                    newProfile.setSeverityLevel(1);
                    newProfile.setIsSmoker(false);
                    return respiratoryProfileRepository.save(newProfile);
                });

        if (request.getConditionType() != null && !request.getConditionType().isBlank()) {
            try {
                profile.setConditionType(ConditionType.valueOf(request.getConditionType().trim().toUpperCase()));
                profile = respiratoryProfileRepository.save(profile);
            } catch (Exception ignored) {
            }
        }

        HealthObservation observation = new HealthObservation();
        observation.setProfile(profile);
        observation.setSymptomScore(request.getSymptomScore());
        observation.setNotes(request.getNotes());
        observation.setActivityLevel(request.getActivityLevel());
        observation.setRecordedAt(LocalDateTime.now());

        return healthObservationRepository.save(observation);
    }

    public List<HealthObservation> getUserHistory(SystemUser userPrincipal) {
        return healthObservationRepository.findByProfileUserOrderByRecordedAtDesc(userPrincipal);
    }

    private SystemUser getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication() != null 
                ? SecurityContextHolder.getContext().getAuthentication().getName() 
                : null;
        if (username != null) {
            return systemUserRepository.findByUsernameOrEmail(username, username).orElse(null);
        }
        return null;
    }

    public List<ObservationDto> getUserHistory() {
        SystemUser user = getCurrentUser();
        List<HealthObservation> observations;
        if (user != null) {
            observations = healthObservationRepository.findByProfileUserOrderByRecordedAtDesc(user);
        } else {
            observations = healthObservationRepository.findAll();
        }
        List<ObservationDto> dtos = new ArrayList<>();
        for (HealthObservation obs : observations) {
            String dateStr = obs.getRecordedAt() != null ? obs.getRecordedAt().toLocalDate().toString() : "";
            String condition = (obs.getProfile() != null && obs.getProfile().getConditionType() != null) 
                    ? obs.getProfile().getConditionType().name() : "NONE";
            ObservationDto dto = new ObservationDto(obs.getSymptomScore(), obs.getNotes(), obs.getActivityLevel(), dateStr, condition);
            dto.setId(obs.getId());
            dtos.add(dto);
        }
        return dtos;
    }

    public ObservationDto getObservationById(Long id) {
        return healthObservationRepository.findById(id)
                .map(obs -> {
                    String dateStr = obs.getRecordedAt() != null ? obs.getRecordedAt().toLocalDate().toString() : "";
                    String condition = (obs.getProfile() != null && obs.getProfile().getConditionType() != null) 
                            ? obs.getProfile().getConditionType().name() : "NONE";
                    ObservationDto dto = new ObservationDto(obs.getSymptomScore(), obs.getNotes(), obs.getActivityLevel(), dateStr, condition);
                    dto.setId(obs.getId());
                    return dto;
                })
                .orElse(new ObservationDto());
    }

    public ObservationDto logHealthObservation(ObservationDto observationDto) {
        SystemUser user = getCurrentUser();
        if (user == null) {
            user = systemUserRepository.findAll().stream().findFirst().orElse(null);
        }
        if (user != null) {
            HealthObservation saved = logSymptoms(user, observationDto);
            observationDto.setId(saved.getId());
            if (saved.getRecordedAt() != null) {
                observationDto.setDate(saved.getRecordedAt().toLocalDate().toString());
            }
        }
        return observationDto;
    }

    public ObservationDto updateHealthObservation(Long id, ObservationDto observationDto) {
        healthObservationRepository.findById(id).ifPresent(obs -> {
            obs.setSymptomScore(observationDto.getSymptomScore());
            obs.setNotes(observationDto.getNotes());
            obs.setActivityLevel(observationDto.getActivityLevel());
            healthObservationRepository.save(obs);
        });
        return observationDto;
    }

    public void deleteHealthObservation(Long id) {
        if (healthObservationRepository.existsById(id)) {
            healthObservationRepository.deleteById(id);
        }
    }
}
