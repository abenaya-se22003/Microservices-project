package com.hotel.reservation_service.controller;

import com.hotel.reservation_service.model.Reservation;
import com.hotel.reservation_service.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    @Autowired
    private ReservationService reservationService;

    /**
     * Create a new reservation.
     * The guestId is NOT in the request body — it comes from the X-User-Id header
     * that the API Gateway's AuthenticationFilter injects after validating the JWT token.
     * This is more secure: the frontend cannot spoof another user's ID.
     */
    @PostMapping
    public Reservation createReservation(
            @RequestBody Reservation reservation,
            @RequestHeader("X-User-Id") Long userId) {
        reservation.setGuestId(userId);
        return reservationService.bookRoom(reservation);
    }

    @GetMapping
    public List<Reservation> getAllReservations() {
        return reservationService.getAllReservations();
    }
}