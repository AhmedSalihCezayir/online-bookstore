package bookstore.address;

import java.util.List;

public interface AddressService {

    List<Address> findAllByCustomer(Long customerId);

    Address findByCustomerAndId(Long customerId, Long id);

    Address save(Long customerId, Address address);

    void deleteById(Long id);
}

