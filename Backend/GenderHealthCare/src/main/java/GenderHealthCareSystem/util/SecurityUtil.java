package GenderHealthCareSystem.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@Service
public class SecurityUtil {

    private final JwtEncoder jwtEncoder;

    public SecurityUtil(JwtEncoder jwtEncoder) {
        this.jwtEncoder = jwtEncoder;
    }

    @Value("${validity-in-seconds}")
    private long jwtKeyExpiration;

    public static final MacAlgorithm JWT_ALGORITHM = MacAlgorithm.HS512;

    public String createToken(Authentication authentication) {
        Instant now = Instant.now();
        Instant validity = now.plus(this.jwtKeyExpiration, ChronoUnit.SECONDS);
        Object principal = authentication.getPrincipal();
        JwtClaimsSet claims= null;
        if (principal instanceof OAuth2User) {
            CustomOAuth2User userDetails = (CustomOAuth2User) principal;
             claims = JwtClaimsSet.builder()
                    .issuedAt(now)
                    .expiresAt(validity)
                    .subject(userDetails.getName())
                    .claim("email", userDetails.getAccount().getEmail())
                    .claim("role", userDetails.getAccount().getUsers().getRole().getRoleName())
                    .claim("accountId", userDetails.getAccount().getAccountId())
                    .claim("userID", userDetails.getAccount().getUsers().getUserId())
                    .claim("fullName", userDetails.getAccount().getUsers().getFullName())
                    .build();
        } else if (principal instanceof UserDetails) {
            CustomUserDetails userDetails = (CustomUserDetails) principal;
             claims = JwtClaimsSet.builder()
                    .issuedAt(now)
                    .expiresAt(validity)
                    .subject(userDetails.getUsername())
                    .claim("email", userDetails.getAccount().getEmail())
                    .claim("role", userDetails.getAccount().getUsers().getRole().getRoleName())
                    .claim("accountId", userDetails.getAccount().getAccountId())
                    .claim("userID", userDetails.getAccount().getUsers().getUserId())
                    .claim("fullName", userDetails.getAccount().getUsers().getFullName())
                    .build();
        }
//        private Integer accountId;
//        private String username;
//        private String email;
//        private String role;
//        private String fullName;

        // @formatter:off


        JwsHeader jwsHeader = JwsHeader.with(JWT_ALGORITHM).build();
        return this.jwtEncoder.encode(JwtEncoderParameters.from(jwsHeader, claims)).getTokenValue();
    }
}