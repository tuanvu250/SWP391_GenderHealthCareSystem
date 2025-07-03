package GenderHealthCareSystem.model;


import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "[User]") // Escaping User as it can be a reserved keyword
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Users { // Renamed from User to UserAccount to avoid conflicts

    @Id
    @Column(name = "UserID")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer userId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "RoleID")
    private Role role;

    @Column(name = "FullName", columnDefinition = "NVARCHAR(255)")
    private String fullName;

    @Column(name = "Phone", length = 20)
    private String phone;

    @Column(name = "Gender", length = 10)
    // Consider using an Enum for Gender and a @Enumerated(EnumType.STRING) annotation
    // CHECK (Gender IN ('Male', 'Female', 'Other'))
    private String gender;

    @Column(name = "BirthDate")
    private LocalDate birthDate;

    @Column(name = "Address", columnDefinition = "NVARCHAR(255)")
    private String address;

    @Column(name = "CreatedAt")
    private LocalDateTime createdAt;

    @Column(name = "UpdatedAt")
    private LocalDateTime updatedAt;

    @Column(name = "UserImageUrl")
    private String userImageUrl;

    @Column(name = "Provider", length = 50)
    private String provider;


    // Relationships to other tables if needed (e.g., @OneToMany for bookings)
    // @OneToOne(mappedBy = "userAccount", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    // private Account account;

    // @OneToOne(mappedBy = "consultant", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    // private ConsultantProfile consultantProfile;
}