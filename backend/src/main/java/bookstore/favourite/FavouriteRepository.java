package bookstore.favourite;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FavouriteRepository extends JpaRepository<Favourite, Long> {

    List<Favourite> findAllByCustomer_Id(Long customer_id);

    boolean existsByCustomer_IdAndBook_Id(Long customer_id, Long book_id);

    void deleteByCustomer_IdAndBook_Id(Long customer_id, Long book_id);
}
