package GenderHealthCareSystem.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class JwtResponse {
    private String token;
    private Integer accountId;
    private String username;
    private String email;
    private String role;
}
