package GenderHealthCareSystem.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
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
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
//        private Integer accountId;
//        private String username;
//        private String email;
//        private String role;
//        private String fullName;

        // @formatter:off
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuedAt(now)
                .expiresAt(validity)
                .subject(userDetails.getUsername())
                .claim("email", userDetails.getAccount().getEmail())
                .claim("role", userDetails.getAccount().getUsers().getRole().getRoleName())
                .claim("accountId", userDetails.getAccount().getAccountId())
                .claim("userID", userDetails.getAccount().getUsers().getUserId())
                .claim("fullName", userDetails.getAccount().getUsers().getFullName())
                .build();

        JwsHeader jwsHeader = JwsHeader.with(JWT_ALGORITHM).build();
        return this.jwtEncoder.encode(JwtEncoderParameters.from(jwsHeader, claims)).getTokenValue();
    }
}
//package GenderHealthCareSystem.security;
//
//import io.jsonwebtoken.*;
//        import org.springframework.beans.factory.annotation.Value;
//import org.springframework.security.core.Authentication;
//import org.springframework.stereotype.Component;
//
//import java.util.Date;
//
//@Component
//public class JwtTokenProvider {
//
//    @Value("${app.jwtSecret}")
//    private String jwtSecret;
//
//    @Value("${app.jwtExpirationMs}")
//    private int jwtExpirationMs;
//
//    // Tạo JWT từ thông tin người dùng đã xác thực
//    public String generateToken(Authentication authentication) {
//        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
//
//        Date now = new Date();
//        Date expiryDate = new Date(now.getTime() + jwtExpirationMs);
//
//        return Jwts.builder()
//                .setSubject(userDetails.getUsername()) // thường là username
//                .claim("email", userDetails.getAccount().getEmail())
//                .claim("role", userDetails.getAccount().getUsers().getRole().getRoleName())
//                .claim("accountId", userDetails.getAccount().getAccountId())
//                .setIssuedAt(now)
//                .setExpiration(expiryDate)
//                .signWith(SignatureAlgorithm.HS512, jwtSecret)
//                .compact();
//    }
//
//    // Lấy username từ token
//    public String getUsernameFromJWT(String token) {
//        Claims claims = Jwts.parser()
//                .setSigningKey(jwtSecret)
//                .parseClaimsJws(token)
//                .getBody();
//
//        return claims.getSubject(); // username
//    }
//
//    // Xác thực token có hợp lệ hay không
//    public boolean validateToken(String authToken) {
//        try {
//            Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(authToken);
//            return true;
//        } catch (SignatureException ex) {
//            System.out.println("Invalid JWT signature");
//        } catch (MalformedJwtException ex) {
//            System.out.println("Invalid JWT token");
//        } catch (ExpiredJwtException ex) {
//            System.out.println("Expired JWT token");
//        } catch (UnsupportedJwtException ex) {
//            System.out.println("Unsupported JWT token");
//        } catch (IllegalArgumentException ex) {
//            System.out.println("JWT claims string is empty.");
//        }
//        return false;
//    }
//}

