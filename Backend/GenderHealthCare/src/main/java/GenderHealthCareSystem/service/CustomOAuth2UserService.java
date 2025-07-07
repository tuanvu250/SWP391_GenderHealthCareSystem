package GenderHealthCareSystem.service;


import GenderHealthCareSystem.enums.AccountStatus;
import GenderHealthCareSystem.model.Account;
import GenderHealthCareSystem.model.Users;
import GenderHealthCareSystem.repository.AccountRepository;
import GenderHealthCareSystem.repository.RoleRepository;
import GenderHealthCareSystem.repository.UserRepository;
import GenderHealthCareSystem.util.CustomOAuth2User;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService implements OAuth2UserService<OidcUserRequest, OidcUser> {


    private final AccountRepository accountRepository;
    // You'll need to add UserRepository
    private final UserRepository userRepository;
    // Also add RoleRepository to get default role
    private final RoleRepository roleRepository;



    @Override
    public OidcUser loadUser(OidcUserRequest request) throws OAuth2AuthenticationException {
        OidcUser oidcUser = new OidcUserService().loadUser(request);

        String email = oidcUser.getAttribute("email");
        String name = oidcUser.getAttribute("name");

        Account account = accountRepository.findByEmail(email)
                .orElseGet(() -> {
                    // Create new user first
                    Users user = new Users();
                    user.setFullName(name);
                    user.setProvider("GOOGLE");
                    user.setGender(oidcUser.getAttribute("gender"));
                    user.setUserImageUrl(oidcUser.getAttribute("picture"));
                    // Set default role (e.g. ROLE_USER)
                    user.setRole(roleRepository.findByRoleName("Customer")
                            .orElseThrow(() -> new RuntimeException("Default role not found")));
                    user.setCreatedAt(LocalDateTime.now());
                    Users savedUser = userRepository.save(user);

                    // Then create account linked to the user
                    Account newAccount = new Account();
                    newAccount.setEmail(email);
                    newAccount.setUserName(email); // Use email as username or generate a unique one
                    newAccount.setAccountStatus(AccountStatus.ACTIVE);
                    newAccount.setUsers(savedUser);

                    return accountRepository.save(newAccount);
                });

        // Get the user's role from the associated user entity
        String roleName = account.getUsers().getRole().getRoleName();

        return new CustomOAuth2User(oidcUser,account);
    }
}
