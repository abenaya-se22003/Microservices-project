package com.hotel.guest_service.repo;

import com.hotel.guest_service.model.Guest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GuestRepository extends JpaRepository<Guest, Long> {
    // Spring Boot automatically gives us the SQL commands for free!

    // Find a guest by their email address (used for login)
    Optional<Guest> findByEmail(String email);
}