package bookstore.customer;

import bookstore.commons.dto.CustomerDto;

import java.util.List;

public interface CustomerService {
    List<Customer> findAll();

    Customer findById(Long id);

    CustomerDto me(String email);

    Customer save(Customer customer);

    void deleteById(Long id);
}

