package bookstore.commons;

import bookstore.shipping.Shipping;
import lombok.Data;

@Data
public class ShippingDto {
    private Long id;
    private AddressDto address;
    private Long trackingNo;
    private Shipping.Company company;
}
