package bookstore.book;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Book {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String authorName;

    @Column(nullable = false)
    private String publisher;

    @Column(nullable = false)
    private String publicationYear;

    @Column(nullable = false, length = 13, unique = true)
    @Size(min = 13, max = 13, message = "ISBN must be exactly 13 characters long")
    private String isbn;

    @Column(nullable = false)
    private Integer pageNumber;

    @Column(nullable = false)
    private Double price;

    @Column()
    private Long countVisit;

}
