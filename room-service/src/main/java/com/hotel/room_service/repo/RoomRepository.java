package com.hotel.room_service.repo;

import com.hotel.room_service.model.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {

    // Find a room by its room number (e.g., "101", "202")
    Optional<Room> findByRoomNumber(String roomNumber);

    // Find all rooms of a specific type (e.g., "Single", "Double")
    List<Room> findByRoomType(String roomType);

    // Check if a room with a given room number already exists
    boolean existsByRoomNumber(String roomNumber);
}
