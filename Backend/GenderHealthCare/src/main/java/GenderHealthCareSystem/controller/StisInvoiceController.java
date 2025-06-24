package GenderHealthCareSystem.controller;

import GenderHealthCareSystem.dto.StisInvoiceDTO;
import GenderHealthCareSystem.model.StisInvoice;
import GenderHealthCareSystem.service.StisBookingService;
import GenderHealthCareSystem.service.StisInvoiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/stis-invoices")
public class StisInvoiceController {

    @Autowired
    private StisInvoiceService stisInvoiceService;
    private StisBookingService stisBookingService;

    @GetMapping
    public ResponseEntity<List<StisInvoiceDTO>> getAllInvoices() {
        List<StisInvoiceDTO> invoices = stisInvoiceService.getAllInvoices().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(invoices);
    }

    @GetMapping("/{id}")
    public ResponseEntity<StisInvoiceDTO> getInvoiceById(@PathVariable Integer id) {
        Optional<StisInvoice> invoice = stisInvoiceService.getInvoiceById(id);
        return invoice.map(value -> ResponseEntity.ok(convertToDTO(value)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<StisInvoiceDTO> createInvoice(@RequestBody StisInvoiceDTO invoiceDTO) {
        StisInvoice invoice = convertToEntity(invoiceDTO);
        StisInvoice savedInvoice = stisInvoiceService.saveInvoice(invoice);
        return ResponseEntity.ok(convertToDTO(savedInvoice));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInvoice(@PathVariable Integer id) {
        stisInvoiceService.deleteInvoice(id);
        return ResponseEntity.noContent().build();
    }

    private StisInvoiceDTO convertToDTO(StisInvoice invoice) {
        return new StisInvoiceDTO(
                invoice.getInvoiceId(),
                invoice.getStisBooking().getBookingId(),
                invoice.getTransactionId(),
                invoice.getTotalAmount(),
                invoice.getCurrency(),
                invoice.getPaymentMethod(),
                invoice.getPaidAt()
        );
    }

    private StisInvoice convertToEntity(StisInvoiceDTO invoiceDTO) {
        StisInvoice invoice = new StisInvoice();
        invoice.setInvoiceId(invoiceDTO.getInvoiceId());
        // Assuming StisBooking is already fetched and set elsewhere
        invoice.setStisBooking(stisBookingService.getBookingByIdNotForResponse(invoiceDTO.getBookingId()).get());
        invoice.setTransactionId(invoiceDTO.getTransactionId());
        invoice.setTotalAmount(invoiceDTO.getTotalAmount());
        invoice.setCurrency(invoiceDTO.getCurrency());
        invoice.setPaymentMethod(invoiceDTO.getPaymentMethod());
        invoice.setPaidAt(invoiceDTO.getPaidAt());
        return invoice;
    }
}
