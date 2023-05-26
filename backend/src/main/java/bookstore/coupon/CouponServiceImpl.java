package bookstore.coupon;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Date;

@Service
@RequiredArgsConstructor
public class CouponServiceImpl implements CouponService{

    private final CouponRepository couponRepository;

    @Override
    public Coupon validateCoupon(String couponCode) {
        Coupon coupon = couponRepository.findByCouponCode(couponCode)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Coupon not found"));
        Date todayDate = new Date();
        if (coupon.getExpirationDate().before(todayDate)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Coupon has already been expired");
        }
        return coupon;
    }
}
