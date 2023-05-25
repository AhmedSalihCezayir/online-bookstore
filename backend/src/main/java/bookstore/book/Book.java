package bookstore.book;

import bookstore.favourite.Favourite;
import bookstore.genre.Genre;
import bookstore.inventory.Inventory;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;

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

    @Column(nullable = false, length = 13)
    @Size(min = 13, max = 13, message = "ISBN must be exactly 13 characters long")
    private String isbn;

    @Column(nullable = false)
    private Integer pageNumber;

    @Column(nullable = false)
    private Double price;

    @Column()
    private Long countVisit;

    @ManyToMany
    @JoinTable(
            name = "book_genre",
            joinColumns = @JoinColumn(name = "book_id"),
            inverseJoinColumns = @JoinColumn(name = "genre_id"))
    private List<Genre> genres;

    @JsonIgnore
    @OneToMany(mappedBy = "book", cascade = CascadeType.REMOVE)
    private List<Favourite> favourites;

    @JsonIgnore
    @OneToOne(mappedBy = "book", cascade = CascadeType.REMOVE)
    private Inventory inventory;

}
