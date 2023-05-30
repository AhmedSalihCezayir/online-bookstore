package bookstore.customer;

import java.util.List;

import bookstore.commons.CustomerDto;
import bookstore.commons.MeRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;

    @GetMapping("/me")
    public ResponseEntity<CustomerDto> me(@RequestBody MeRequest meRequest) {
        CustomerDto customerDto = customerService.me(meRequest.getEmail());
        return new ResponseEntity<>(customerDto, HttpStatus.OK);
    }


    @GetMapping
    public ResponseEntity<List<Customer>> findAllCustomers() {
        List<Customer> customers = customerService.findAll();
        return new ResponseEntity<>(customers, HttpStatus.OK);
    }

    @GetMapping("/{customerId}")
    public ResponseEntity<Customer> findCustomerById(@PathVariable Long customerId) {
        Customer customer = customerService.findById(customerId);
        return new ResponseEntity<>(customer, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Customer> addCustomer(@RequestBody Customer customer) {
        Customer savedCustomer = customerService.save(customer);
        return new ResponseEntity<>(savedCustomer, HttpStatus.CREATED);
    }

    @DeleteMapping("/{customerId}")
    public ResponseEntity<?> deleteCustomer(@PathVariable Long customerId) {
        customerService.deleteById(customerId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

}

