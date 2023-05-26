package bookstore.commons;

import lombok.Data;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@Data
public class OrderDto {
    private Long id;
    private Date orderDate;
    private PaymentDto payment;
    private ShippingDto shipping;
    private BigDecimal totalPrice;
    private BigDecimal discountedPrice;
    private String couponCode;
    private List<OrderBookDto> books;

}
