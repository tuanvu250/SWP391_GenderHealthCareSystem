package GenderHealthCareSystem.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "STIsService")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StisService {

    @Id
    @Column(name = "ServiceID")
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Integer serviceId;

    @Column(name = "ServiceName", length = 255, columnDefinition = "NVARCHAR(255)")
    private String serviceName;

    @Column(name = "Description", columnDefinition = "NVARCHAR(MAX)")
    private String description;

    @Column(name = "Price", precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "Duration")
    private String duration; // Assuming duration is in minutes or a defined unit

    @Column(name = "Tests", columnDefinition = "NVARCHAR(MAX)")
    private String tests;

    @Column(name = "Type", length = 50, columnDefinition = "NVARCHAR(255)")
    private String type;

    @Column(name = "Discount")
    private Integer discount;

    @Column(name = "Status")
    private String status;

    @Column(name = "CreatedAt")
    private LocalDateTime createdAt;

    @Column(name = "UpdatedAt")
    private LocalDateTime updatedAt;
}
