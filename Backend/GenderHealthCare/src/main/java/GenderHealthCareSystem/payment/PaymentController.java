package GenderHealthCareSystem.payment;

import GenderHealthCareSystem.dto.ApiResponse;
import GenderHealthCareSystem.model.StisBooking;
import GenderHealthCareSystem.model.StisInvoice;
import GenderHealthCareSystem.service.StisBookingService;
import GenderHealthCareSystem.service.StisInvoiceService;
import jakarta.persistence.Column;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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
//            String bookingId = fields.get("vnp_TxnRef");
//            String transactionId = fields.get("vnp_TransactionNo");
//
//            StisInvoice invoice = new StisInvoice();
//            invoice.setStisBooking(stisBookingService.getBookingByIdNotForResponse(Integer.parseInt(bookingId)).get());
//            invoice.setTransactionId(transactionId);
//            invoice.setTotalAmount(new BigDecimal(fields.get("vnp_Amount")).divide(BigDecimal.valueOf(100))); // VNPay trả *100
//            invoice.setPaymentMethod("VNPay");
//            invoice.setPaidAt(LocalDateTime.now());
//
//            stisInvoiceService.saveInvoice(invoice);
//            stisBookingService.markBookingPaymentStatusAsCompleted(Integer.parseInt(bookingId));
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
            stisBooking.setPaymentStatus("PAID");
            stisBooking.setStisInvoice(stisInvoice);
            this.stisBookingService.saveBooking(stisBooking);
            return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK, "Invoice is created successfully", null, null));
        }

}
