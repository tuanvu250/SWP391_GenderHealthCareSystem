package GenderHealthCareSystem.util;
import GenderHealthCareSystem.model.Account;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;
public class CustomUserDetails implements UserDetails {

    private final Account account;

    public CustomUserDetails(Account account) {
        this.account = account;
    }

    public Account getAccount() {
        return account;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Optional: Map role to authorities
        String roleName = account.getUsers().getRole().getRoleName();
        return Collections.singleton(() -> "ROLE_" + roleName.toUpperCase());
    }

    @Override
    public String getPassword() {
        return account.getPassword();
    }

    @Override
    public String getUsername() {
        return account.getUserName(); // default username
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
