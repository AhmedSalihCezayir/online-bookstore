package bookstore.customer;

import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;

public interface CustomerService {
    List<Customer> findAll();

    Customer findById(Long id);

    Customer save(Customer customer);

    void deleteById(Long id);
}

