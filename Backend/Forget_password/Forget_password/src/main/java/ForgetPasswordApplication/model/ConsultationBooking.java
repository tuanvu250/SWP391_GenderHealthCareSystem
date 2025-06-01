package ForgetPasswordApplication.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "ConsultationBooking")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConsultationBooking {

    @Id
    @Column(name = "BookingID")
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Integer bookingId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CustomerID", referencedColumnName = "UserID")
    private Users customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ConsultantID", referencedColumnName = "UserID")
    private Users consultant;

    @Column(name = "BookingDate")
    private LocalDateTime bookingDate;

    @Column(name = "Status", length = 50)
    private String status; // Consider Enum

    @Column(name = "Note", columnDefinition = "TEXT")
    private String note;

    @Column(name = "PaymentStatus", length = 50)
    private String paymentStatus; // Consider Enum

    @Column(name = "CreatedAt")
    private LocalDateTime createdAt;

    @OneToOne(mappedBy = "consultationBooking", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private ConsultantFeedback consultantFeedback;

    @OneToOne(mappedBy = "consultationBooking", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Invoice invoice; // Invoice for this consultation booking
}