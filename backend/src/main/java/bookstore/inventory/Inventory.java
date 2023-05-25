package bookstore.inventory;

import bookstore.book.Book;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Inventory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(cascade = CascadeType.REMOVE)
    @JoinColumn(name = "bookId", nullable = false)
    private Book book;

    @Column(nullable = false)
    private Double purchasePrice;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false)
    private Date lastUpdated;

    @Column(nullable = false)
    private Date lastAcquired;

    @PrePersist
    public void setLastUpdated() {
        this.lastUpdated = new Date();
    }

    @PreUpdate
    public void updateLastUpdated() {
        this.lastUpdated = new Date();
    }
}
