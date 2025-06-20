package GenderHealthCareSystem.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "MenstrualCycleHistory")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MenstrualCycleHistory {

    @Id
    @Column(name = "HistoryID")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer historyId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "CycleID", referencedColumnName = "CycleID")
    private MenstrualCycle menstrualCycle;

    @Column(name = "StartDate")
    private LocalDate startDate;

    @Column(name = "EndDate")
    private LocalDate endDate;

    @Column(name = "CycleLength")
    private Integer cycleLength;

    @Column(name = "Note", columnDefinition = "NVARCHAR(MAX)")
    private String note;

    @Column(name = "CreatedAt")
    private LocalDateTime createdAt;
}
