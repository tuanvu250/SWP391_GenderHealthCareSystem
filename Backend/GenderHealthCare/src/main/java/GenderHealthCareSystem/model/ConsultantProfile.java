package GenderHealthCareSystem.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "ConsultantProfile")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder // Thêm annotation để hỗ trợ builder pattern
public class ConsultantProfile {

    @Id
    @Column(name = "ProfileID")
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Integer profileId;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "ConsultantID", referencedColumnName = "UserID", unique = true)
    private Users consultant; // This links to the Users entity

    @Column(name = "Introduction", columnDefinition = "NVARCHAR(MAX)")
    private String introduction;

    @Column(name = "JobTitle", columnDefinition = "NVARCHAR(MAX)", nullable = false)
    private String jobTitle;

    @Column(name = "Specialization", columnDefinition = "NVARCHAR(MAX)")
    private String specialization;

    @Column(name = "Languages", columnDefinition = "NVARCHAR(MAX)")
    private String languages;

    @Column(name = "ExperienceYears", nullable = false)
    private Integer experienceYears;

    @Column(name = "HourlyRate", nullable = false)
    private Double hourlyRate;

    @Column(name = "Location",  columnDefinition = "NVARCHAR(MAX)")
    private String location;

    @Column(name = "IsAvailable")
    private Boolean isAvailable;

    @Column(name = "Rating")
    private Double rating;

    @Column(name = "ReviewCount")
    private Integer reviewCount;

    @Column(name = "EmploymentStatus")
    private Boolean employmentStatus;

    @OneToMany(mappedBy = "profile", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProfileDetail> details = new ArrayList<>();
}