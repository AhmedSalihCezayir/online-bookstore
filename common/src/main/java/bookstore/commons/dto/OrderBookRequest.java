package bookstore.commons.dto;

import lombok.Data;

@Data
public class OrderBookRequest {
    private Long bookId;
    private Integer quantity;
}
