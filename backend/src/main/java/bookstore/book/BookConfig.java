package bookstore.book;

import bookstore.genre.Genre;
import bookstore.genre.GenreRepository;
import bookstore.inventory.Inventory;
import bookstore.inventory.InventoryRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.BufferedReader;
import java.io.FileReader;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Random;

@Configuration
public class BookConfig {

    @Bean
    CommandLineRunner commandLineRunner(BookRepository bookRepository, GenreRepository genreRepository, InventoryRepository inventoryRepository) {
        return args -> {
            String csvFile = "src/main/resources/books.csv";
            BufferedReader br = null;
            String line;
            String csvSplitBy = ",";
            try {
                Genre mystery = new Genre();
                mystery.setName("Mystery");
                Genre fantasy = new Genre();
                fantasy.setName("Fantasy");
                Genre science = new Genre();
                science.setName("Science");
                Genre fiction = new Genre();
                fiction.setName("Fiction");
                Genre romance = new Genre();
                romance.setName("Romance");
                Genre historical = new Genre();
                historical.setName("Historical");
                Genre biography = new Genre();
                biography.setName("Biography");
                List<Genre> genres = genreRepository.saveAll(List.of(mystery, fantasy, science, fiction, romance, historical, biography));


                br = new BufferedReader(new FileReader(csvFile));
                // Skip the header line if present
                br.readLine();

                while ((line = br.readLine()) != null) {
                    String[] data = line.split(csvSplitBy);

                    // Create a new Book object
                    Book book = new Book();
                    book.setTitle(data[0]);
                    book.setAuthorName(data[1]);
                    book.setIsbn(data[2]);
                    book.setPageNumber(Integer.parseInt(data[3]));
                    book.setPublicationYear(data[4]);
                    book.setPublisher(data[5]);
                    book.setPrice(Double.parseDouble(data[6]));
                    book.setCountVisit(Long.parseLong(data[7]));

                    // Assign random genres to the book
                    Random random = new Random();
                    Genre randomGenre = genres.get(random.nextInt(genres.size()));
                    List<Genre> bookGenres = new ArrayList<>();
                    bookGenres.add(randomGenre);
                    book.setGenres(bookGenres);

                    // Save the book to the database
                    Book savedBook = bookRepository.save(book);

                    Inventory inventory = new Inventory();
                    inventory.setBook(savedBook);
                    inventory.setQuantity(10);
                    inventory.setPurchasePrice(savedBook.getPrice());
                    inventory.setLastAcquired(new Date());

                    inventoryRepository.save(inventory);
                }

                System.out.println("Books created and saved successfully.");

            } catch (Exception e) {
                System.out.println("Books have already existed.");
            } finally {
                if (br != null) {
                    try {
                        br.close();
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            }
        };
    }
}
