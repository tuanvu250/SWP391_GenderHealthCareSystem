package GenderHealthCareSystem.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;


@Entity
@Table(name = "STIsFeedback")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StisFeedback {

    @Id
    @Column(name = "FeedbackID")
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Integer feedbackId;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "BookingID", referencedColumnName = "BookingID", unique = true)
    private StisBooking stisBooking;

    @Column(name = "Rating")
    private Integer rating; // Assuming rating is an integer (e.g., 1-5)

    @Column(name = "Comment", columnDefinition = "TEXT")
    private String comment;

    @Column(name = "CreatedAt")
    private LocalDateTime createdAt;
}