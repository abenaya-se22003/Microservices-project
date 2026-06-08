package com.hotel.reservation_service.client;

import com.hotel.reservation_service.dto.GuestDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "guest-service", url = "http://localhost:8082/api/guests")
public interface GuestClient {
    @GetMapping("/{id}")
    GuestDto getGuestById(@PathVariable("id") Long id);
}