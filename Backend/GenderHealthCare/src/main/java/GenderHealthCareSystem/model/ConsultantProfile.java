package GenderHealthCareSystem.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "ConsultantProfile")
@Data
@NoArgsConstructor
@AllArgsConstructor
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

    @Column(name = "Specialization", columnDefinition = "NVARCHAR(MAX)")
    private String specialization;

    @Column(name = "Languages", columnDefinition = "NVARCHAR(MAX)")
    private String languages; // Could be a list of strings, stored as JSON or comma-separated

    @Column(name = "AvatarURL", columnDefinition = "TEXT")
    private String avatarUrl;

    @Column(name = "ExperienceYears")
    private Integer experienceYears;
}