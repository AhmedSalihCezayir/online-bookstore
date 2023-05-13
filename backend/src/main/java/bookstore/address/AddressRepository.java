package bookstore.address;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface AddressRepository extends JpaRepository<Address, Long> {
    Optional<Address> findByCustomer_IdAndId(Long customer_id, Long id);

    List<Address> findAllByCustomer_Id(Long customer_id);
}
