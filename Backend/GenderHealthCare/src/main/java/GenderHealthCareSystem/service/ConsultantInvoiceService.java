package GenderHealthCareSystem.service;

import GenderHealthCareSystem.repository.ConsultantProfileRepository;
import com.paypal.api.payments.Payment;
import GenderHealthCareSystem.model.ConsultationBooking;
import GenderHealthCareSystem.model.Invoice;
import GenderHealthCareSystem.repository.ConsultantInvoiceRepository;
import GenderHealthCareSystem.repository.ConsultationBookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ConsultantInvoiceService {

    private final ConsultantInvoiceRepository invoiceRepo;
    private final ConsultationBookingRepository bookingRepo;
    private final GoogleCalendarService googleCalendarService;
    private final ConsultantProfileRepository consultantProfileRepo;

    public void createInvoiceFromPayPal(Payment payment) {
        Integer bookingId = Integer.parseInt(payment.getTransactions().get(0).getCustom());
        ConsultationBooking booking = bookingRepo.findById(bookingId).orElseThrow(() -> new IllegalArgumentException("Booking không tồn tại"));

        // Lấy số tiền thực tế user đã thanh toán từ PayPal
        Double paidAmount = Double.valueOf(payment.getTransactions().get(0).getAmount().getTotal());
        Double expectedAmount = calculateFee(booking).doubleValue();
        if (!paidAmount.equals(expectedAmount)) {
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
        } catch (Exception e) {
            throw new RuntimeException("Không thể tạo Google Meet link", e);
        }

        bookingRepo.save(booking);
    }

    public void createInvoiceFromVNPay(Map<String, String> params) {
        Integer bookingId = Integer.parseInt(params.get("vnp_TxnRef"));
        ConsultationBooking booking = bookingRepo.findById(bookingId).orElseThrow(() -> new IllegalArgumentException("Booking không tồn tại"));

        // Lấy số tiền thực tế user đã thanh toán từ VNPAY
        Double paidAmount = Double.valueOf(params.get("vnp_Amount")) / 100;
        Double expectedAmount = calculateFee(booking).doubleValue();
        if (!paidAmount.equals(expectedAmount)) {
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
        } catch (Exception e) {
            throw new RuntimeException("Không thể tạo Google Meet link", e);
        }

        bookingRepo.save(booking);
    }
    private BigDecimal calculateFee(ConsultationBooking booking) {
        Integer consultantId = booking.getConsultant().getUserId();

        var profile = consultantProfileRepo.findByConsultantUserId(consultantId)
                .orElseThrow(() -> new IllegalArgumentException("Consultant profile not found"));

        return BigDecimal.valueOf(profile.getHourlyRate());
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
