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

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "BookingID", referencedColumnName = "BookingID", unique = true)
    private ConsultationBooking consultationBooking;

    @Column(name = "Comment", columnDefinition = "TEXT")
    private String comment;

    @Column(name = "CreatedAt")
    private LocalDateTime createdAt;
}