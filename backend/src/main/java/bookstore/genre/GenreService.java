package bookstore.genre;

import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;

public interface GenreService {

    List<Genre> findAll();

    Genre save(Genre genre);

    void delete(Long genreId);
}
