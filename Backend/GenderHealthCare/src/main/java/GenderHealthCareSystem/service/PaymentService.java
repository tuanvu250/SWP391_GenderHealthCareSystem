package GenderHealthCareSystem.service;

import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.Map;

@Service
public class PaymentService {

    public String generateVnPayUrl(BigDecimal amount, String orderInfo, Integer bookingId, String ipAddress) {
        // Generate VNPAY payment URL with required parameters
        String vnpTmnCode = "IGXBSMEO";
        String vnpReturnUrl = "http://localhost:8080/payment/vn-pay-callback";
        String vnpHashSecret = "HAMS4XOHN2TVP2O8454WXIUYPQEUFUSH";

        // Convert amount to integer format (e.g., 10000 for 100.00)
        int vnpAmount = amount.multiply(BigDecimal.valueOf(100)).intValue();

        // Generate secure hash
        String secureHash = generateSecureHash(vnpTmnCode, vnpAmount, orderInfo, vnpReturnUrl, vnpHashSecret);

        return "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_TmnCode=" + vnpTmnCode +
               "&vnp_Amount=" + vnpAmount +
               "&vnp_OrderInfo=" + orderInfo +
               "&vnp_ReturnUrl=" + vnpReturnUrl +
               "&vnp_SecureHash=" + secureHash;
    }

    private String generateSecureHash(String tmnCode, int amount, String orderInfo, String returnUrl, String hashSecret) {
        // Example logic to generate secure hash
        String data = tmnCode + amount + orderInfo + returnUrl;
        return org.apache.commons.codec.digest.HmacUtils.hmacSha256Hex(hashSecret, data);
    }

    public String generatePayPalUrl(BigDecimal amount, Integer bookingId) {
        // Generate PayPal payment URL with required parameters
        String returnUrl = "http://localhost:8080/payment/paypal-success";
        String cancelUrl = "http://localhost:8080/payment/paypal-cancel";

        return "https://www.sandbox.paypal.com/cgi-bin/webscr?cmd=_express-checkout" +
               "&amount=" + amount +
               "&bookingId=" + bookingId +
               "&return=" + returnUrl +
               "&cancel_return=" + cancelUrl;
    }

    public Integer handleCallback(Map<String, String> params) {
        // Logic to handle payment callback and extract bookingId
        if ("00".equals(params.get("responseCode"))) {
            return Integer.parseInt(params.get("bookingId"));
        } else {
            throw new IllegalArgumentException("Payment failed or invalid response");
        }
    }
}

