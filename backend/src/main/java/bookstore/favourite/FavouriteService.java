package bookstore.favourite;

import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;

public interface FavouriteService {

    List<Favourite> findAllByCustomer(Long customerId);

    Favourite save(Long customerId, Long bookId);

    void delete(Long customerId, Long bookId);
}
