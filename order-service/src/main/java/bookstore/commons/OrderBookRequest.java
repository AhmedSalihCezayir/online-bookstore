package bookstore.commons;

import lombok.Data;

@Data
public class OrderBookRequest {
    private Long bookId;
    private Integer quantity;
}
