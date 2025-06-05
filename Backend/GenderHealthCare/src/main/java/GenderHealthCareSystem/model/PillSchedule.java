package GenderHealthCareSystem.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

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
}
