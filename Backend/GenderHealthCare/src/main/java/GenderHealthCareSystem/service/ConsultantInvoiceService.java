package GenderHealthCareSystem.service;

import GenderHealthCareSystem.repository.ConsultantProfileRepository;
import com.paypal.api.payments.Payment;
import GenderHealthCareSystem.model.ConsultationBooking;
import GenderHealthCareSystem.model.Invoice;
import GenderHealthCareSystem.repository.ConsultantInvoiceRepository;
import GenderHealthCareSystem.repository.ConsultationBookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ConsultantInvoiceService {

    private static final Logger logger = LoggerFactory.getLogger(ConsultantInvoiceService.class);

    private final ConsultantInvoiceRepository invoiceRepo;
    private final ConsultationBookingRepository bookingRepo;
    private final GoogleCalendarService googleCalendarService;
    private final ConsultantProfileRepository consultantProfileRepo;

    public void createInvoiceFromPayPal(Payment payment) {
        logger.info("Starting PayPal invoice creation for payment ID: {}", payment.getId());
        Integer bookingId = Integer.parseInt(payment.getTransactions().get(0).getCustom());
        logger.info("Retrieved booking ID: {} from PayPal payment", bookingId);

        ConsultationBooking booking = bookingRepo.findById(bookingId)
                .orElseThrow(() -> {
                    logger.error("Booking with ID {} not found", bookingId);
                    return new IllegalArgumentException("Booking không tồn tại");
                });

        Double paidAmount = Double.valueOf(payment.getTransactions().get(0).getAmount().getTotal());
        Double expectedAmount = calculateFee(booking).doubleValue();

        // Convert expectedAmount to USD for PayPal comparison
        final double USD_TO_VND_RATE = 24000.0;
        expectedAmount = expectedAmount / USD_TO_VND_RATE;

        logger.info("Paid amount: {}, Expected amount (converted to USD): {}", paidAmount, expectedAmount);

        // Làm tròn số tiền thanh toán thực tế và dự kiến để tránh sai lệch nhỏ
        BigDecimal roundedPaidAmount = BigDecimal.valueOf(paidAmount).setScale(2, BigDecimal.ROUND_HALF_UP);
        BigDecimal roundedExpectedAmount = BigDecimal.valueOf(expectedAmount).setScale(2, BigDecimal.ROUND_HALF_UP);

        logger.info("Rounded paid amount: {}", roundedPaidAmount);
        logger.info("Rounded expected amount: {}", roundedExpectedAmount);

        if (!roundedPaidAmount.equals(roundedExpectedAmount)) {
            logger.error("Payment amount mismatch after rounding: Paid = {}, Expected = {}", roundedPaidAmount, roundedExpectedAmount);
            throw new IllegalArgumentException("Số tiền thanh toán không khớp!");
        }

        Invoice invoice = new Invoice();
        invoice.setConsultationBooking(booking);
        invoice.setTotalAmount(expectedAmount);
        invoice.setCurrency("USD");
        invoice.setPaymentMethod("PAYPAL");
        invoice.setTransactionId(payment.getId());
        invoice.setPaidAt(LocalDateTime.now());
        invoiceRepo.save(invoice);

        booking.setInvoice(invoice);
        booking.setPaymentStatus("PAID");
        booking.setStatus("CONFIRMED");

        try {
            String meetLink = googleCalendarService.createGoogleMeetLink("Tư vấn với chuyên gia", booking.getBookingDate(), booking.getBookingDate().plusHours(1));
            booking.setMeetLink(meetLink);
            logger.info("Google Meet link created successfully: {}", meetLink);
        } catch (Exception e) {
            logger.error("Failed to create Google Meet link", e);
            throw new RuntimeException("Không thể tạo Google Meet link", e);
        }

        bookingRepo.save(booking);
        logger.info("Invoice and booking updated successfully for booking ID: {}", bookingId);
    }

    public void createInvoiceFromVNPay(Map<String, String> params) {
        logger.info("Starting VNPay invoice creation for transaction: {}", params.get("vnp_TransactionNo"));
        Integer bookingId = Integer.parseInt(params.get("vnp_TxnRef"));
        logger.info("Retrieved booking ID: {} from VNPay transaction", bookingId);

        ConsultationBooking booking = bookingRepo.findById(bookingId)
                .orElseThrow(() -> {
                    logger.error("Booking with ID {} not found", bookingId);
                    return new IllegalArgumentException("Booking không tồn tại");
                });

        Double paidAmount = Double.parseDouble(params.get("vnp_Amount")) / 100;
        Double expectedAmount = calculateFee(booking).doubleValue();
        logger.info("Paid amount: {}, Expected amount: {}", paidAmount, expectedAmount);

        // Làm tròn số tiền thanh toán thực tế và dự kiến để tránh sai lệch nhỏ
        BigDecimal roundedPaidAmount = BigDecimal.valueOf(paidAmount).setScale(2, BigDecimal.ROUND_HALF_UP);
        BigDecimal roundedExpectedAmount = BigDecimal.valueOf(expectedAmount).setScale(2, BigDecimal.ROUND_HALF_UP);

        logger.info("Rounded paid amount: {}", roundedPaidAmount);
        logger.info("Rounded expected amount: {}", roundedExpectedAmount);

        if (!roundedPaidAmount.equals(roundedExpectedAmount)) {
            logger.error("Payment amount mismatch after rounding: Paid = {}, Expected = {}", roundedPaidAmount, roundedExpectedAmount);
            throw new IllegalArgumentException("Số tiền thanh toán không khớp!");
        }

        Invoice invoice = new Invoice();
        invoice.setConsultationBooking(booking);
        invoice.setTotalAmount(expectedAmount);
        invoice.setCurrency("VND");
        invoice.setPaymentMethod("VNPAY");
        invoice.setTransactionId(params.get("vnp_TransactionNo"));
        invoice.setPaidAt(LocalDateTime.now());
        invoiceRepo.save(invoice);

        booking.setInvoice(invoice);
        booking.setPaymentStatus("PAID");
        booking.setStatus("CONFIRMED");

        try {
            String meetLink = googleCalendarService.createGoogleMeetLink("Tư vấn với chuyên gia", booking.getBookingDate(), booking.getBookingDate().plusHours(1));
            booking.setMeetLink(meetLink);
            logger.info("Google Meet link created successfully: {}", meetLink);
        } catch (Exception e) {
            logger.error("Failed to create Google Meet link", e);
            throw new RuntimeException("Không thể tạo Google Meet link", e);
        }

        bookingRepo.save(booking);
        logger.info("Invoice and booking updated successfully for booking ID: {}", bookingId);
    }

    private BigDecimal calculateFee(ConsultationBooking booking) {
        Integer consultantId = booking.getConsultant().getUserId();
        logger.info("Calculating fee for consultant ID: {}", consultantId);

        var profile = consultantProfileRepo.findByConsultantUserId(consultantId)
                .orElseThrow(() -> {
                    logger.error("Consultant profile not found for ID: {}", consultantId);
                    return new IllegalArgumentException("Consultant profile not found");
                });

        Double hourlyRate = profile.getHourlyRate();
        logger.info("Hourly rate for consultant ID {}: {}", consultantId, hourlyRate);

        if (hourlyRate == null || hourlyRate <= 0) {
            logger.error("Invalid hourly rate for consultant ID {}: {}", consultantId, hourlyRate);
            throw new IllegalArgumentException("Consultant hourly rate is not set or invalid");
        }

        BigDecimal fee = BigDecimal.valueOf(hourlyRate).setScale(2, BigDecimal.ROUND_HALF_UP);
        logger.info("Calculated fee for consultant ID {}: {}", consultantId, fee);
        return fee;
    }

    /**
     * Public method để tính phí booking - sử dụng cho payment controller
     */
    public BigDecimal calculateBookingFee(ConsultationBooking booking) {
        return calculateFee(booking);
    }


    public String requestRefund(Integer bookingId, Integer customerId) {
        ConsultationBooking booking = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking không tồn tại"));

        if (!booking.getCustomer().getUserId().equals(customerId)) {
            throw new RuntimeException("Bạn không có quyền hủy booking này");
        }

        if (!"PAID".equalsIgnoreCase(booking.getPaymentStatus())) {
            throw new RuntimeException("Chỉ được hủy booking đã thanh toán");
        }

        Invoice invoice = booking.getInvoice();
        if (invoice == null) throw new RuntimeException("Invoice không tồn tại");

        long hoursBefore = Duration.between(LocalDateTime.now(), booking.getBookingDate()).toHours();
        double rate;
        if (hoursBefore >= 24) rate = 1.0;
        else if (hoursBefore >= 2) rate = 0.5;
        else rate = 0.0;

        double refundAmount = invoice.getTotalAmount() * rate;
        booking.setStatus("CANCELLED");
        booking.setPaymentStatus(rate > 0 ? "REFUND_PENDING" : "NON_REFUNDABLE");

        invoice.setRefundAmount(refundAmount);
        invoice.setRefundStatus(rate > 0 ? "REFUND_PENDING" : "NOT_ELIGIBLE");

        bookingRepo.save(booking);
        invoiceRepo.save(invoice);

        return rate > 0 ? "Yêu cầu hoàn tiền " + (int)(rate * 100) + "% đã được ghi nhận"
                : "Không thể hoàn tiền do hủy quá sát giờ";
    }

    public String rescheduleBooking(Integer bookingId, Integer customerId, LocalDateTime newDateTime) {
        ConsultationBooking booking = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking không tồn tại"));

        if (!booking.getCustomer().getUserId().equals(customerId)) {
            throw new RuntimeException("Bạn không có quyền thay đổi booking này");
        }

        if (!"PAID".equalsIgnoreCase(booking.getPaymentStatus())) {
            throw new RuntimeException("Chỉ được thay đổi booking đã thanh toán");
        }

        if (newDateTime.isBefore(LocalDateTime.now().plusHours(2))) {
            throw new RuntimeException("Phải đặt lại trước ít nhất 2 tiếng");
        }

        booking.setBookingDate(newDateTime);
        booking.setStatus("RESCHEDULED");
        try {
            String meetLink = googleCalendarService.createGoogleMeetLink("Tư vấn đã đổi lịch", newDateTime, newDateTime.plusHours(1));
            booking.setMeetLink(meetLink);
        } catch (Exception e) {
            throw new RuntimeException("Không thể tạo lại Google Meet link", e);
        }

        bookingRepo.save(booking);
        return "Đã đổi lịch thành công";
    }

    public Optional<Invoice> getInvoiceByBooking(Integer bookingId) {
        return invoiceRepo.findByConsultationBookingBookingId(bookingId);
    }
}
