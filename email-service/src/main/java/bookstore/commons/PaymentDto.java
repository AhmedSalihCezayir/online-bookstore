package bookstore.commons;

import lombok.Data;

import java.util.Date;

@Data
public class PaymentDto {
    private Long id;
    private AddressDto address;
    private Date date;
}
