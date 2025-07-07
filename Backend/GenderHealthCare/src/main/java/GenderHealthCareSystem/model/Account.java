package GenderHealthCareSystem.model;

import GenderHealthCareSystem.enums.AccountStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;


@Entity
@Table(name = "Account")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Account {

    @Id
    @Column(name = "AccountID")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer accountId;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "UserID", referencedColumnName = "UserID", unique = true)
    private Users users; // Renamed from UserID to avoid confusion with the field name

    @Column(name = "UserName", length = 255, unique = true)
    private String userName;

    @Column(name = "Email", length = 255, unique = true)
    private String email;

    @Column(name = "Password", length = 255)
    private String password; // Ensure this is stored securely (hashed)

    @Enumerated(EnumType.STRING)
    @Column(name = "Status", length = 20)
    private AccountStatus accountStatus; // Enum to represent account status (e.g., ACTIVE, INACTIVE, SUSPENDED)

    @Column(name = "ResetOtpExpiry")
    private LocalDateTime resetOtpExpiry;

    @Column(name = "Otp", length = 6)
    private String resetOtp;

    @Column(name = "OtpVerified")
    private Boolean otpVerified;
}
