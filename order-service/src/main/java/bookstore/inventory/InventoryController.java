package bookstore.inventory;

import bookstore.commons.InventoryRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/inventories")
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryService inventoryService;

    @GetMapping
    public ResponseEntity<List<Inventory>> getAllInventories() {
        return new ResponseEntity<>(inventoryService.findAll(), HttpStatus.OK);
    }


    @PostMapping
    public ResponseEntity<Inventory> addInventory(@RequestBody Inventory inventory) {
        Inventory savedInventory = inventoryService.addItem(inventory);
        return new ResponseEntity<>(savedInventory, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Inventory> findInventoryById(@PathVariable Long id) {
        Inventory inventory = inventoryService.findById(id);
        return new ResponseEntity<>(inventory, HttpStatus.OK);
    }

    @PostMapping("/{id}/restock")
    public ResponseEntity<Inventory> restockInventory(@PathVariable Long id, @RequestBody InventoryRequest inventoryRequest) {
        Inventory restockedInventory = inventoryService.restockItem(id, inventoryRequest.getQuantity(), inventoryRequest.getPurchasePrice());
        return new ResponseEntity<>(restockedInventory, HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteInventory(@PathVariable Long id) {
        inventoryService.deleteItem(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
