package bookstore.commons;

import lombok.Data;

@Data
public class BookDto {
    private Long id;
    private String title;
    private Double price;
}
