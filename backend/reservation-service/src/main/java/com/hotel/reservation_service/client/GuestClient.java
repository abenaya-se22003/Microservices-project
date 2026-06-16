package com.hotel.reservation_service.client;

import com.hotel.reservation_service.dto.GuestDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

/**
 * Feign client for fetching user data from the auth-service.
 * Points directly to the auth-service (port 8085), not through the API Gateway.
 */
@FeignClient(name = "auth-service", url = "http://localhost:8085/auth/users")
public interface GuestClient {
    @GetMapping("/{id}")
    GuestDto getGuestById(@PathVariable("id") Long id);
}