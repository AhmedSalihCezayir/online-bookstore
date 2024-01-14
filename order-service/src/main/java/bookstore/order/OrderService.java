package bookstore.order;

import bookstore.commons.dto.OrderDto;
import bookstore.commons.dto.OrderRequest;

import java.util.List;

public interface OrderService {

    List<OrderDto> getOrdersByCustomer(Long customerId);

    OrderDto getOrderById(Long orderId);

    List<OrderDto> getAllOrders();

    OrderDto makeOrder(Long customerId, OrderRequest orderRequest);
}
