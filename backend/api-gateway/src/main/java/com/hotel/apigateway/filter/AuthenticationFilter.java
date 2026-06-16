package com.hotel.apigateway.filter;

import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;

/**
 * Global authentication filter for the API Gateway.
 *
 * Flow:
 * 1. Check if the request is to a public endpoint → allow through
 * 2. Extract the "Authorization: Bearer <token>" header
 * 3. Call the auth-service's /auth/validate endpoint to verify the token
 * 4. On success: add X-User-Id and X-User-Role headers and forward downstream
 * 5. On failure: return 401 Unauthorized
 */
@Component
public class AuthenticationFilter implements GlobalFilter, Ordered {

    private final WebClient webClient;

    public AuthenticationFilter() {
        this.webClient = WebClient.builder()
                .baseUrl("http://localhost:8085")
                .build();
    }

    /**
     * List of path prefixes that do NOT require authentication.
     */
    private boolean isPublicEndpoint(ServerHttpRequest request) {
        String path = request.getURI().getPath();
        HttpMethod method = request.getMethod();

        // Only specific auth endpoints are public (not /auth/users)
        if (path.equals("/auth/register") || path.equals("/auth/login") || path.equals("/auth/validate")) {
            return true;
        }

        // GET requests to rooms listing are public (browsing rooms)
        if (path.startsWith("/api/rooms") && HttpMethod.GET.equals(method)) {
            return true;
        }

        return false;
    }

    /**
     * Check if the request path requires ADMIN role.
     */
    private boolean requiresAdminRole(ServerHttpRequest request) {
        String path = request.getURI().getPath();
        return path.equals("/auth/users");
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();

        // 1. Skip auth for public endpoints
        if (isPublicEndpoint(request)) {
            return chain.filter(exchange);
        }

        // 2. Extract the Authorization header
        List<String> authHeaders = request.getHeaders().get(HttpHeaders.AUTHORIZATION);
        if (authHeaders == null || authHeaders.isEmpty()) {
            return onUnauthorized(exchange, "Missing Authorization header");
        }

        String authHeader = authHeaders.get(0);
        if (!authHeader.startsWith("Bearer ")) {
            return onUnauthorized(exchange, "Invalid Authorization header format");
        }

        String token = authHeader.substring(7);

        // 3. Call auth-service to validate the token
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/auth/validate")
                        .queryParam("token", token)
                        .build())
                .retrieve()
                .bodyToMono(Map.class)
                .flatMap(claims -> {
                    // 4. Token is valid — extract claims and add as headers
                    String userId = String.valueOf(claims.get("userId"));
                    String role = String.valueOf(claims.get("role"));

                    // 4b. Check if the route requires ADMIN role
                    if (requiresAdminRole(request) && !"ADMIN".equals(role)) {
                        return onForbidden(exchange, "Admin access required");
                    }

                    // Mutate the request to add custom headers for downstream services
                    ServerHttpRequest mutatedRequest = request.mutate()
                            .header("X-User-Id", userId)
                            .header("X-User-Role", role)
                            .build();

                    ServerWebExchange mutatedExchange = exchange.mutate()
                            .request(mutatedRequest)
                            .build();

                    return chain.filter(mutatedExchange);
                })
                .onErrorResume(error -> {
                    // 5. Token validation failed
                    return onUnauthorized(exchange, "Invalid or expired token");
                });
    }

    /**
     * Return a 401 Unauthorized response.
     */
    private Mono<Void> onUnauthorized(ServerWebExchange exchange, String message) {
        exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
        exchange.getResponse().getHeaders().add("Content-Type", "application/json");
        byte[] bytes = ("{\"message\":\"" + message + "\"}").getBytes();
        return exchange.getResponse().writeWith(
                Mono.just(exchange.getResponse().bufferFactory().wrap(bytes))
        );
    }

    /**
     * Return a 403 Forbidden response.
     */
    private Mono<Void> onForbidden(ServerWebExchange exchange, String message) {
        exchange.getResponse().setStatusCode(HttpStatus.FORBIDDEN);
        exchange.getResponse().getHeaders().add("Content-Type", "application/json");
        byte[] bytes = ("{\"message\":\"" + message + "\"}").getBytes();
        return exchange.getResponse().writeWith(
                Mono.just(exchange.getResponse().bufferFactory().wrap(bytes))
        );
    }

    /**
     * Run this filter before other filters (high priority).
     */
    @Override
    public int getOrder() {
        return -1;
    }
}
