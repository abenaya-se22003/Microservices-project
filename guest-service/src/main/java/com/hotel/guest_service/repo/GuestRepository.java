package com.hotel.guest_service.repo;

import com.hotel.guest_service.model.Guest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GuestRepository extends JpaRepository<Guest, Long> {
    // Spring Boot automatically gives us the SQL commands for free!
}