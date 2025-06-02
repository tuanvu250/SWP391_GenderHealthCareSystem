package GenderHealthCareSystem.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "STIsResult")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StisResult {

    @Id
    @Column(name = "ResultID")
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Integer resultId;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "BookingID", referencedColumnName = "BookingID", unique = true)
    private StisBooking stisBooking;

    @Column(name = "ResultDate")
    private LocalDateTime resultDate;

    @Column(name = "HIV_Combo", length = 20)
    // CHECK (HIV_Combo IN ('Positive','Negative','Not Tested'))
    private String hivCombo;

    @Column(name = "Syphilis_RPR", length = 20)
    // CHECK (Syphilis_RPR IN ('Positive','Negative','Not Tested'))
    private String syphilisRpr;

    @Column(name = "Chlamydia_NAAT", length = 20)
    // CHECK (Chlamydia_NAAT IN ('Positive','Negative','Not Tested'))
    private String chlamydiaNaat;

    @Column(name = "Gonorrhea_NAAT", length = 20)
    // CHECK (Gonorrhea_NAAT IN ('Positive','Negative','Not Tested'))
    private String gonorrheaNaat;

    @Column(name = "HSV_IgM", length = 20)
    // CHECK (HSV_IgM IN ('Positive','Negative','Not Tested'))
    private String hsvIgm;

    @Column(name = "HBsAg", length = 20)
    // CHECK (HBsAg IN ('Positive','Negative','Not Tested'))
    private String hbsAg;

    @Column(name = "Anti_HCV", length = 20)
    // CHECK (Anti_HCV IN ('Positive','Negative','Not Tested'))
    private String antiHcv;

    @Column(name = "HPV_DNA", length = 20)
    // CHECK (HPV_DNA IN ('Detected','Not Detected','Not Applicable'))
    private String hpvDna;

    @Column(name = "ResultText", columnDefinition = "TEXT")
    private String resultText;

    @Column(name = "Note", columnDefinition = "TEXT")
    private String note;

    @Column(name = "CreatedAt")
    private LocalDateTime createdAt;

    @Column(name = "UpdatedAt")
    private LocalDateTime updatedAt;
}
