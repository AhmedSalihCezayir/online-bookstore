package com.bookstore.email.utils;

import bookstore.commons.OrderBookDto;
import bookstore.commons.OrderDto;

public class EmailUtils {
    public static String createEmailBody(OrderDto order) {
        String mailBody = """
            <body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; margin: 0; padding: 0; background-color: #f6f6f6;">
                <div style="width: 80%%; margin: auto; background-color: #ffffff; border: 1px solid #e1e1e1; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);" class="container">
                    <div style="background-color: #4CAF50; color: white; padding: 20px; text-align: center; border-top-left-radius: 10px; border-top-right-radius: 10px;" class="header">
                        <h1>Thank you for your order!</h1>
                    </div>
    
                    <div style="padding: 20px 20px 10px 20px;" class="order-details">
                        <h2 style="color: #4CAF50;">Order #%s</h2>
                        <p><strong>Date: </strong>%s</p>
    
                        <!-- Loop through products -->
                        %s
    
                        <div style="margin-top: 20px; font-weight: bold; border-top: 1px solid #e1e1e1; padding-top: 10px;" class="total">
                            <p>Total: $%s</p>
                        </div>
                    </div>
    
                    <!-- Shipping Information -->
                    <div style="margin-top: 20px; padding: 20px; border-top: 1px solid #e1e1e1;" class="shipping-info">
                        <h3>Shipping Address</h3>
                        <p>%s, %s, %s, %s</p>
                        <p><strong>Shipping Company:</strong> %s</p>
                        
                    </div>
    
                    <div style="margin-top: 20px; text-align: center; color: #888; padding: 20px; border-bottom-left-radius: 10px; border-bottom-right-radius: 10px; background-color: #f9f9f9;" class="footer">
                        <p>Thank you for your order! If you have any questions, please contact us at <a href="mailto:support@example.com" style="color: #4CAF50;">support@example.com</a></p>
                    </div>
                </div>
            </body>
        """;

        StringBuilder productsHtml = new StringBuilder();
        for (OrderBookDto bookDto : order.getBooks()) {
            productsHtml.append("""
                <div padding: 10px 0;" class="product">
                    <p style="color: #4CAF50;"><strong>%s</strong></p>
                    <p><strong>Quantity:</strong> %s</p>
                    <p><strong>Price: </strong>$%s</p>
                </div>
            """);
            productsHtml = new StringBuilder(String.format(productsHtml.toString(),
                    bookDto.getBook().getTitle(), bookDto.getQuantity(), bookDto.getBook().getPrice()));
        }

        return String.format(
                mailBody,
                order.getId(),
                order.getOrderDate(),
                productsHtml,
                order.getTotalPrice(),
                order.getShipping().getAddress().getStreetAddress(),
                order.getShipping().getAddress().getCity(),
                order.getShipping().getAddress().getState(),
                order.getShipping().getAddress().getCountry(),
                ""
        );
    }
}
