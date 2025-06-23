package GenderHealthCareSystem.payment;

import GenderHealthCareSystem.dto.ApiResponse;
import GenderHealthCareSystem.dto.Order;
import GenderHealthCareSystem.model.StisBooking;
import GenderHealthCareSystem.model.StisInvoice;
import GenderHealthCareSystem.service.StisBookingService;
import GenderHealthCareSystem.service.StisInvoiceService;
import com.paypal.api.payments.Links;
import com.paypal.api.payments.Payment;
import com.paypal.base.rest.PayPalRESTException;
import jakarta.persistence.Column;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final VnPayService vnPayService;
    private final StisInvoiceService stisInvoiceService;
    private final StisBookingService stisBookingService;

    private final PayPalService payPalService;

    public static final String SUCCESS_URL = "http://localhost:8080/api/payment/success";
    public static final String CANCEL_URL = "http://localhost:8080/api/payment/cancel";
    @GetMapping("/vn-pay")
    public ResponseEntity<String> createPayment(@RequestParam long amount,
                                                @RequestParam String orderInfo,
                                                @RequestParam String bookingID,
                                                HttpServletRequest request) throws Exception {
        System.out.println(request.getRemoteAddr());
        String paymentUrl = vnPayService.createPaymentUrl(amount, orderInfo, bookingID, request.getRemoteAddr());
        return ResponseEntity.ok(paymentUrl);
    }

    @GetMapping("/return")
    public ResponseEntity<String> paymentReturn(HttpServletRequest request) throws Exception {
        Map<String, String> fields = new HashMap<>();
        for (Enumeration<String> e = request.getParameterNames(); e.hasMoreElements(); ) {
            String name = e.nextElement();
            System.out.println(request.getParameter(name));
            fields.put(name, request.getParameter(name));
        }
        String secureHash = fields.get("vnp_SecureHash");
        boolean valid = vnPayService.validateReturnData(new HashMap<>(fields), secureHash);
        if (valid) {
            return ResponseEntity.ok("Payment valid: " + fields.get("vnp_ResponseCode"));
        } else {
            return ResponseEntity.badRequest().body("Invalid payment signature");
        }
    }


        @GetMapping("/create-invoice")
        public ResponseEntity<ApiResponse<String>> createInvoice(@RequestParam Map<String, String> allParams) throws UnsupportedEncodingException {
            // 1. Xác minh checksum (đảm bảo không bị giả)
            String vnpSecureHash = allParams.get("vnp_SecureHash");

            if (!vnPayService.validateReturnData(allParams, vnpSecureHash)) {
                return ResponseEntity.badRequest()
                        .body(new ApiResponse<>(HttpStatus.BAD_REQUEST, "Invalid payment signature", null, "INVALID_SIGNATURE"));
            }

            // 2. Kiểm tra mã phản hồi từ VNPAY
            String responseCode = allParams.get("vnp_ResponseCode");
            if (!"00".equals(responseCode)) {
                return ResponseEntity.badRequest()
                        .body(new ApiResponse<>(HttpStatus.BAD_REQUEST, "Payment failed with response code: " + responseCode, null, "PAYMENT_FAILED"));
            }
            //3. Tạo hóa đơn
            StisBooking stisBooking = stisBookingService.getBookingByIdNotForResponse(Integer.parseInt(allParams.get("vnp_TxnRef"))).get();
            StisInvoice invoice = new StisInvoice();
            invoice.setStisBooking(stisBooking);
            invoice.setTransactionId(allParams.get("vnp_TransactionNo"));
            invoice.setTotalAmount(new BigDecimal(allParams.get("vnp_Amount")).divide(BigDecimal.valueOf(100))); // VNPay trả *100
            invoice.setPaymentMethod("VNPay");
            invoice.setPaidAt(LocalDateTime.now());
            StisInvoice stisInvoice= stisInvoiceService.saveInvoice(invoice);
            stisBooking.setPaymentStatus("Đã thanh toán");
            stisBooking.setStisInvoice(stisInvoice);
            this.stisBookingService.saveBooking(stisBooking);
            return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK, "Invoice is created successfully", null, null));
        }

    @PostMapping("/pay")
    public ResponseEntity<?> pay(@RequestBody Order order) {
        try {
            Payment payment = payPalService.createPayment(
                    order.getPrice(),
                    "USD",
                    "paypal",
                    "sale",
                    "Thanh toán đơn hàng",
                    CANCEL_URL,
                    SUCCESS_URL);

            for (Links link : payment.getLinks()) {
                if (link.getRel().equals("approval_url")) {
                    return ResponseEntity.ok(link.getHref());
                }
            }
        } catch (PayPalRESTException e) {
            e.printStackTrace();
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi khi tạo thanh toán");
    }

    @GetMapping("/success")
    public ResponseEntity<String> success(@RequestParam("paymentId") String paymentId,
                                          @RequestParam("PayerID") String payerId) {
        try {
            Payment payment = payPalService.executePayment(paymentId, payerId);
            if ("approved".equals(payment.getState())) {
                return ResponseEntity.ok("Thanh toán thành công!");
            }
        } catch (PayPalRESTException e) {
            e.printStackTrace();
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Thanh toán thất bại");
    }

    @GetMapping("/cancel")
    public ResponseEntity<String> cancel() {
        return ResponseEntity.ok("Hủy thanh toán.");
    }
}


