package bookstore.order;

import bookstore.commons.dto.OrderDto;
import bookstore.commons.dto.OrderRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/customers/{id}/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @GetMapping
    public ResponseEntity<List<OrderDto>> getOrdersByCustomer(@PathVariable Long id) {
        List<OrderDto> orderDtos = orderService.getOrdersByCustomer(id);
        return new ResponseEntity<>(orderDtos, HttpStatus.OK);
    }

    @GetMapping("/{order_id}")
    public ResponseEntity<OrderDto> getOrderById(@PathVariable Long order_id) {
        OrderDto orderDto = orderService.getOrderById(order_id);
        return new ResponseEntity<>(orderDto, HttpStatus.OK);
    }

    @GetMapping("/all")
    public ResponseEntity<List<OrderDto>> getAllOrders() {
        List<OrderDto> orderDto = orderService.getAllOrders();
        return new ResponseEntity<>(orderDto, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<OrderDto> makeOrder(@PathVariable Long id, @RequestBody OrderRequest orderRequest) {
        OrderDto savedOrder = orderService.makeOrder(id, orderRequest);
        return new ResponseEntity<>(savedOrder, HttpStatus.CREATED);
    }
}
