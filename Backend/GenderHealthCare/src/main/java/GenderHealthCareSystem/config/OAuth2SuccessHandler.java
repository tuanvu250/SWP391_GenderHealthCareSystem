package GenderHealthCareSystem.config;


import GenderHealthCareSystem.dto.JwtResponse;
import GenderHealthCareSystem.util.CustomOAuth2User;
import GenderHealthCareSystem.util.SecurityUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final SecurityUtil jwtService;


    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication)
            throws IOException, ServletException {

        CustomOAuth2User userDetails = (CustomOAuth2User) authentication.getPrincipal();

        String token = jwtService.createToken(authentication);
        JwtResponse jwtResponse = new JwtResponse(token,
                userDetails.getAccount().getAccountId(),
                userDetails.getName(),
                userDetails.getAccount().getUsers().getFullName(),
                userDetails.getAccount().getUsers().getUserImageUrl(),
                userDetails.getAccount().getUsers().getGender(),
                userDetails.getAccount().getEmail(),
                userDetails.getAccount().getUsers().getRole().getRoleName()
        );
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(jwtResponse);
        // Trả về JWT dưới dạng JSON
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(json);
    }
}