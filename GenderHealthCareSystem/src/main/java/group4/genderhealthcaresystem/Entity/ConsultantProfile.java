package group4.genderhealthcaresystem.Entity;

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
    private Integer profileId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ConsultantID", referencedColumnName = "UserID", unique = true)
    private Users consultant; // This links to the Users entity

    @Column(name = "Introduction", columnDefinition = "TEXT")
    private String introduction;

    @Column(name = "Specialization", columnDefinition = "TEXT")
    private String specialization;

    @Column(name = "Languages", columnDefinition = "TEXT")
    private String languages; // Could be a list of strings, stored as JSON or comma-separated

    @Column(name = "AvatarURL", columnDefinition = "TEXT")
    private String avatarUrl;

    @Column(name = "ExperienceYears")
    private Integer experienceYears;
}