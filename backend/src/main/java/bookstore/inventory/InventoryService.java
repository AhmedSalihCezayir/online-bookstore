package bookstore.inventory;

import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;

public interface InventoryService {

    List<Inventory>  findAll();

    Inventory addItem(Inventory inventory);

    Inventory findById(Long id);

    Inventory restockItem(Long inventoryId, Integer quantity, Double purchasePrice);

    void deleteItem(Long inventoryId);
}
