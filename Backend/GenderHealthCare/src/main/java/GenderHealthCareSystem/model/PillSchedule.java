package GenderHealthCareSystem.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "Pill_Schedules")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PillSchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ScheduleID")
    private Integer scheduleId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PillID", referencedColumnName = "PillID")
    private Pills pill;

    @Column(name = "PillDate")
    private LocalDate pillDate;

    @Column(name = "IsPlacebo")
    private Boolean isPlacebo;

    @Column(name = "HasTaken")
    private Boolean hasTaken;
    @Column(name = "ConfirmToken", length = 36, unique = true, nullable = false)
    private String confirmToken;

    @PrePersist
    public void generateToken() {
        this.confirmToken = UUID.randomUUID().toString();
}
}
