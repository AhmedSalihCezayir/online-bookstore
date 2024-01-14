package bookstore.commons.dto;

import lombok.Data;

@Data
public class ShippingDto {
    private Long id;
    private AddressDto address;
    private Long trackingNo;
    private Company company;

    public enum Company {
        UPS,
        DHL,
        FedEx
    }
}
