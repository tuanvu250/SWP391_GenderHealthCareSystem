package group4.genderhealthcaresystem.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "Invoice") // This is the general invoice table for consultations
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Invoice {

    @Id
    @Column(name = "InvoiceID")
    private Integer invoiceId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "BookingID", referencedColumnName = "BookingID", unique = true)
    private ConsultationBooking consultationBooking;

    @Column(name = "TotalAmount", precision = 10, scale = 2)
    private BigDecimal totalAmount;

    @Column(name = "PaymentMethod", length = 50)
    private String paymentMethod;

    @Column(name = "PaidAt")
    private LocalDateTime paidAt;
}