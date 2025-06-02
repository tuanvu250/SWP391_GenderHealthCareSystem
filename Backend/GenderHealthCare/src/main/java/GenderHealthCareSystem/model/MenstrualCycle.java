package GenderHealthCareSystem.model;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "MenstrualCycle")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MenstrualCycle {

    @Id
    @Column(name = "CycleID")
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Integer cycleId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "CustomerID", referencedColumnName = "UserID")
    private Users customer;

    @Column(name = "StartDate")
    private LocalDate startDate;

    @Column(name = "EndDate")
    private LocalDate endDate;

    @Column(name = "CycleLength")
    private Integer cycleLength;

    @Column(name = "Note", columnDefinition = "TEXT")
    private String note;

    @Column(name = "CreatedAt")
    private LocalDateTime createdAt;

    // If bidirectional:
    // @OneToMany(mappedBy = "menstrualCycle", cascade = CascadeType.ALL, orphanRemoval = true)
    // private List<Remind> reminds;
}