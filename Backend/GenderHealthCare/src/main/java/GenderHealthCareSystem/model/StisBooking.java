package GenderHealthCareSystem.model;

import GenderHealthCareSystem.enums.StisBookingStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "STIsBooking")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StisBooking {

    @Id
    @Column(name = "BookingID")
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Integer bookingId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "CustomerID", referencedColumnName = "UserID")
    private Users customer;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "ServiceID")
    private StisService stisService;

    @Column(name = "BookingDate")
    private LocalDateTime bookingDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "Status", length = 20)
    private StisBookingStatus status;

    @Column(name = "PaymentStatus", length = 20)
    // Consider using an Enum for PaymentStatus
    // CHECK (PaymentStatus IN ('Unpaid', 'Paid', 'Refunded'))
    private String paymentStatus;

    @Column(name = "PaymentMethod", length = 50)
    // Stores the payment method like 'Credit Card', 'PayPal', etc.
    private String paymentMethod;

    @Column(name = "Note", columnDefinition = "NVARCHAR(MAX)")
    private String note;

    @Column(name = "CreatedAt")
    private LocalDateTime createdAt;

    @Column(name = "UpdatedAt")
    private LocalDateTime updatedAt;

    @Column(name = "ResultedAt")
    private LocalDateTime resultedAt;

    @OneToMany(mappedBy = "stisBooking", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<StisResult> stisResults = new ArrayList<>();

    @OneToOne(mappedBy = "stisBooking", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private StisInvoice stisInvoice;

    @OneToOne(mappedBy = "stisBooking", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private StisFeedback stisFeedback;

}
