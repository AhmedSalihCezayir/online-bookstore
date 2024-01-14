package bookstore.commons.dto;

import lombok.Data;

@Data
public class OrderBookDto {
    private BookDto book;
    private Integer quantity;
}
