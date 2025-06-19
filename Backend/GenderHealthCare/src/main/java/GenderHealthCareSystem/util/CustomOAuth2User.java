package GenderHealthCareSystem.util;

import GenderHealthCareSystem.model.Account;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.oidc.OidcIdToken;
import org.springframework.security.oauth2.core.oidc.OidcUserInfo;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collection;
import java.util.Collections;
import java.util.Map;
public class CustomOAuth2User implements OidcUser {

    private final OidcUser oidcUser;
    private final Account account;

    public CustomOAuth2User(OidcUser oidcUser, Account account) {
        this.oidcUser = oidcUser;
        this.account = account;
    }

    public Account getAccount() {
        return account;
    }

    @Override
    public Map<String, Object> getClaims() {
        return oidcUser.getClaims();
    }

    @Override
    public OidcIdToken getIdToken() {
        return oidcUser.getIdToken();
    }

    @Override
    public OidcUserInfo getUserInfo() {
        return oidcUser.getUserInfo();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Optional: Map role to authorities
        String roleName = account.getUsers().getRole().getRoleName();
        return Collections.singleton(() -> "ROLE_" + roleName.toUpperCase());
    }


    @Override
    public String getName() {
        return oidcUser.getName();
    }

    @Override
    public Map<String, Object> getAttributes() {
        return oidcUser.getAttributes();
    }
}
