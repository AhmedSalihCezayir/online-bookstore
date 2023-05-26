package bookstore.coupon;

import bookstore.commons.CouponCheckRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/coupons")
@RequiredArgsConstructor
public class CouponController {

    private final CouponService couponService;

    @PostMapping
    public ResponseEntity<Coupon> validateCoupon(@RequestBody CouponCheckRequest couponCheckRequest) {
        Coupon validatedCoupon = couponService.validateCoupon(couponCheckRequest.getCouponCode());
        return new ResponseEntity<>(validatedCoupon, HttpStatus.OK);
    }
}
