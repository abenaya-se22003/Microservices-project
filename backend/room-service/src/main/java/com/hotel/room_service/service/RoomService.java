package com.hotel.room_service.service;

import com.hotel.room_service.exception.RoomAlreadyExistsException;
import com.hotel.room_service.exception.RoomNotFoundException;
import com.hotel.room_service.model.Room;
import com.hotel.room_service.repo.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import org.springframework.lang.NonNull;

import java.util.List;

@Service
public class RoomService {

    @Autowired
    private RoomRepository roomRepository;

    // CREATE — Add a new room to the database
    public Room addRoom(Room room) {
        // Check if a room with the same room number already exists
        if (roomRepository.existsByRoomNumber(room.getRoomNumber())) {
            throw new RoomAlreadyExistsException(room.getRoomNumber());
        }
        return roomRepository.save(room);
    }

    // READ — Get all rooms
    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    // READ — Get a single room by its ID
    public Room getRoomById(@NonNull Long id) {
        return roomRepository.findById(id)
                .orElseThrow(() -> new RoomNotFoundException(id));
    }

    // READ — Get rooms by type (e.g., "Single", "Double", "Suite")
    public List<Room> getRoomsByType(String roomType) {
        return roomRepository.findByRoomType(roomType);
    }

    // UPDATE — Update an existing room's details
    public Room updateRoom(@NonNull Long id, @NonNull Room updatedRoom) {
        Room existingRoom = roomRepository.findById(id)
                .orElseThrow(() -> new RoomNotFoundException(id));

        existingRoom.setRoomNumber(updatedRoom.getRoomNumber());
        existingRoom.setRoomType(updatedRoom.getRoomType());
        existingRoom.setPricePerNight(updatedRoom.getPricePerNight());

        return roomRepository.save(existingRoom);
    }

    // DELETE — Remove a room by its ID
    public void deleteRoom(@NonNull Long id) {
        if (!roomRepository.existsById(id)) {
            throw new RoomNotFoundException(id);
        }
        roomRepository.deleteById(id);
    }
}