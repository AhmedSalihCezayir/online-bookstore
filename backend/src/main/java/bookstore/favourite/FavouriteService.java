package bookstore.favourite;

import bookstore.book.Book;

import java.util.List;

public interface FavouriteService {

    List<Favourite> findAllByCustomer(Long customerId);

    Favourite save(Long customerId, Long bookId);

    void delete(Long customerId, Long bookId);
}
