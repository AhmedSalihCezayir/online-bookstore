package bookstore.commons;

import lombok.Data;

@Data
public class OrderBookDto {
    private BookDto book;
    private Integer quantity;
}
