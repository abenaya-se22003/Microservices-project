package com.hotel.notification_service.config;

import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * RabbitMQ configuration for the notification-service (Consumer side).
 *
 * Declares a Jackson JSON converter so incoming messages are
 * automatically deserialized from JSON into BookingEvent objects.
 *
 * Note: The queue, exchange, and binding are already declared by
 * the producer (reservation-service). The consumer only needs the
 * message converter to understand the JSON format.
 */
@Configuration
public class RabbitMQConfig {

    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }
}
