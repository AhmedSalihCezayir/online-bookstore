package bookstore.book;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;


@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    @Query("SELECT DISTINCT b FROM Book b " +
            "LEFT JOIN b.genres g " +
            "WHERE (:title IS NULL OR b.title LIKE %:title%)" +
            "AND (:author IS NULL OR b.authorName LIKE %:author%)" +
            "AND (:publisher IS NULL OR b.publisher LIKE %:publisher%)" +
            "AND (:publicationYear IS NULL OR b.publicationYear = :publicationYear)" +
            "AND (:genreId IS NULL OR g.id = :genreId) "
    )
    Page<Book> findBooksByCriteria(String title, String author, String publisher, String publicationYear, Long genreId, Pageable pageable);
}
