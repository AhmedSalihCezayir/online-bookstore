package bookstore.favourite;

import bookstore.commons.BookIdRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/customers/{customerId}/favourites")
@RequiredArgsConstructor
public class FavouriteController {

    private final FavouriteService favouriteService;

    @GetMapping
    public ResponseEntity<List<Favourite>> findAllFavouritesByCustomer(@PathVariable Long customerId) {
        List<Favourite> favourites = favouriteService.findAllByCustomer(customerId);
        return new ResponseEntity<>(favourites, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Favourite> addFavourite(@PathVariable Long customerId, @RequestBody BookIdRequest bookIdRequest) {
        Favourite savedFavourite = favouriteService.save(customerId, bookIdRequest.getBookId());
        return new ResponseEntity<>(savedFavourite, HttpStatus.CREATED);
    }

    @DeleteMapping()
    public ResponseEntity<?> deleteFavourite(@PathVariable Long customerId, @RequestBody BookIdRequest bookIdRequest) {
        favouriteService.delete(customerId, bookIdRequest.getBookId());
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
