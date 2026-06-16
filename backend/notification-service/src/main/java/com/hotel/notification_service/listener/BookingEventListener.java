package com.hotel.notification_service.listener;

import com.hotel.notification_service.dto.BookingEvent;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

/**
 * Listens for booking confirmation events from RabbitMQ.
 *
 * When a reservation is created, the reservation-service publishes a
 * BookingEvent to "hotel_booking_exchange" with routing key "booking.confirmation".
 * This listener consumes from "email_queue" and logs the notification.
 *
 * In a production system, this is where you would integrate with an
 * email provider (e.g., SendGrid, AWS SES) to send the actual email.
 */
@Component
public class BookingEventListener {

    @RabbitListener(queues = "email_queue")
    public void handleBookingEvent(BookingEvent event) {
        System.out.println("============================================");
        System.out.println("📧 NOTIFICATION SERVICE — New Booking Event");
        System.out.println("============================================");
        System.out.println("Sending Confirmation Email to " + event.getGuestEmail() + " for Room " + event.getRoomNumber());
        System.out.println("Guest Name  : " + event.getGuestName());
        System.out.println("Check-In    : " + event.getCheckInDate());
        System.out.println("Check-Out   : " + event.getCheckOutDate());
        System.out.println("============================================");
    }
}
