package bookstore.favourite;

import bookstore.book.Book;
import bookstore.book.BookRepository;
import bookstore.customer.Customer;
import bookstore.customer.CustomerRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FavouriteServiceImpl implements FavouriteService{

    private final FavouriteRepository favouriteRepository;

    private final CustomerRepository customerRepository;

    private final BookRepository bookRepository;

    @Override
    public List<Favourite> findAllByCustomer(Long customerId) {
        return favouriteRepository.findAllByCustomer_Id(customerId);
    }

    @Override
    public Favourite save(Long customerId, Long bookId) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Customer not found"));
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Book not found"));
        Favourite favourite = new Favourite();
        favourite.setCustomer(customer);
        favourite.setBook(book);
        return favouriteRepository.save(favourite);
    }

    @Transactional
    @Override
    public void delete(Long customerId, Long bookId) {
        if(!favouriteRepository.existsByCustomer_IdAndBook_Id(customerId, bookId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Favoruite not found");
        }
        favouriteRepository.deleteByCustomer_IdAndBook_Id(customerId, bookId);
    }
}
