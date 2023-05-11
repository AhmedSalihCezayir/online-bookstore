package bookstore.address;

import bookstore.customer.Customer;
import bookstore.customer.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AddressServiceImpl implements AddressService {

    private final AddressRepository addressRepository;
    private final CustomerRepository customerRepository;

    @Override
    public List<Address> findAllByCustomer(Long customerId) {
        return customerRepository.findById(customerId).get().getAddresses();
    }

    @Override
    public Address findByCustomerAndId(Long customerId, Long id) {
        List<Address> addresses = customerRepository.findById(customerId).get().getAddresses();
        return addresses.stream()
                .filter(address -> address.getId().equals(id))
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Address not found"));
    }

    @Override
    public Address save(Long customerId, Address address) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Customer not found"));
        address.setCustomer(customer);
        return addressRepository.save(address);
    }

    @Override
    public void deleteById(Long id) {
        if(!addressRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Address not found");
        }
        addressRepository.deleteById(id);
    }
}
