package GenderHealthCareSystem.service;

import GenderHealthCareSystem.model.ConsultationBooking;
import GenderHealthCareSystem.model.Invoice;
import GenderHealthCareSystem.repository.ConsultationBookingRepository;
import GenderHealthCareSystem.repository.InvoiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@RequiredArgsConstructor
@Service
public class InvoiceService {

    private final InvoiceRepository invoiceRepo;
    private final ConsultationBookingRepository bookingRepo;

    /**
     * Tạo Invoice gắn với Booking
     */
    @Transactional
    public Invoice createInvoice(Integer bookingId, BigDecimal amount) {
        var booking = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking không tồn tại"));
        Invoice inv = new Invoice();
        inv.setConsultationBooking(booking);
        inv.setTotalAmount(amount);
        inv.setPaymentMethod("VNPAY");  // mặc định nếu VNPAY
        inv = invoiceRepo.save(inv);
        return inv;
    }

    /**
     * Đánh dấu đã thanh toán
     */
    @Transactional
    public void markAsPaid(Integer bookingId) {
        var inv = invoiceRepo.findByConsultationBookingBookingId(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Invoice không tồn tại"));
        inv.setPaidAt(LocalDateTime.now());
        invoiceRepo.save(inv);
    }
}