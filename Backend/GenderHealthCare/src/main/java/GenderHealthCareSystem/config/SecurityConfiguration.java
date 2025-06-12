package GenderHealthCareSystem.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.oauth2.server.resource.web.BearerTokenAuthenticationEntryPoint;
import org.springframework.security.oauth2.server.resource.web.access.BearerTokenAccessDeniedHandler;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableMethodSecurity
public class SecurityConfiguration {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, CustomAuthenticationEntryPoint customAuthenticationEntryPoint) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(authorizeHttpRequests -> authorizeHttpRequests
                .requestMatchers("/", "/admins", "/login").permitAll()
                .requestMatchers("/users/**").hasAnyRole("Customer", "Admin", "Consultant", "Staff", "Manager") // Chỉ user có role USER mới được truy cập /user/**
                .anyRequest().permitAll()
                )
                .oauth2ResourceServer(oauth2 -> oauth2
                .jwt(Customizer.withDefaults())
                .authenticationEntryPoint(customAuthenticationEntryPoint)
                )
                .exceptionHandling(
                        exceptions -> exceptions
                                .authenticationEntryPoint(new BearerTokenAuthenticationEntryPoint()) //401
                                .accessDeniedHandler(new BearerTokenAccessDeniedHandler())) //403

                .formLogin(f -> f.disable())
                .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                );
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    //da override
    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        // Tạo converter để chuyển đổi các quyền (roles) từ claim trong JWT thành GrantedAuthority của Spring Security
        JwtGrantedAuthoritiesConverter grantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();

        // Đặt tiền tố cho role, Spring Security mặc định dùng "ROLE_" cho các role
        grantedAuthoritiesConverter.setAuthorityPrefix("ROLE_");

        // Đặt tên claim trong JWT mà chứa các quyền user, phải khớp với tên claim bạn tạo trong token (ở đây là "Roles")
        grantedAuthoritiesConverter.setAuthoritiesClaimName("role");

        // Tạo JwtAuthenticationConverter sử dụng converter trên để chuyển đổi JWT thành Authentication có chứa GrantedAuthorities
        JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();
        jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(grantedAuthoritiesConverter);

        // Trả về converter để Spring Security dùng trong quá trình xác thực JWT
        return jwtAuthenticationConverter;
    }

}
