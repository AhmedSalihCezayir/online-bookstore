package bookstore.address;

import bookstore.customer.Customer;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/customers/{customerId}/addresses")
@RequiredArgsConstructor
public class AddressController {

    private final AddressService addressService;

    @GetMapping
    public ResponseEntity<List<Address>> findAllAddressesByCustomer(@PathVariable Long customerId) {
        List<Address> addresses = addressService.findAllByCustomer(customerId);
        return new ResponseEntity<>(addresses, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Address> findByCustomer(@PathVariable Long customerId, @PathVariable Long id) {
        Address address = addressService.findByCustomerAndId(customerId, id);
        return new ResponseEntity<>(address, HttpStatus.OK);
    }

    @PostMapping
    public  ResponseEntity<Address> addAddress(@PathVariable Long customerId, @RequestBody Address address) {
        Address savedAddress = addressService.save(customerId, address);
        return new ResponseEntity<>(savedAddress, HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAddress(@PathVariable Long id) {
        addressService.deleteById(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
