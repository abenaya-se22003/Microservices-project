package com.hotel.reservation_service.service;

import com.hotel.reservation_service.client.GuestClient;
import com.hotel.reservation_service.client.RoomClient;
import com.hotel.reservation_service.config.RabbitMQConfig;
import com.hotel.reservation_service.dto.BookingEvent;
import com.hotel.reservation_service.dto.GuestDto;
import com.hotel.reservation_service.dto.RoomDto;
import com.hotel.reservation_service.model.Reservation;
import com.hotel.reservation_service.repo.ReservationRepository;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final RoomClient roomClient;
    private final GuestClient guestClient;
    private final RabbitTemplate rabbitTemplate;

    public ReservationService(ReservationRepository reservationRepository,
                              RoomClient roomClient,
                              GuestClient guestClient,
                              RabbitTemplate rabbitTemplate) {
        this.reservationRepository = reservationRepository;
        this.roomClient = roomClient;
        this.guestClient = guestClient;
        this.rabbitTemplate = rabbitTemplate;
    }

    public Reservation bookRoom(Reservation reservation) {
        // 1. Ask the Room Service if the room exists
        RoomDto room = roomClient.getRoomById(reservation.getRoomId());

        // 2. Ask the Auth Service if the user exists
        GuestDto guest = guestClient.getGuestById(reservation.getGuestId());

        // 3. If both exist (no errors thrown by Feign), we save the reservation!
        System.out.println("Booking confirmed for " + guest.getFullName() + " in Room " + room.getRoomNumber());
        Reservation savedReservation = reservationRepository.save(reservation);

        // 4. Publish a booking event to RabbitMQ (fire-and-forget)
        //    Wrapped in try-catch so RabbitMQ failures never break the booking flow.
        try {
            BookingEvent event = new BookingEvent(
                    guest.getEmail(),
                    guest.getFullName(),
                    room.getRoomNumber(),
                    reservation.getCheckInDate(),
                    reservation.getCheckOutDate()
            );
            rabbitTemplate.convertAndSend(
                    RabbitMQConfig.EXCHANGE_NAME,
                    RabbitMQConfig.ROUTING_KEY,
                    event
            );
            System.out.println("Published booking event for " + guest.getEmail());
        } catch (Exception e) {
            // Log the error but don't fail the booking
            System.err.println("Failed to publish booking event: " + e.getMessage());
        }

        return savedReservation;
    }

    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }
}