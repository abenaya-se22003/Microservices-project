package com.hotel.authservice.service;

import com.hotel.authservice.dto.AuthResponse;
import com.hotel.authservice.dto.LoginRequest;
import com.hotel.authservice.dto.RegisterRequest;
import com.hotel.authservice.dto.UserDTO;
import com.hotel.authservice.model.Role;
import com.hotel.authservice.model.User;
import com.hotel.authservice.repository.AuthRepository;
import com.hotel.authservice.util.JwtUtil;
import io.jsonwebtoken.Claims;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AuthService {

    private final AuthRepository authRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(AuthRepository authRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.authRepository = authRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    /**
     * Register a new user.
     * Hashes the password, saves to DB, and returns a JWT token.
     */
    public AuthResponse register(RegisterRequest request) {
        // Check if email is already taken
        if (authRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered: " + request.getEmail());
        }

        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.USER);

        User savedUser = authRepository.save(user);

        String token = jwtUtil.generateToken(
                savedUser.getId(),
                savedUser.getEmail(),
                savedUser.getRole().name(),
                savedUser.getFullName()
        );

        return new AuthResponse(token);
    }

    /**
     * Authenticate a user by email/password.
     * Returns a JWT token on success.
     */
    public AuthResponse login(LoginRequest request) {
        User user = authRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(
                user.getId(),
                user.getEmail(),
                user.getRole().name(),
                user.getFullName()
        );

        return new AuthResponse(token);
    }

    /**
     * Validate a JWT token and return the claims (userId, role).
     * Called by the API Gateway's AuthenticationFilter.
     */
    public Map<String, Object> validateToken(String token) {
        Claims claims = jwtUtil.validateToken(token);

        Map<String, Object> result = new HashMap<>();
        result.put("userId", claims.get("userId"));
        result.put("role", claims.get("role"));
        result.put("email", claims.get("email"));

        return result;
    }

    /**
     * Retrieve all registered users as DTOs (excludes password).
     * Used by the Admin dashboard to display the guest list.
     */
    public List<UserDTO> getAllUsers() {
        List<User> users = authRepository.findAll();
        List<UserDTO> dtos = new ArrayList<>();
        for (User u : users) {
            dtos.add(new UserDTO(
                    u.getId(),
                    u.getFullName(),
                    u.getEmail(),
                    u.getPhone(),
                    u.getRole().name()
            ));
        }
        return dtos;
    }
}
