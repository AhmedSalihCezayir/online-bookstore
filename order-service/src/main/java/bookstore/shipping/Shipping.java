package bookstore.shipping;

import bookstore.address.Address;
import bookstore.commons.dto.ShippingDto;
import bookstore.order.Order;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Random;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Shipping {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @OneToOne(cascade = CascadeType.REMOVE)
    @JoinColumn(name = "orderId", unique = true, nullable = false)
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "addressId", nullable = false)
    private Address address;

    @Column(nullable = false, unique = true)
    private Long trackingNo;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private ShippingDto.Company company;

    public void generateTrackingNumber() {
        trackingNo = Long.valueOf(order.getId() + "" + System.currentTimeMillis());
    }

    public void assignCompany() {
        ShippingDto.Company[] companies = ShippingDto.Company.values();
        Random random = new Random();
        int index = random.nextInt(companies.length);
        company = companies[index];
    }
}
