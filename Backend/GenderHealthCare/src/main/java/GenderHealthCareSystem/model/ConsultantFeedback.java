package GenderHealthCareSystem.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "ConsultantFeedback")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConsultantFeedback {

    @Id
    @Column(name = "FeedbackID")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer feedbackId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "ConsultantProfileID", referencedColumnName = "ProfileID")
    private ConsultantProfile consultantProfile;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "CustomerID", referencedColumnName = "UserID")
    private Users customer;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "BookingID", referencedColumnName = "BookingID")
    private ConsultationBooking consultationBooking;

    @Column(name = "Rating")
    private Integer rating;

    @Column(name = "Comment", columnDefinition = "NVARCHAR(MAX)")
    private String comment;

    @Column(name = "CreatedAt")
    private LocalDateTime createdAt;
}