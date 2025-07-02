package GenderHealthCareSystem.service;


import GenderHealthCareSystem.dto.ConsultantBookingRequest;
import GenderHealthCareSystem.dto.ConsultantBookingResponse;
import GenderHealthCareSystem.model.ConsultationBooking;
import GenderHealthCareSystem.model.Users;
import GenderHealthCareSystem.repository.ConsultationBookingRepository;
import GenderHealthCareSystem.repository.UserRepository;
import com.paypal.base.rest.PayPalRESTException;
import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ConsultationBookingService {

    private final ConsultationBookingRepository bookingRepo;
    private final UserRepository userRepository;
    private final InvoiceService invoiceService;
    private final PaymentService paymentService;
    private final VnPayService vnPayService; // Inject VnPayService
    private final PayPalService payPalService; // Inject PayPalService
    private final GoogleCalendarService googleCalendarService; // Inject GoogleCalendarService

    /**
     * Tạo booking mới: PENDING/UNPAID và trả về URL thanh toán
     */
    @Transactional
    public ConsultantBookingResponse createBooking(ConsultantBookingRequest req, Map<String,String> httpInfo) throws IOException, PayPalRESTException {
        // Removed unnecessary `throws Exception` declaration
        LocalDateTime slotStart = req.getBookingDate();
        LocalDateTime slotEnd = slotStart.plusHours(1);
        bookingRepo.findConflict(req.getConsultantId(), slotStart, slotEnd)
                .ifPresent(b -> { throw new IllegalArgumentException("Khung giờ đã được đặt"); });

        ConsultationBooking booking = new ConsultationBooking();

        Users consultant = userRepository.findById(req.getConsultantId())
                .orElseThrow(() -> new IllegalArgumentException("Consultant không tồn tại"));
        booking.setConsultant(consultant);

        Users customer = userRepository.findById(req.getCustomerId())
                .orElseThrow(() -> new IllegalArgumentException("Customer không tồn tại"));
        booking.setCustomer(customer);

        booking.setBookingDate(req.getBookingDate());
        booking.setStatus("PENDING");
        booking.setPaymentStatus("UNPAID");
        booking.setNote(req.getNote());
        booking.setCreatedAt(LocalDateTime.now());
        booking = bookingRepo.save(booking);

        var invoice = invoiceService.createInvoice(booking.getBookingId(), calculateFee(booking));

        String paymentUrl;
        if (req.getPaymentMethod().equalsIgnoreCase("VNPAY")) {
            paymentUrl = vnPayService.createPaymentUrl(invoice.getTotalAmount().longValue(), "Booking Payment", booking.getBookingId().toString(), httpInfo.get("ip"));
        } else if (req.getPaymentMethod().equalsIgnoreCase("PayPal")) {
            paymentUrl = payPalService.createPayment(
                booking.getBookingId().toString(),
                invoice.getTotalAmount().doubleValue(),
                "USD",
                "paypal",
                "sale",
                "Thanh toán đơn hàng",
                "http://localhost:5173/booking-result",
                "http://localhost:5173/booking-result"
            ).getLinks().stream()
             .filter(link -> link.getRel().equals("approval_url"))
             .map(link -> link.getHref())
             .findFirst()
             .orElseThrow(() -> new IllegalArgumentException("Failed to generate PayPal payment URL"));
        } else {
            throw new IllegalArgumentException("Unsupported payment method");
        }
        if (consultant.getFullName() == null) {
            throw new IllegalArgumentException("Consultant full name is missing");
        }


        // Chưa tạo link họp ở bước này
        booking.setMeetLink(null);

        return new ConsultantBookingResponse(
                booking.getBookingId(),
                booking.getConsultant().getFullName(),
                booking.getStatus(),
                paymentUrl,
                booking.getPaymentStatus(),
                null, // Chưa có link họp
                booking.getInvoice() != null ? booking.getInvoice().getTotalAmount() : BigDecimal.ZERO,
                booking.getInvoice() != null ? booking.getInvoice().getPaymentMethod() : "Unknown"
        );
    }

    /**
     * Xử lý callback thanh toán (VNPAY hoặc PayPal)
     */
    @Transactional
    public void confirmPayment(Map<String,String> params) {
        // Removed unnecessary `throws Exception` declaration
        Integer bookingId = paymentService.handleCallback(params);

        // 1. Cập nhật booking
        var booking = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking không tồn tại"));
        booking.setStatus("CONFIRMED");
        booking.setPaymentStatus("PAID");

        // Tạo link Google Meet thực tế sau khi thanh toán thành công
        String meetLink;
        try {
            meetLink = googleCalendarService.createGoogleMeetLink(
                "Consultation with " + booking.getConsultant().getFullName(),
                booking.getBookingDate(),
                booking.getBookingDate().plusHours(1)
            );
        } catch (Exception e) {
            meetLink = "https://your-meeting-platform.com/" + java.util.UUID.randomUUID();
        }
        booking.setMeetLink(meetLink);
        bookingRepo.save(booking);

        // 2. Cập nhật invoice
        invoiceService.markAsPaid(bookingId);
    }

    public Map<String, Object> getConsultantSchedule(Integer consultantId) {
        var consultant = userRepository.findById(consultantId)
                .orElseThrow(() -> new IllegalArgumentException("Consultant không tồn tại"));

        var bookings = bookingRepo.findByConsultant(consultant);

        Map<String, Object> schedule = new HashMap<>();
        schedule.put("consultant", consultant);
        schedule.put("bookings", bookings);

        return schedule;
    }

    /**
     * Lấy lịch sử booking của user (customer)
     */
    public List<ConsultantBookingResponse> getBookingHistory(Integer customerId) {
        var bookings = bookingRepo.findAll(); // Lấy tất cả booking, có thể thay bằng query theo customerId nếu cần
        return bookings.stream()
                .filter(b -> b.getCustomer() != null && b.getCustomer().getUserId().equals(customerId))
                .map(booking -> new ConsultantBookingResponse(
                        booking.getBookingId(),
                        booking.getConsultant() != null ? booking.getConsultant().getFullName() : null,
                        booking.getStatus(),
                        null, // Không cần trả paymentUrl trong lịch sử
                        booking.getPaymentStatus(),
                        booking.getMeetLink(),
                        booking.getInvoice() != null ? booking.getInvoice().getTotalAmount() : null,
                        booking.getInvoice() != null ? booking.getInvoice().getPaymentMethod() : null
                ))
                .toList();
    }

    private BigDecimal calculateFee(ConsultationBooking booking) {
        // TODO: Tính phí động dựa trên thông tin booking, ví dụ:
        // return BigDecimal.valueOf(booking.getConsultant().getBaseFee());
        // Hiện tại trả về 100 như cũ
        return BigDecimal.valueOf(100);
    }
}
