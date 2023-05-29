package bookstore.commons;

import jakarta.persistence.Column;
import lombok.Data;

@Data
public class CustomerDto {
    private Long id;
    private String name;
    private String email;
    private String phoneNumber;
}
