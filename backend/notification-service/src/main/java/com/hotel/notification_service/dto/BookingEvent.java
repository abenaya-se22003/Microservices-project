package com.hotel.notification_service.dto;

/**
 * Event payload consumed from RabbitMQ.
 * Must match the structure published by the reservation-service.
 */
public class BookingEvent {

    private String guestEmail;
    private String guestName;
    private String roomNumber;
    private String checkInDate;
    private String checkOutDate;

    public BookingEvent() {}

    public BookingEvent(String guestEmail, String guestName, String roomNumber,
                        String checkInDate, String checkOutDate) {
        this.guestEmail = guestEmail;
        this.guestName = guestName;
        this.roomNumber = roomNumber;
        this.checkInDate = checkInDate;
        this.checkOutDate = checkOutDate;
    }

    // Getters and Setters
    public String getGuestEmail() { return guestEmail; }
    public void setGuestEmail(String guestEmail) { this.guestEmail = guestEmail; }
    public String getGuestName() { return guestName; }
    public void setGuestName(String guestName) { this.guestName = guestName; }
    public String getRoomNumber() { return roomNumber; }
    public void setRoomNumber(String roomNumber) { this.roomNumber = roomNumber; }
    public String getCheckInDate() { return checkInDate; }
    public void setCheckInDate(String checkInDate) { this.checkInDate = checkInDate; }
    public String getCheckOutDate() { return checkOutDate; }
    public void setCheckOutDate(String checkOutDate) { this.checkOutDate = checkOutDate; }

    @Override
    public String toString() {
        return "BookingEvent{" +
                "guestEmail='" + guestEmail + '\'' +
                ", guestName='" + guestName + '\'' +
                ", roomNumber='" + roomNumber + '\'' +
                ", checkInDate='" + checkInDate + '\'' +
                ", checkOutDate='" + checkOutDate + '\'' +
                '}';
    }
}
