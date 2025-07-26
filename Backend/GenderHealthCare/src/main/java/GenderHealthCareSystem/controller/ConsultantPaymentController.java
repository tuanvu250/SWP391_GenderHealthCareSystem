package GenderHealthCareSystem.controller;

import GenderHealthCareSystem.dto.ApiResponse;
import GenderHealthCareSystem.service.ConsultantInvoiceService;
import GenderHealthCareSystem.service.PayPalService;
import GenderHealthCareSystem.service.VnPayService;
import GenderHealthCareSystem.model.ConsultationBooking;
import GenderHealthCareSystem.repository.ConsultationBookingRepository;
import com.paypal.api.payments.Links;
import com.paypal.api.payments.Payment;
import com.paypal.base.rest.PayPalRESTException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.UnsupportedEncodingException;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;
import java.util.Timer;
import java.util.TimerTask;

import GenderHealthCareSystem.enums.BookingStatus;

@RestController
@RequestMapping("/api/consultant-payment")
@RequiredArgsConstructor
public class ConsultantPaymentController {

    private static final Logger logger = LoggerFactory.getLogger(ConsultantPaymentController.class);

    private final VnPayService vnPayService;
    private final PayPalService payPalService;
    private final ConsultantInvoiceService consultantInvoiceService;
    private final ConsultationBookingRepository bookingRepository;

         private static final String SUCCESS_URL = "http://14.225.192.28/booking-result";
         private static final String CANCEL_URL = "http://14.225.192.28/booking-result";

//    private static final String SUCCESS_URL = "http://localhost:8080/api/consultant-payment/success";
//    private static final String CANCEL_URL = "http://localhost:8080/api/consultant-payment/cancel";

//    private static final String SUCCESS_URL = "http://localhost:8080/api/consultant-payment/success";
//    private static final String CANCEL_URL = "http://localhost:8080/api/consultant-payment/cancel";

    @GetMapping("/pay-url")
    public ResponseEntity<String> generatePaymentUrl(@RequestParam Integer bookingId,
                                                     @RequestParam String method,
                                                     HttpServletRequest request) throws Exception {
        logger.info("Generating payment URL for booking ID: {} with method: {}", bookingId, method);

        ConsultationBooking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> {
                    logger.error("Booking with ID {} not found", bookingId);
                    return new IllegalArgumentException("Booking không tồn tại");
                });

        if (booking.getStatus() == BookingStatus.PENDING) {
            booking.setStatus(BookingStatus.PROCESSING);
            bookingRepository.save(booking);
        }

        Double hourlyRate = booking.getConsultant().getConsultantProfile().getHourlyRate(); // Fixed access to hourlyRate
        logger.info("Hourly rate for booking ID {}: {}", bookingId, hourlyRate);

        String paymentUrl;

        if ("VNPAY".equalsIgnoreCase(method)) {
            long vnpayAmount = hourlyRate.longValue();
            logger.info("VNPAY amount for booking ID {}: {}", bookingId, vnpayAmount);
            paymentUrl = vnPayService.createPaymentUrl(vnpayAmount, "Consultation", bookingId.toString(), request.getRemoteAddr());
        } else if ("PAYPAL".equalsIgnoreCase(method)) {
            double usdAmount =  Math.round((hourlyRate / 26000) * 100.0) / 100.0;; // Directly use hourlyRate
            logger.info("PayPal amount (USD) for booking ID {}: {}", bookingId, usdAmount);
            Payment payment = payPalService.createPayment(
                    bookingId.toString(),
                    usdAmount,
                    "USD",
                    "paypal",
                    "sale",
                    "Tư vấn sức khỏe",
                    CANCEL_URL + "?bookingId=" + bookingId,
                    SUCCESS_URL + "?bookingId=" + bookingId
            );
            paymentUrl = payment.getLinks().stream()
                    .filter(link -> link.getRel().equals("approval_url"))
                    .findFirst()
                    .map(Links::getHref)
                    .orElseThrow(() -> {
                        logger.error("No approval URL returned by PayPal for booking ID {}", bookingId);
                        return new IllegalArgumentException("No approval URL from PayPal");
                    });
        } else {
            logger.error("Invalid payment method: {}", method);
            return ResponseEntity.badRequest().body("Phương thức thanh toán không hợp lệ");
        }

        // Schedule a task to reset the slot status if payment is not completed within 15 minutes
        scheduleSlotReset(bookingId);

        logger.info("Generated payment URL for booking ID {}: {}", bookingId, paymentUrl);
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
    public ResponseEntity<String> cancel(@RequestParam(required = false) Integer bookingId) {
        if (bookingId == null) {
            return ResponseEntity.badRequest().body("Thiếu tham số 'bookingId'. Vui lòng cung cấp ID của booking cần hủy.");
        }

        ConsultationBooking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking không tồn tại"));

        // Update booking status to PENDING if currently PROCESSING
        if (booking.getStatus() == BookingStatus.PROCESSING) {
            booking.setStatus(BookingStatus.PENDING);
            bookingRepository.save(booking);
        }

        return ResponseEntity.ok("Thanh toán đã hủy và trạng thái booking đã được cập nhật thành PENDING.");
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

    private void scheduleSlotReset(Integer bookingId) {
        // Schedule a task to reset the slot status after 15 minutes
        new Timer().schedule(new TimerTask() {
            @Override
            public void run() {
                ConsultationBooking booking = bookingRepository.findById(bookingId).orElse(null);
                if (booking != null && booking.getStatus() == BookingStatus.PROCESSING) {
                    booking.setStatus(BookingStatus.CANCELLED); // Change to CANCELLED instead of PENDING
                    bookingRepository.save(booking);
                    logger.info("Slot status reset to CANCELLED for booking ID: {}", bookingId);
                }
            }
        }, 15 * 60 * 1000); // 15 minutes
    }



}