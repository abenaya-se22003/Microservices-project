package com.hotel.reservation_service.service;

import com.hotel.reservation_service.client.GuestClient;
import com.hotel.reservation_service.client.RoomClient;
import com.hotel.reservation_service.dto.GuestDto;
import com.hotel.reservation_service.dto.RoomDto;
import com.hotel.reservation_service.model.Reservation;
import com.hotel.reservation_service.repo.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final RoomClient roomClient;
    private final GuestClient guestClient;

    public ReservationService(ReservationRepository reservationRepository, RoomClient roomClient, GuestClient guestClient) {
        this.reservationRepository = reservationRepository;
        this.roomClient = roomClient;
        this.guestClient = guestClient;
    }

    public Reservation bookRoom(Reservation reservation) {
        // 1. Ask the Room Service if the room exists
        RoomDto room = roomClient.getRoomById(reservation.getRoomId());

        // 2. Ask the Guest Service if the guest exists
        GuestDto guest = guestClient.getGuestById(reservation.getGuestId());

        // 3. If both exist (no errors thrown by Feign), we save the reservation!
        System.out.println("Booking confirmed for " + guest.getFullName() + " in Room " + room.getRoomNumber());
        return reservationRepository.save(reservation);
    }

    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }
}