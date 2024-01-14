package bookstore.book;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


public interface BookService {

    Page<Book> findBooksByCriteria(String title, String author, String publisher, String publicationYear, Long genreId, Pageable pageable);

    Book findById(Long id);

    Book save(Book book);

    void deleteById(Long id);
}
