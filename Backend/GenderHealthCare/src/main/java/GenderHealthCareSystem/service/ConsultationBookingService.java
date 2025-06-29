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
import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
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

        booking.setMeetLink(googleCalendarService.createGoogleMeetLink(
                "Consultation with " + consultant.getFullName(),
                req.getBookingDate(),
                req.getBookingDate().plusHours(1)
        ));

        return new ConsultantBookingResponse(
                booking.getBookingId(), booking.getStatus(), paymentUrl, null
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
        booking.setMeetLink("https://your-meeting-platform.com/" + java.util.UUID.randomUUID());
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

    private BigDecimal calculateFee(ConsultationBooking booking) {
        return BigDecimal.valueOf(100); // Example fee
    }
}