package com.hotel.reservation_service.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * RabbitMQ configuration for the reservation-service (Producer side).
 *
 * Declares:
 *  - A durable queue ("email_queue") where notification messages are delivered.
 *  - A topic exchange ("hotel_booking_exchange") that routes messages by routing key.
 *  - A binding that routes messages with key "booking.confirmation" to the queue.
 *  - A Jackson JSON converter so BookingEvent objects are auto-serialized to JSON.
 */
@Configuration
public class RabbitMQConfig {

    public static final String QUEUE_NAME = "email_queue";
    public static final String EXCHANGE_NAME = "hotel_booking_exchange";
    public static final String ROUTING_KEY = "booking.confirmation";

    @Bean
    public Queue emailQueue() {
        return new Queue(QUEUE_NAME, true); // durable = true
    }

    @Bean
    public TopicExchange bookingExchange() {
        return new TopicExchange(EXCHANGE_NAME);
    }

    @Bean
    public Binding binding(Queue emailQueue, TopicExchange bookingExchange) {
        return BindingBuilder
                .bind(emailQueue)
                .to(bookingExchange)
                .with(ROUTING_KEY);
    }

    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }
}
