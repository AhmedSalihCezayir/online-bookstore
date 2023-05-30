package bookstore.order;

import bookstore.commons.OrderDto;
import bookstore.commons.OrderRequest;

import java.util.List;

public interface OrderService {

    List<OrderDto> getOrdersByCustomer(Long customerId);

    OrderDto getOrderById(Long orderId);

    OrderDto makeOrder(Long customerId, OrderRequest orderRequest);
}
