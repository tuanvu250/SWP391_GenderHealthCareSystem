package GenderHealthCareSystem.model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

    @Entity
    @Table(name = "STIsBooking")
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public class StisBooking {

        @Id
        @Column(name = "BookingID")
        @GeneratedValue(strategy = GenerationType.IDENTITY)

        private Integer bookingId;

        @ManyToOne(fetch = FetchType.EAGER)
        @JoinColumn(name = "CustomerID", referencedColumnName = "UserID")
        private Users customer;

        @ManyToOne(fetch = FetchType.EAGER)
        @JoinColumn(name = "ServiceID")
        private StisService stisService;

        @Column(name = "BookingDate")
        private LocalDateTime bookingDate;

        @Column(name = "Status", length = 20)
        // Consider using an Enum for Status
        // CHECK (Status IN ('Pending', 'Confirmed', 'Cancelled', 'Done'))
        private String status;

        @Column(name = "PaymentStatus", length = 20)
        // Consider using an Enum for PaymentStatus
        // CHECK (PaymentStatus IN ('Unpaid', 'Paid', 'Refunded'))
        private String paymentStatus;

        @Column(name = "Note", columnDefinition = "TEXT")
        private String note;

        @Column(name = "CreatedAt")
        private LocalDateTime createdAt;

        @Column(name = "UpdatedAt")
        private LocalDateTime updatedAt;

        @OneToOne(mappedBy = "stisBooking", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
        private StisResult stisResult;

        @OneToOne(mappedBy = "stisBooking", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
        private StisInvoice stisInvoice;

        @OneToOne(mappedBy = "stisBooking", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
        private StisFeedback stisFeedback;
    }
