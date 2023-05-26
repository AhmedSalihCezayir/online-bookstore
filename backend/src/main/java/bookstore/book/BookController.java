package bookstore.book;

import bookstore.commons.OrderBy;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/books")
@RequiredArgsConstructor
public class BookController {

    private final BookService bookService;

    @GetMapping
    public ResponseEntity<Page<Book>> findAllBooks(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String author,
            @RequestParam(required = false) String publisher,
            @RequestParam(required = false) String publicationYear,
            @RequestParam(required = false) Long genreId,
            @RequestParam(required = false) OrderBy orderBy,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "1") int size
    ) {
        String convertedOrderBy = null;
        if (orderBy != null)
            convertedOrderBy = orderBy.toString();
        Pageable pageable = PageRequest.of(page, size);
        Page<Book> bookPage = bookService.findBooksByCriteria(title, author, publisher, publicationYear, convertedOrderBy, genreId, pageable);
        return new ResponseEntity<>(bookPage, HttpStatus.OK);
    }

    @GetMapping("/{bookId}")
    public ResponseEntity<Book> findBookById(@PathVariable Long bookId) {
        Book book = bookService.findById(bookId);
        return new ResponseEntity<>(book, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Book> addBook(@RequestBody Book book) {
        Book savedBook = bookService.save(book);
        return new ResponseEntity<>(savedBook, HttpStatus.CREATED);
    }

    @DeleteMapping("/{bookId}")
    public ResponseEntity<?> deleteBook(@PathVariable Long bookId) {
        bookService.deleteById(bookId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
