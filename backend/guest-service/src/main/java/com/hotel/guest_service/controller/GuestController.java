package com.hotel.guest_service.controller;

import com.hotel.guest_service.dto.LoginRequest;
import com.hotel.guest_service.model.Guest;
import com.hotel.guest_service.service.GuestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

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

    // PUT /api/guests/{id}/role — Update a guest's role
    @PutMapping("/{id}/role")
    public ResponseEntity<Guest> updateRole(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String newRole = body.get("role");
        Guest updated = guestService.updateRole(id, newRole);
        return ResponseEntity.ok(updated);
    }

    // DELETE /api/guests/{id} — Delete a guest
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGuest(@PathVariable Long id) {
        guestService.deleteGuest(id);
        return ResponseEntity.noContent().build();
    }
}