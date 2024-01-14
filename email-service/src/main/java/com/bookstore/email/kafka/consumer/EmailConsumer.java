package com.bookstore.email.kafka.consumer;

import bookstore.commons.OrderDto;
import com.bookstore.email.service.EmailService;
import com.bookstore.email.utils.EmailUtils;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class EmailConsumer {
    private EmailService emailService;

    public EmailConsumer(EmailService emailService) {
        this.emailService = emailService;
    }

    @KafkaListener(topics = "order_created", groupId = "email-send-group")
    public void sendEmail(OrderDto order) {
        System.out.println("Message received!");
        String mailBody = EmailUtils.createEmailBody(order);
        emailService.sendEmail(order.getCustomerEmail(), "Book Store Order", mailBody);
    }
}
