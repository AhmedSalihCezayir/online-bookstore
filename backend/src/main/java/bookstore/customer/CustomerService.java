package bookstore.customer;

import org.springframework.web.bind.annotation.CrossOrigin;
import bookstore.commons.CustomerDto;

import java.util.List;

import java.util.List;

public interface CustomerService {
    List<Customer> findAll();

    Customer findById(Long id);

    CustomerDto me(String email);

    Customer save(Customer customer);

    void deleteById(Long id);
}

