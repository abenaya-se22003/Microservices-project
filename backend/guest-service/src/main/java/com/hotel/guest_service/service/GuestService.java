package com.hotel.guest_service.service;

import com.hotel.guest_service.exception.GuestNotFoundException;
import com.hotel.guest_service.model.Guest;
import com.hotel.guest_service.repo.GuestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

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
}