package GenderHealthCareSystem.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Entity representing feedback for STI services
 */
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

    @Column(name = "UserID")
    private Integer userId;

    @Column(name = "Rating")
    private Integer rating;

    @Column(name = "Comment", columnDefinition = "NVARCHAR(MAX)")
    private String comment;

    @Column(name = "CreatedAt")
    private LocalDateTime createdAt;

    @Column(name = "UpdatedAt")
    private LocalDateTime updatedAt;
    
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "BookingID", referencedColumnName = "BookingID", unique = true)
    @JsonIgnore
    private StisBooking stisBooking;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ServiceID", referencedColumnName = "ServiceID")
    @JsonIgnore
    private StisService stisService;
}