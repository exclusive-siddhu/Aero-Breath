package com.example.demo.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "sensor_stations")
public class SensorStation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Station name is required")
    @Column(nullable = false)
    private String stationName;

    @NotBlank(message = "City is required")
    @Column(nullable = false)
    private String city;

    private BigDecimal latitude;
    private BigDecimal longitude;

    @NotNull(message = "Status is required")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StationStatus status;

    @NotNull(message = "Data capacity is required")
    @Column(name = "data_capacity")
    private Integer dataCapacity;

    @Version
    private Long version;

    @ManyToOne
    private SystemUser officer;

    @OneToMany(mappedBy = "station", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<AirQualityMetric> metrics;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getStationName() { return stationName; }
    public void setStationName(String stationName) { this.stationName = stationName; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public BigDecimal getLatitude() { return latitude; }
    public void setLatitude(BigDecimal latitude) { this.latitude = latitude; }
    public BigDecimal getLongitude() { return longitude; }
    public void setLongitude(BigDecimal longitude) { this.longitude = longitude; }
    public StationStatus getStatus() { return status; }
    public void setStatus(StationStatus status) { this.status = status; }
    public Integer getDataCapacity() { return dataCapacity; }
    public void setDataCapacity(Integer dataCapacity) { this.dataCapacity = dataCapacity; }
    public Long getVersion() { return version; }
    public void setVersion(Long version) { this.version = version; }
    public SystemUser getOfficer() { return officer; }
    public void setOfficer(SystemUser officer) { this.officer = officer; }
    public List<AirQualityMetric> getMetrics() { return metrics; }
    public void setMetrics(List<AirQualityMetric> metrics) { this.metrics = metrics; }
}