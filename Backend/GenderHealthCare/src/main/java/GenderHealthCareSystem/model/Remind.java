package GenderHealthCareSystem.model;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;


@Entity
@Table(name = "Remind")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Remind {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "RemindID")
    private Integer remindId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "CycleID")
    private MenstrualCycle menstrualCycle;

    @Column(name = "ReminderType", length = 20)
    // Consider using an Enum for ReminderType
    // CHECK (ReminderType IN ('Ovulation', 'Pill', 'PregnancyChance', 'FertilityWindow'))
    private String reminderType;

    @Column(name = "ReminderDate")
    private LocalDate reminderDate;

    @Column(name = "ReminderTime")
    private LocalTime reminderTime;

    @Column(name = "Description", columnDefinition = "NVARCHAR(MAX)")
    private String description;

    @Column(name = "FertilityWindow")
    private Boolean fertilityWindow; // SQL BIT maps to Boolean

    @Column(name = "OvulationTime")
    private LocalDateTime ovulationTime;

    @Column(name = "PregnancyChance", length = 10)
    // Consider using an Enum for PregnancyChance
    // CHECK (PregnancyChance IN ('High', 'Medium', 'Low'))
    private String pregnancyChance;
}