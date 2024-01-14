package bookstore.commons;

import lombok.Data;

@Data
public class ShippingDto {
    private Long id;
    private AddressDto address;
    private Long trackingNo;
}
