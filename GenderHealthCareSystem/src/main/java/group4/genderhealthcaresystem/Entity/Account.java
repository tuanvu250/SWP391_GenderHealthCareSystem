package group4.genderhealthcaresystem.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Entity
@Table(name = "Account")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Account {

    @Id
    @Column(name = "AccountID")
    private Integer accountId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "UserID", referencedColumnName = "UserID", unique = true)
    private Users users; // Renamed from UserID to avoid confusion with the field name

    @Column(name = "UserName", length = 255, unique = true)
    private String userName;

    @Column(name = "Email", length = 255, unique = true)
    private String email;

    @Column(name = "Password", length = 255)
    private String password; // Ensure this is stored securely (hashed)
}
