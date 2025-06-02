package ForgetPasswordApplication.controller;

import ForgetPasswordApplication.model.Account;
import ForgetPasswordApplication.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/accounts")
public class AccountController {

    private final AccountService accountService;

    @Autowired
    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    @PostMapping("/create")
    public String createAccount(@RequestBody Account account) {
        this.accountService.saveAccount(account);
        return "Account created successfully!";
    }
}
