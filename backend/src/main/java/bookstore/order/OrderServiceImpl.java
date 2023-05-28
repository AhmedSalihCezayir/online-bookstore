package bookstore.order;

import bookstore.address.Address;
import bookstore.address.AddressRepository;
import bookstore.book.Book;
import bookstore.book.BookRepository;
import bookstore.commons.*;
import bookstore.coupon.Coupon;
import bookstore.coupon.CouponRepository;
import bookstore.customer.Customer;
import bookstore.customer.CustomerRepository;
import bookstore.inventory.Inventory;
import bookstore.inventory.InventoryRepository;
import bookstore.orderbook.OrderBook;
import bookstore.orderbook.OrderBookRepository;
import bookstore.payment.Payment;
import bookstore.payment.PaymentRepository;
import bookstore.shipping.Shipping;
import bookstore.shipping.ShippingRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService{

    private final OrderRepository orderRepository;

    private final OrderBookRepository orderBookRepository;

    private final CouponRepository couponRepository;

    private final CustomerRepository customerRepository;

    private final AddressRepository addressRepository;

    private final PaymentRepository paymentRepository;

    private final ShippingRepository shippingRepository;

    private final BookRepository bookRepository;

    private final InventoryRepository inventoryRepository;

    @Override
    public List<OrderDto> getOrdersByCustomer(Long customerId) {
        List<Order> orders = orderRepository.findAllByCustomer_Id(customerId);
        return orders.stream().map(this::mapOrderToDto).collect(Collectors.toList());
    }

    @Transactional
    @Override
    public OrderDto makeOrder(Long customerId, OrderRequest orderRequest) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Customer not found"));
        Coupon coupon;
        if (!orderRequest.getCouponCode().equals("")) {
            coupon = couponRepository.findByCouponCode(orderRequest.getCouponCode())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Coupon not found"));
        }
        else {
            coupon = null;
        }
        Address paymentAddress = addressRepository.findById(orderRequest.getPaymentAddressId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Address not found"));
        Address shippingAddress = addressRepository.findById(orderRequest.getShippingAddressId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Address not found"));
        Order order = new Order();
        order.setCustomer(customer);
        order.setCoupon(coupon);
        Order savedOrder = orderRepository.save(order);

        Payment payment = new Payment();
        payment.setOrder(savedOrder);
        payment.setAddress(paymentAddress);
        Payment savedPayment = paymentRepository.save(payment);

        Shipping shipping = new Shipping();
        shipping.setOrder(savedOrder);
        shipping.setAddress(shippingAddress);
        shipping.generateTrackingNumber();
        shipping.assignCompany();
        Shipping savedShipping = shippingRepository.save(shipping);

        List<OrderBook> orderBooks = new ArrayList<>();
        orderRequest.getBooks().forEach(orderBookRequest -> {
            OrderBook orderBook = new OrderBook();
            Book book = bookRepository.findById(orderBookRequest.getBookId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Book not found"));
            Inventory inventory = inventoryRepository.findByBook_Id(book.getId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Inventory not found"));
            if (inventory.getQuantity() < orderBookRequest.getQuantity()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Not Enough Stock for" + book.getTitle());
            }
            orderBook.setOrder(savedOrder);
            orderBook.setQuantity(orderBookRequest.getQuantity());
            orderBook.setBook(book);
            orderBooks.add(orderBookRepository.save(orderBook));
            inventory.setQuantity(inventory.getQuantity() - orderBookRequest.getQuantity());
            inventoryRepository.save(inventory);
        });

        savedOrder.setPayment(savedPayment);
        savedOrder.setShipping(savedShipping);
        savedOrder.setOrderBooks(orderBooks);
        return mapOrderToDto(savedOrder);
    }

    private OrderDto mapOrderToDto(Order order) {
        OrderDto orderDto = new OrderDto();
        orderDto.setId(order.getId());
        if (order.getCoupon() != null)
            orderDto.setCouponCode(order.getCoupon().getCouponCode());
        else
            orderDto.setCouponCode("");
        orderDto.setPayment(mapPaymentToDto(order.getPayment()));
        orderDto.setShipping(mapShippingToDto(order.getShipping()));
        orderDto.setOrderDate(order.getOrderDate());
        orderDto.setBooks(mapOrderBooksToDto(order.getOrderBooks()));
        order.calculatePrices();
        orderDto.setTotalPrice(order.getTotalPrice());
        orderDto.setDiscountedPrice(order.getDiscountedPrice());
        return orderDto;
    }

    private List<OrderBookDto> mapOrderBooksToDto(List<OrderBook> orderBooks) {
        return orderBooks.stream().map(this::mapOrderBookToDto).collect(Collectors.toList());
    }

    private OrderBookDto mapOrderBookToDto(OrderBook orderBook) {
        OrderBookDto orderBookDto = new OrderBookDto();
        orderBookDto.setBook(mapBookToDto(orderBook.getBook()));
        orderBookDto.setQuantity(orderBook.getQuantity());
        return orderBookDto;
    }

    private BookDto mapBookToDto(Book book) {
        BookDto bookDto = new BookDto();
        bookDto.setId(book.getId());
        bookDto.setTitle(book.getTitle());
        bookDto.setPrice(book.getPrice());
        return bookDto;
    }

    private PaymentDto mapPaymentToDto(Payment payment) {
        PaymentDto paymentDto = new PaymentDto();
        paymentDto.setId(payment.getId());
        paymentDto.setAddress(mapAddressToDto(payment.getAddress()));
        paymentDto.setDate(payment.getDate());
        return paymentDto;
    }

    private ShippingDto mapShippingToDto(Shipping shipping) {
        ShippingDto shippingDto = new ShippingDto();
        shippingDto.setId(shipping.getId());
        shippingDto.setAddress(mapAddressToDto(shipping.getAddress()));
        shippingDto.setTrackingNo(shipping.getTrackingNo());
        shippingDto.setCompany(shipping.getCompany());
        return shippingDto;
    }

    private AddressDto mapAddressToDto(Address address) {
        AddressDto addressDto = new AddressDto();
        addressDto.setId(address.getId());
        addressDto.setStreetAddress(address.getStreetAddress());
        addressDto.setCity(address.getCity());
        addressDto.setCountry(address.getCountry());
        addressDto.setState(address.getState());
        addressDto.setPostalCode(address.getPostalCode());
        return addressDto;
    }
}
