package com.hotel.guest_service.service;

import com.hotel.guest_service.exception.GuestNotFoundException;
import com.hotel.guest_service.model.Guest;
import com.hotel.guest_service.repo.GuestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class GuestService {

    @Autowired
    private GuestRepository guestRepository;

    // Save a new guest to the database
    public Guest addGuest(Guest guest) {
        return guestRepository.save(guest);
    }

    // Get a list of all guests from the database
    public List<Guest> getAllGuests() {
        return guestRepository.findAll();
    }

    // Get a single guest by ID
    public Guest getGuestById(Long id) {
        return guestRepository.findById(id)
                .orElseThrow(() -> new GuestNotFoundException(id));
    }

    // Register a new guest (signup)
    public Guest signup(Guest guest) {
        // Check if email is already registered
        Optional<Guest> existing = guestRepository.findByEmail(guest.getEmail());
        if (existing.isPresent()) {
            throw new IllegalArgumentException("A guest with this email already exists.");
        }
        return guestRepository.save(guest);
    }

    // Authenticate a guest (login)
    public Guest login(String email, String password) {
        Guest guest = guestRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid email or password."));

        if (!guest.getPassword().equals(password)) {
            throw new RuntimeException("Invalid email or password.");
        }

        return guest;
    }
}