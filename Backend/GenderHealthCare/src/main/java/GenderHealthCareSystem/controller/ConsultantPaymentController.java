package GenderHealthCareSystem.controller;

import GenderHealthCareSystem.dto.ApiResponse;
import GenderHealthCareSystem.dto.PaymentCallbackRequest;
import GenderHealthCareSystem.service.ConsultantInvoiceService;
import GenderHealthCareSystem.service.PayPalService;
import GenderHealthCareSystem.service.VnPayService;
import com.paypal.api.payments.Links;
import com.paypal.api.payments.Payment;
import com.paypal.base.rest.PayPalRESTException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.UnsupportedEncodingException;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/consultant-payment")
@RequiredArgsConstructor
public class ConsultantPaymentController {

    private final VnPayService vnPayService;
    private final PayPalService payPalService;
    private final ConsultantInvoiceService consultantInvoiceService;

    private static final String SUCCESS_URL = "http://localhost:5173/booking-result";
    private static final String CANCEL_URL = "http://localhost:5173/booking-result";

    @GetMapping("/pay-url")
    public ResponseEntity<String> generatePaymentUrl(@RequestParam Integer bookingId,
                                                     @RequestParam String method,
                                                     HttpServletRequest request) throws Exception {
        String paymentUrl;

        if ("VNPAY".equalsIgnoreCase(method)) {
            paymentUrl = vnPayService.createPaymentUrl(10000, "Consultation", bookingId.toString(), request.getRemoteAddr());
        } else if ("PAYPAL".equalsIgnoreCase(method)) {
            Payment payment = payPalService.createPayment(
                    bookingId.toString(),
                    1000.00,
                    "USD",
                    "paypal",
                    "sale",
                    "Tư vấn sức khỏe",
                    CANCEL_URL,
                    SUCCESS_URL
            );
            paymentUrl = payment.getLinks().stream()
                    .filter(link -> link.getRel().equals("approval_url"))
                    .findFirst()
                    .map(Links::getHref)
                    .orElseThrow(() -> new IllegalArgumentException("No approval URL from PayPal"));
        } else {
            return ResponseEntity.badRequest().body("Phương thức thanh toán không hợp lệ");
        }

        return ResponseEntity.ok(paymentUrl);
    }

    @GetMapping("/success")
    public ResponseEntity<ApiResponse<String>> success(@RequestParam("paymentId") String paymentId,
                                                       @RequestParam("PayerID") String payerId) throws PayPalRESTException {
        Payment payment = payPalService.executePayment(paymentId, payerId);
        if ("approved".equals(payment.getState())) {
            consultantInvoiceService.createInvoiceFromPayPal(payment);
            return ResponseEntity.ok(ApiResponse.success("Thanh toán thành công"));
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.error("Thanh toán thất bại"));
    }

    @GetMapping("/cancel")
    public ResponseEntity<String> cancel() {
        return ResponseEntity.ok("Đã hủy thanh toán");
    }

    @GetMapping("/vn-pay-return")
    public ResponseEntity<ApiResponse<String>> handleVnPayReturn(HttpServletRequest request) throws UnsupportedEncodingException {
        Map<String, String> params = new HashMap<>();
        Enumeration<String> parameterNames = request.getParameterNames();
        while (parameterNames.hasMoreElements()) {
            String paramName = parameterNames.nextElement();
            params.put(paramName, request.getParameter(paramName));
        }

        String secureHash = params.get("vnp_SecureHash");
        boolean isValid = vnPayService.validateReturnData(new HashMap<>(params), secureHash);

        if (!isValid) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Invalid VNPAY signature"));
        }

        String responseCode = params.get("vnp_ResponseCode");
        if (!"00".equals(responseCode)) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Thanh toán thất bại"));
        }

        consultantInvoiceService.createInvoiceFromVNPay(params);
        return ResponseEntity.ok(ApiResponse.success("Hóa đơn đã được tạo thành công"));
    }


}