package group4.genderhealthcaresystem.Entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "Role")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Role {

    @Id
    @Column(name = "RoleID")
    private Integer roleId;

    @Column(name = "RoleName", length = 50, unique = true)
    private String roleName;

    // If you want bidirectional relationship, add @OneToMany List<UserAccount> users here
}