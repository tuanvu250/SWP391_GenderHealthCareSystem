package GenderHealthCareSystem.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "STIsResult", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "booking_id", "test_code" })
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StisResult {
    @Id
    @Column(name = "ResultID")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer resultId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "booking_id", referencedColumnName = "BookingID")
    private StisBooking stisBooking;

    @Column(name = "test_code", length = 50)
    private String testCode;

    @Column(name = "result_value", columnDefinition = "NVARCHAR(255)")
    private String resultValue;

    @Column(name = "reference_range", length = 255)
    private String referenceRange;

    @Column(name = "result_date")
    private LocalDateTime resultDate;

    @Column(name = "note", columnDefinition = "NVARCHAR(MAX)")
    private String note;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "pdf_result_url", columnDefinition = "NVARCHAR(255)")
    private String pdfResultUrl;

    @Column(name = "result_text", columnDefinition = "NVARCHAR(MAX)")
    private String resultText;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}