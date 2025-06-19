package GenderHealthCareSystem.controller;

import GenderHealthCareSystem.dto.JwtResponse;
import GenderHealthCareSystem.dto.LoginRequest;
import GenderHealthCareSystem.dto.RegisterRequest;
import GenderHealthCareSystem.service.AuthService;
import GenderHealthCareSystem.service.ImageService;
import GenderHealthCareSystem.util.CustomUserDetails;
import GenderHealthCareSystem.util.SecurityUtil;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final SecurityUtil securityUtil;
    private final AuthenticationManagerBuilder authenticationManagerBuilder;
    private final ImageService imageService;

    // API đăng ký tài khoản mới
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody  @Valid RegisterRequest request) {
        // Xử lý đăng ký người dùng mới trong hệ thống
        authService.register(request);
        return ResponseEntity.ok().body("User registered successfully");
    }


    // API đăng nhập hệ thống
    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody @Valid LoginRequest loginRequest) {
        // Bước 1: Xác thực người dùng từ thông tin username/password
        Authentication authentication = authenticationManagerBuilder.getObject().authenticate(
                // Nạp thông tin input từ LoginRequest vào Security với token xác thực
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsernameOrEmail(),
                        loginRequest.getPassword()
                )
        );

        // Bước 2: Lưu thông tin xác thực vào SecurityContextHolder để dùng cho các request sau
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Bước 3: Tạo JWT token bằng SecurityUtil
        String jwt = securityUtil.createToken(authentication);

        // Bước 4: Lấy thông tin người dùng từ đối tượng CustomUserDetails
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        // Bước 5: Trả về response chứa dữ liệu chi tiết người dùng cùng với token JWT
        return ResponseEntity.ok(new JwtResponse(jwt,
                userDetails.getAccount().getAccountId(),
                userDetails.getUsername(),
                userDetails.getAccount().getUsers().getFullName(),
                userDetails.getAccount().getUsers().getUserImageUrl(),
                userDetails.getAccount().getUsers().getGender(),
                userDetails.getAccount().getEmail(),
                userDetails.getAccount().getUsers().getRole().getRoleName()
        ));
    }
    @GetMapping("/google")
    public void redirectToGoogle(HttpServletResponse response) throws IOException {
        response.sendRedirect("/oauth2/authorization/google");
    }
}
