package GenderHealthCareSystem.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "Invoices") // This is the general invoice table for consultations
@Data
@NoArgsConstructor
@AllArgsConstructor
public class    Invoice {

    @Id
    @Column(name = "invoice_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Integer invoiceId;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "booking_id", referencedColumnName = "BookingID", unique = true)
    private ConsultationBooking consultationBooking;

    @Column(name = "TransactionId")
    private String transactionId;

    @Column(name = "TotalAmount")
    private Double totalAmount;

    @Column(name = "Currency")
    private String currency;

    @Column(name = "PaymentMethod", length = 50)
    private String paymentMethod;


    @Column(name = "PaidAt")
    private LocalDateTime paidAt;

    @Column(name = "RefundStatus", length = 20)
    private String refundStatus;    // NOT_REQUESTED, REFUND_PENDING, REFUNDED, NON_REFUNDABLE

    @Column(name = "RefundAmount")
    private Double refundAmount;
}