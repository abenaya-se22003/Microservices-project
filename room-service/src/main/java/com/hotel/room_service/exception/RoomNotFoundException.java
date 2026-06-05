package com.hotel.room_service.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class RoomNotFoundException extends RuntimeException {

    public RoomNotFoundException(Long id) {
        super("Room not found with id: " + id);
    }

    public RoomNotFoundException(String roomNumber) {
        super("Room not found with room number: " + roomNumber);
    }
}
