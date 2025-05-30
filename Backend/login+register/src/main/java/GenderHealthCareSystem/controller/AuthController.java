package GenderHealthCareSystem.controller;

import GenderHealthCareSystem.dto.JwtResponse;
import GenderHealthCareSystem.dto.LoginRequest;
import GenderHealthCareSystem.dto.RegisterRequest;
import GenderHealthCareSystem.service.AuthService;
import GenderHealthCareSystem.util.CustomUserDetails;
import GenderHealthCareSystem.util.SecurityUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final SecurityUtil securityUtil;
    private final AuthenticationManagerBuilder authenticationManagerBuilder;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        authService.register(request);
        return ResponseEntity.ok("User registered successfully");
    }


    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        //xác thực người dùng => cần viết hàm loadUserByUsername
        Authentication authentication = authenticationManagerBuilder.getObject().authenticate(
                //Nạp input gồm username/password vào Security
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsernameOrEmail(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = securityUtil.createToken(authentication);

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        return ResponseEntity.ok(new JwtResponse(jwt,
                userDetails.getAccount().getAccountId(),
                userDetails.getUsername(),
                userDetails.getAccount().getEmail(),
                userDetails.getAccount().getUsers().getRole().getRoleName()
        ));
    }
}
