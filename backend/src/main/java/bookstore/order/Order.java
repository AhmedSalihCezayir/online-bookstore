package bookstore.order;

import bookstore.coupon.Coupon;
import bookstore.customer.Customer;
import bookstore.orderbook.OrderBook;
import bookstore.payment.Payment;
import bookstore.shipping.Shipping;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "OrderEntity")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "customerId", nullable = false)
    private Customer customer;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "couponId")
    private Coupon coupon;

    @Column(nullable = false)
    private Date orderDate;

    @OneToMany(mappedBy = "order", cascade = CascadeType.REMOVE)
    private List<OrderBook> orderBooks;

    @OneToOne(mappedBy = "order", cascade = CascadeType.REMOVE)
    private Payment payment;

    @OneToOne(mappedBy = "order", cascade = CascadeType.REMOVE)
    private Shipping shipping;

    @Transient
    private BigDecimal totalPrice;

    @Transient
    private BigDecimal discountedPrice;

    @PrePersist
    protected void onCreate() {
        this.orderDate = new Date();
    }

    public void calculatePrices() {
        totalPrice = BigDecimal.valueOf(orderBooks.stream()
                .mapToDouble(orderBook -> orderBook.getBook().getPrice() * orderBook.getQuantity())
                .sum());

        discountedPrice = totalPrice;
        if (coupon != null) {
            BigDecimal discountAmountBigDecimal = BigDecimal.valueOf(coupon.getDiscountAmount());
            discountedPrice = totalPrice.multiply(BigDecimal.ONE.subtract(discountAmountBigDecimal));
        }
    }
}
