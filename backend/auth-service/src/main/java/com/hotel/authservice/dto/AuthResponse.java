package com.hotel.authservice.dto;

/**
 * Response DTO returned by login and register endpoints.
 * Contains only the JWT token — the frontend decodes it
 * to extract userId, role, email, and fullName.
 */
public class AuthResponse {
    private String token;

    public AuthResponse() {}

    public AuthResponse(String token) {
        this.token = token;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
}
