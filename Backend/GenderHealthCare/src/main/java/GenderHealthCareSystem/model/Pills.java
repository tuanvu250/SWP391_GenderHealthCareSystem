    package GenderHealthCareSystem.model;

    import jakarta.persistence.*;
    import lombok.*;

    import java.time.LocalDate;
    import java.time.LocalDateTime;
    import java.time.LocalTime;
    import java.util.List;

    @Entity
    @Table(name = "Pills")
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public class Pills {
        public enum NotificationFrequency { DAILY, WEEKLY }

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Column(name = "PillID")
        private Integer pillId;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "CustomerID", referencedColumnName = "UserID")
        private Users customer;

        @Column(name = "PillType")
        private String pillType;

        @Column(name = "StartDate")
        private LocalDate startDate;

        @Column(name = "TimeOfDay")
        private LocalTime timeOfDay;

        @Column(name = "IsActive")
        private Boolean isActive;

        @Column(name = "CreatedAt")
        private LocalDateTime createdAt;

        @Enumerated(EnumType.STRING)
        @Column(name = "NotificationFrequency")
        private NotificationFrequency notificationFrequency = NotificationFrequency.DAILY;
    //
    //    @OneToMany(mappedBy = "pill", cascade = CascadeType.ALL, orphanRemoval = true)
    //    private List<PillSchedule> pillSchedules;
    }
