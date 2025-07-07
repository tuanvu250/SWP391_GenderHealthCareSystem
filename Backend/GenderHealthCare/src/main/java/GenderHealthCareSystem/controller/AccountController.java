package GenderHealthCareSystem.controller;

import GenderHealthCareSystem.dto.ApiResponse;
import GenderHealthCareSystem.dto.UpdateAccountStatusRequest;
import GenderHealthCareSystem.enums.AccountStatus;
import GenderHealthCareSystem.model.Account;
import GenderHealthCareSystem.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

    @PatchMapping("/{accountId}/status")
    public ResponseEntity<ApiResponse<String>> updateAccountStatus(@PathVariable Integer accountId,
                                                           @RequestBody UpdateAccountStatusRequest request) {
        accountService.updateAccountStatus(accountId, request.getAccountStatus());
        return ResponseEntity.ok().body(
                new ApiResponse<>(HttpStatus.OK, "Account status updated successfully as " + request.getAccountStatus().toString(), null, null));
    }
}
