package GenderHealthCareSystem.model;

import GenderHealthCareSystem.enums.BookingStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Setter;

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

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "CustomerID", referencedColumnName = "UserID")
    private Users customer;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "ConsultantID", referencedColumnName = "UserID")
    @Setter
    private Users consultant;

    @Column(name = "BookingDate")
    private LocalDateTime bookingDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "Status", length = 50)
    private BookingStatus status;

    @Column(name = "Note", columnDefinition = "NVARCHAR(MAX)")
    private String note;

    @Column(name = "PaymentStatus", length = 50)
    private String paymentStatus; // Consider Enum

    @Column(name = "CreatedAt")
    private LocalDateTime createdAt;

    @OneToOne(mappedBy = "consultationBooking", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private ConsultantFeedback consultantFeedback;

    @OneToOne(mappedBy = "consultationBooking", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private Invoice invoice; // Invoice for this consultation booking

    @Setter
    @Column(name = "MeetLink")
    private String meetLink;


}