package GenderHealthCareSystem.service;

import GenderHealthCareSystem.model.StisBooking;
import GenderHealthCareSystem.model.StisInvoice;
import GenderHealthCareSystem.repository.StisInvoiceRepository;
import com.paypal.api.payments.Payment;
import com.paypal.api.payments.Sale;
import com.paypal.api.payments.Transaction;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class StisInvoiceService {

    private final StisInvoiceRepository stisInvoiceRepository;
    private final StisBookingService stisBookingService;

    public List<StisInvoice> getAllInvoices() {
        return stisInvoiceRepository.findAll();
    }

    public Optional<StisInvoice> getInvoiceById(Integer id) {
        return stisInvoiceRepository.findById(id);
    }

    public StisInvoice saveInvoice(StisInvoice invoice) {
        if ("PAID".equals(invoice.getStisBooking().getPaymentStatus()) ) {
            throw new RuntimeException("Booking has already been paid");
        }
        String prefix = "TXN";

        // Lấy thời gian hiện tại định dạng yyyyMMddHHmmss
        String timestamp = java.time.LocalDateTime.now()
                .format(java.time.format.DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));

        // Tạo số ngẫu nhiên 4 chữ số
        int random = new java.util.Random().nextInt(9000) + 1000; // từ 1000 → 9999

        String transID= prefix + timestamp + random; // Ví dụ: TXN202507071630451237
        invoice.setTransactionId(transID);
        invoice.setPaidAt(LocalDateTime.now());
        invoice.getStisBooking().setPaymentStatus("PAID");
        stisBookingService.saveBooking(invoice.getStisBooking());
        return stisInvoiceRepository.save(invoice);
    }

    public void deleteInvoice(Integer id) {
        stisInvoiceRepository.deleteById(id);
    }

    public StisInvoice createInvoiceFromVNPay(Map<String, String> params) {
        int bookingId = Integer.parseInt(params.get("vnp_OrderInfo"));
        StisBooking booking = stisBookingService.getBookingByIdNotForResponse(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        StisInvoice invoice = new StisInvoice();
        invoice.setStisBooking(booking);
        invoice.setTransactionId(params.get("vnp_TransactionNo"));
        invoice.setTotalAmount(Double.parseDouble(params.get("vnp_Amount"))/100);
        invoice.setPaymentMethod("VNPay");
        invoice.setCurrency("VND");
        invoice.setPaidAt(LocalDateTime.now());

        // Lưu hóa đơn
        StisInvoice savedInvoice = stisInvoiceRepository.save(invoice);

        // Cập nhật trạng thái booking
        booking.setPaymentStatus("PAID");
        booking.setStisInvoice(savedInvoice);
        stisBookingService.saveBooking(booking);

        return savedInvoice;
    }
    public StisInvoice createInvoiceFromPayPal(Payment payment) {
        Transaction transaction = payment.getTransactions().get(0);
        String bookingId = transaction.getCustom(); // custom field chứa orderId

        StisBooking booking = stisBookingService.getBookingByIdNotForResponse(Integer.parseInt(bookingId))
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        Sale sale = transaction.getRelatedResources().get(0).getSale();

        StisInvoice invoice = new StisInvoice();
        invoice.setStisBooking(booking);
        invoice.setTransactionId(sale.getId());
        invoice.setTotalAmount(Double.parseDouble(transaction.getAmount().getTotal()));
        invoice.setPaymentMethod("Paypal");
        invoice.setCurrency("USD");
        invoice.setPaidAt(LocalDateTime.now());

        StisInvoice savedInvoice = stisInvoiceRepository.save(invoice);

        booking.setPaymentStatus("PAID");
        booking.setStisInvoice(savedInvoice);
        stisBookingService.saveBooking(booking);

        return savedInvoice;
    }
}
