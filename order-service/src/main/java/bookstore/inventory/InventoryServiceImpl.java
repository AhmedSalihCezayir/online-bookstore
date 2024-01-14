package bookstore.inventory;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class InventoryServiceImpl implements InventoryService{

    private final InventoryRepository inventoryRepository;

    @Override
    public List<Inventory> findAll() {
        return inventoryRepository.findAll();
    }

    @Override
    public Inventory addItem(Inventory inventory) {
        return inventoryRepository.save(inventory);
    }

    @Transactional
    @Override
    public Inventory restockItem(Long inventoryId, Integer quantity, Double purchasePrice) {
        Optional<Inventory> optionalInventory = inventoryRepository.findById(inventoryId);
        if (optionalInventory.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Inventory item not found");
        }
        optionalInventory.get().setQuantity(optionalInventory.get().getQuantity() + quantity);
        optionalInventory.get().setPurchasePrice(purchasePrice);
        optionalInventory.get().setLastAcquired(new Date());
        return inventoryRepository.save(optionalInventory.get());
    }

    @Override
    public Inventory findById(Long id) {
        Optional<Inventory> inventoryBook = inventoryRepository.findById(id);
        if (inventoryBook.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Book not found");
        }
        Inventory inventory = inventoryBook.get();
        return inventory;
    }

    @Override
    public void deleteItem(Long id) {
        if(!inventoryRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Inventory item not found");
        }
        inventoryRepository.deleteById(id);
    }
}
