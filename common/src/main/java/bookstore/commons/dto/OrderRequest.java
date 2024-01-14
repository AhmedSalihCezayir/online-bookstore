package bookstore.commons.dto;

import lombok.Data;

import java.util.List;

@Data
public class OrderRequest {
    private String couponCode;
    private Long paymentAddressId;
    private Long shippingAddressId;
    private List<OrderBookRequest> books;
}
