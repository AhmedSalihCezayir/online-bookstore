package bookstore.commons.dto;

import lombok.Data;


@Data
public class InventoryRequest {
    private Integer quantity;
    private Double purchasePrice;
}
