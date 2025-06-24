package GenderHealthCareSystem.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "STIsInvoice")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StisInvoice {

    @Id
    @Column(name = "InvoiceID")
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Integer invoiceId;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "BookingID", referencedColumnName = "BookingID", unique = true)
    private StisBooking stisBooking;

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
}
