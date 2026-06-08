package com.hotel.guest_service.controller;

import com.hotel.guest_service.model.Guest;
import com.hotel.guest_service.service.GuestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/guests")
public class GuestController {

    @Autowired
    private GuestService guestService;

    // POST request: http://localhost:8082/api/guests
    @PostMapping
    public Guest createGuest(@RequestBody Guest guest) {
        return guestService.addGuest(guest);
    }

    // GET request: http://localhost:8082/api/guests
    @GetMapping
    public List<Guest> getAllGuests() {
        return guestService.getAllGuests();
    }
}