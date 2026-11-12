package com.example.demo.dto;

import com.example.demo.entity.Role;

public class RegisterDto extends Registration {
    public RegisterDto() {
        super();
    }

    public RegisterDto(String username, String email, String password, String city, Role role) {
        super(username, email, password, city, role);
    }
}
