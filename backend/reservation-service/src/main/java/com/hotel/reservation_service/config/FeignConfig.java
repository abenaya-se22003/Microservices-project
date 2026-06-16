package com.hotel.reservation_service.config;

import feign.RequestInterceptor;
import feign.RequestTemplate;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

/**
 * Feign configuration that propagates the JWT token from the incoming
 * HTTP request to all outgoing Feign requests.
 *
 * Flow:
 * 1. Frontend sends a request with "Authorization: Bearer <token>" to the API Gateway
 * 2. The Gateway validates the token and forwards the request (with the original header) to this service
 * 3. When this service makes a Feign call to another service, this interceptor
 *    copies the Authorization header so the downstream service can also validate the caller
 */
@Configuration
public class FeignConfig {

    @Bean
    public RequestInterceptor authTokenInterceptor() {
        return new RequestInterceptor() {
            @Override
            public void apply(RequestTemplate template) {
                ServletRequestAttributes attributes =
                        (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
                if (attributes != null) {
                    HttpServletRequest request = attributes.getRequest();
                    String authHeader = request.getHeader("Authorization");
                    if (authHeader != null && authHeader.startsWith("Bearer ")) {
                        template.header("Authorization", authHeader);
                    }
                }
            }
        };
    }
}
