package GenderHealthCareSystem.service;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.paypal.api.payments.Payment;

import GenderHealthCareSystem.model.ConsultationBooking;
import GenderHealthCareSystem.model.Invoice;
import GenderHealthCareSystem.repository.ConsultantInvoiceRepository;
import GenderHealthCareSystem.repository.ConsultantProfileRepository;
import GenderHealthCareSystem.repository.ConsultationBookingRepository;
import lombok.RequiredArgsConstructor;
import GenderHealthCareSystem.enums.BookingStatus;

@Service
@RequiredArgsConstructor
public class ConsultantInvoiceService {

    private final ConsultantInvoiceRepository invoiceRepo;
    private final ConsultationBookingRepository bookingRepo;
    private final ConsultantProfileRepository consultantProfileRepo;
    private final EmailService emailService; // Thêm EmailService để gửi thông báo

    public void createInvoiceFromPayPal(Payment payment) {
        Integer bookingId = Integer.parseInt(payment.getTransactions().get(0).getCustom());
        ConsultationBooking booking = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking không tồn tại"));

        Double paidAmount = Double.valueOf(payment.getTransactions().get(0).getAmount().getTotal());
        Double hourlyRateVND = booking.getConsultant().getConsultantProfile().getHourlyRate();
        Double hourlyRateUSD = Math.round((hourlyRateVND / 26000) * 100.0) / 100.0; // Convert VND to USD with rounding

        System.out.println(">>> [PAYPAL] Paid USD = " + paidAmount + ", Hourly Rate USD = " + hourlyRateUSD);

        if (Math.abs(paidAmount - hourlyRateUSD) > 0.01) { // Allow minor differences due to rounding
            throw new IllegalArgumentException("Số tiền thanh toán không khớp!");
        }

        Invoice invoice = booking.getInvoice();
        if (invoice == null) {
            invoice = new Invoice();
            invoice.setConsultationBooking(booking);
        }

        invoice.setTotalAmount(hourlyRateUSD); // Use hourlyRateUSD for consistency
        invoice.setCurrency("USD");
        invoice.setPaymentMethod("PAYPAL");
        invoice.setTransactionId(payment.getId());
        invoice.setPaidAt(LocalDateTime.now());
        invoiceRepo.save(invoice);

        booking.setInvoice(invoice);
        booking.setPaymentStatus("PAID");
        booking.setStatus(BookingStatus.CONFIRMED);
        bookingRepo.save(booking);
    }

    public void createInvoiceFromVNPay(Map<String, String> params) {
        Integer bookingId = Integer.parseInt(params.get("vnp_TxnRef"));
        ConsultationBooking booking = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking không tồn tại"));

        Double paidAmount = Double.parseDouble(params.get("vnp_Amount")) / 100;
        Double hourlyRate = booking.getConsultant().getConsultantProfile().getHourlyRate(); // Lấy trực tiếp hourlyRate

        System.out.println(">>> [VNPAY] Paid VND = " + paidAmount + ", Hourly Rate VND = " + hourlyRate);

        if (!paidAmount.equals(hourlyRate)) {
            throw new IllegalArgumentException("Số tiền thanh toán không khớp!");
        }

        Invoice invoice = booking.getInvoice();
        if (invoice == null) {
            invoice = new Invoice();
            invoice.setConsultationBooking(booking);
        }

        invoice.setTotalAmount(hourlyRate); // Sử dụng hourlyRate thay vì totalAmount
        invoice.setCurrency("VND");
        invoice.setPaymentMethod("VNPAY");
        invoice.setTransactionId(params.get("vnp_TransactionNo"));
        invoice.setPaidAt(LocalDateTime.now());
        invoiceRepo.save(invoice);

        booking.setInvoice(invoice);
        booking.setPaymentStatus("PAID");
        booking.setStatus(BookingStatus.CONFIRMED);
        bookingRepo.save(booking);
    }

    private BigDecimal calculateFee(ConsultationBooking booking) {
        Integer consultantId = booking.getConsultant().getUserId();

        var profile = consultantProfileRepo.findByConsultantUserId(consultantId)
                .orElseThrow(() -> new IllegalArgumentException("Consultant profile not found"));

        return BigDecimal.valueOf(profile.getHourlyRate());
    }

    public void updateMeetingLink(Integer bookingId, String meetingLink) {
        ConsultationBooking booking = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking không tồn tại"));

        booking.setMeetLink(meetingLink);
        bookingRepo.save(booking);

        // Gửi email thông báo link meeting
        String subject = "Thông báo link meeting cho buổi tư vấn";
        String message = "Link meeting của bạn: " + meetingLink;

        String customerEmail = booking.getCustomer().getAccount().getEmail();
        String consultantEmail = booking.getConsultant().getAccount().getEmail();

        emailService.sendFertilityNotificationEmail(customerEmail, subject, message);
        emailService.sendFertilityNotificationEmail(consultantEmail, subject, message);
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
        if (invoice == null) {
            throw new RuntimeException("Invoice không tồn tại");
        }

        long hoursBefore = Duration.between(LocalDateTime.now(), booking.getBookingDate()).toHours();
        double rate = hoursBefore >= 24 ? 1.0 : (hoursBefore >= 2 ? 0.5 : 0.0);
        double refundAmount = invoice.getTotalAmount() * rate;

        booking.setStatus(BookingStatus.CANCELLED);
        booking.setPaymentStatus(rate > 0 ? "REFUND_PENDING" : "NON_REFUNDABLE");

        invoice.setRefundAmount(refundAmount);
        invoice.setRefundStatus(rate > 0 ? "REFUND_PENDING" : "NOT_ELIGIBLE");

        bookingRepo.save(booking);
        invoiceRepo.save(invoice);

        return rate > 0 ? "Yêu cầu hoàn tiền " + (int) (rate * 100) + "% đã được ghi nhận"
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
        booking.setStatus(BookingStatus.RESCHEDULED);
        bookingRepo.save(booking);
        return "Đã đổi lịch thành công";
    }

    public Optional<Invoice> getInvoiceByBooking(Integer bookingId) {
        return invoiceRepo.findByConsultationBookingBookingId(bookingId);
    }
}
