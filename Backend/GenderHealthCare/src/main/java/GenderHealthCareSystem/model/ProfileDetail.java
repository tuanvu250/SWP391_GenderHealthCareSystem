package GenderHealthCareSystem.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "ProfileDetail")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfileDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "DetailID")
    private Integer detailId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ProfileID", nullable = false)
    private ConsultantProfile profile;

    @Column(name = "DetailType", nullable = false, length = 10)
    private String detailType; // WORK, EDU, CERT

    @Column(name = "Title", length = 100, columnDefinition = "NVARCHAR(100)")
    private String title;

    @Column(name = "Organization",  columnDefinition = "NVARCHAR(MAX)")
    private String organization;

    @Column(name = "FromDate")
    private LocalDate fromDate;

    @Column(name = "ToDate")
    private LocalDate toDate;

    @Column(name = "Description", columnDefinition = "NVARCHAR(MAX)")
    private String description;

    @Column(name = "IssuedDate")
    private LocalDate issuedDate;
}

