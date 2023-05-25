package bookstore.address;

import bookstore.customer.Customer;
import bookstore.customer.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AddressServiceImpl implements AddressService {

    private final AddressRepository addressRepository;
    private final CustomerRepository customerRepository;

    @Override
    public List<Address> findAllByCustomer(Long customerId) {
        return addressRepository.findAllByCustomer_Id(customerId);
    }

    @Override
    public Address findByCustomerAndId(Long customerId, Long id) {
        Optional<Address> optionalAddress= addressRepository.findByCustomer_IdAndId(customerId, id);
        if(optionalAddress.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Address not found");
        }
        return optionalAddress.get();
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
