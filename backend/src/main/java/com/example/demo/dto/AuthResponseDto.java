package com.example.demo.dto;

public class AuthResponseDto {
    private String token;
    private String username;
    private String role;
    private Long userId;
    private String city;

    public AuthResponseDto() {}
    public AuthResponseDto(String token, String username, String role, Long userId) {
        this.token = token;
        this.username = username;
        this.role = role;
        this.userId = userId;
    }
    public AuthResponseDto(String token, String username, String role, Long userId, String city) {
        this.token = token;
        this.username = username;
        this.role = role;
        this.userId = userId;
        this.city = city;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
}