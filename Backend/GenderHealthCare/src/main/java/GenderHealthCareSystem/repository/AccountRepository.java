package GenderHealthCareSystem.repository;

import GenderHealthCareSystem.model.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account,Integer> {
    Optional<Account> findByUserNameOrEmail(String userName, String email);

    Optional<Account> findByUserName(String userName);
    Optional<Account> findByEmail(String email);
}
