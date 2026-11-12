package com.example.demo.config;

import com.example.demo.entity.Role;
import com.example.demo.entity.SystemUser;
import com.example.demo.repository.SystemUserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    private final SystemUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(SystemUserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        seedUser("officer1", "officer1@aerobreath.com", "officer123", "Metropolis", Role.ENVIRONMENTAL_OFFICER);
        seedUser("citizen1", "citizen1@aerobreath.com", "citizen123", "Metropolis", Role.CITIZEN);
        seedUser("researcher1", "researcher1@aerobreath.com", "researcher123", "Metropolis", Role.MEDICAL_RESEARCHER);
        seedUser("admin", "admin@aerobreath.com", "admin123", "Metropolis", Role.SYSTEM_ADMIN);
    }

    private void seedUser(String username, String email, String password, String city, Role role) {
        if (userRepository.findByUsername(username).isEmpty()) {
            SystemUser user = new SystemUser();
            user.setUsername(username);
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode(password));
            user.setCity(city);
            user.setRole(role);
            userRepository.save(user);
        }
    }
}
