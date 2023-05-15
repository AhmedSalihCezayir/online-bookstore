package bookstore.book;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BookServiceImpl implements BookService{

    private final BookRepository bookRepository;

    @Override
    public List<Book> findAll() {
        return bookRepository.findAll();
    }

    @Override
    public Book findById(Long id) {
        Optional<Book> optionalBook = bookRepository.findById(id);
        if (optionalBook.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Book not found");
        }
        Book book = optionalBook.get();
        book.setCountVisit(book.getCountVisit() + 1);
        bookRepository.save(book);
        return book;
    }

    @Override
    public Book save(Book book) {
        if (book.getId() == null)
            book.setCountVisit(0L);
        else {
            Optional<Book> actualBook = bookRepository.findById(book.getId());
            if(actualBook.isEmpty()) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Book not found");
            }
            book.setCountVisit(actualBook.get().getCountVisit());
        }
        return bookRepository.save(book);
    }

    @Override
    public void deleteById(Long id) {
        if(!bookRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Book not found");
        }
        bookRepository.deleteById(id);
    }
}
