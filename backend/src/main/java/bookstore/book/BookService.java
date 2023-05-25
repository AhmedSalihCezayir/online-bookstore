package bookstore.book;

import java.util.List;

public interface BookService {

    Page<Book> findBooksByCriteria(String title, String author, String publisher, String publicationYear, String orderBy, Long genreId, Pageable pageable);

    Book findById(Long id);

    Book save(Book book);

    void deleteById(Long id);
}
