package com.hotel.room_service.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class RoomAlreadyExistsException extends RuntimeException {

    public RoomAlreadyExistsException(String roomNumber) {
        super("Room with room number '" + roomNumber + "' already exists");
    }
}
