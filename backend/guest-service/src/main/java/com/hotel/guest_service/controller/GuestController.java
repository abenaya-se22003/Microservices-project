package com.hotel.guest_service.controller;

import com.hotel.guest_service.dto.LoginRequest;
import com.hotel.guest_service.model.Guest;
import com.hotel.guest_service.service.GuestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/guests")
public class GuestController {

    @Autowired
    private GuestService guestService;

    // POST /api/guests — Create a new guest
    @PostMapping
    public ResponseEntity<Guest> createGuest(@RequestBody Guest guest) {
        Guest savedGuest = guestService.addGuest(guest);
        return new ResponseEntity<>(savedGuest, HttpStatus.CREATED);
    }

    // GET /api/guests — Get all guests
    @GetMapping
    public ResponseEntity<List<Guest>> getAllGuests() {
        return ResponseEntity.ok(guestService.getAllGuests());
    }

    // GET /api/guests/{id} — Get a guest by ID
    @GetMapping("/{id}")
    public ResponseEntity<Guest> getGuestById(@PathVariable Long id) {
        Guest guest = guestService.getGuestById(id);
        return ResponseEntity.ok(guest);
    }

    // POST /api/guests/signup — Register a new user
    @PostMapping("/signup")
    public ResponseEntity<Guest> signup(@RequestBody Guest guest) {
        Guest savedGuest = guestService.signup(guest);
        return new ResponseEntity<>(savedGuest, HttpStatus.CREATED);
    }

    // POST /api/guests/login — Authenticate a user
    @PostMapping("/login")
    public ResponseEntity<Guest> login(@RequestBody LoginRequest loginRequest) {
        Guest guest = guestService.login(loginRequest.getEmail(), loginRequest.getPassword());
        return ResponseEntity.ok(guest);
    }
}