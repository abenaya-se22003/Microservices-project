package com.hotel.authservice.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * Utility class for JWT token generation and validation.
 *
 * Tokens contain three custom claims:
 *   - userId  (Long)   — the user's database ID
 *   - role    (String) — "USER" or "ADMIN"
 *   - email   (String) — the user's email address
 *
 * The subject of the token is also set to the email.
 */
@Component
public class JwtUtil {

    // Injected from application.properties → jwt.secret → JWT_SECRET env var
    @Value("${jwt.secret}")
    private String secret;

    // Token validity: 24 hours
    private static final long EXPIRATION_MS = 1000 * 60 * 60 * 24;

    private SecretKey getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secret);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    /**
     * Generate a JWT token for the given user details.
     */
    public String generateToken(Long userId, String email, String role, String fullName) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);
        claims.put("role", role);
        claims.put("email", email);
        claims.put("fullName", fullName);

        return Jwts.builder()
                .claims(claims)
                .subject(email)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION_MS))
                .signWith(getSigningKey())
                .compact();
    }

    /**
     * Validate a token and return its claims.
     * Throws an exception if the token is invalid or expired.
     */
    public Claims validateToken(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
