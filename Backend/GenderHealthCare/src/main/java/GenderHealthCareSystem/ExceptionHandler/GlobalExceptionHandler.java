package GenderHealthCareSystem.ExceptionHandler;

import GenderHealthCareSystem.dto.ApiResponse;
import com.paypal.base.rest.PayPalRESTException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.validation.BindingResult;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(PayPalRESTException.class)
    public ResponseEntity<ApiResponse<String>> handlePayPalRESTException(PayPalRESTException ex) {
        // Log the exception (consider adding proper logging)
        ApiResponse<String> response = new ApiResponse<>(
                HttpStatus.BAD_REQUEST,
                "PayPal transaction failed: " + ex.getMessage(),
                null,
                "PayPal Error"
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<List<String>>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        // Extract validation errors from BindingResult
        BindingResult bindingResult = ex.getBindingResult();
        List<String> errors = new ArrayList<>();
        for (var fieldError : bindingResult.getFieldErrors()) {
            errors.add(fieldError.getField() + ": " + fieldError.getDefaultMessage());
        }

        ApiResponse<List<String>> response = new ApiResponse<>(
                HttpStatus.BAD_REQUEST,
                errors,
                null,
                "Validation error"
        );

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }
    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<ApiResponse> handleUserAlreadyExistsException(UserAlreadyExistsException ex) {
        // Log the exception (optional)
        String[] errors = ex.getMessage().split(",");
        ApiResponse<String[]> response = new ApiResponse(
                HttpStatus.BAD_REQUEST,
                errors,
                null,
                "Register error"
        );
        return  ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(value = {UsernameNotFoundException.class, BadCredentialsException.class})
    public ResponseEntity<ApiResponse<Object>> HandleLoginException(Exception exception) {
        var result = new ApiResponse<>(HttpStatus.UNAUTHORIZED, "Tên đăng nhập/Email hoặc mật khẩu không chính xác", null, exception.getMessage());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(result);
    }
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<?>> handleAllException(Exception exception) {
        var result = new ApiResponse<>(HttpStatus.INTERNAL_SERVER_ERROR, exception.getMessage(), null,"handle unexpected error");
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(result);
    }
    @ExceptionHandler(IOException.class)
    public ResponseEntity<String> handleIOException(IOException ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Upload failed: " + ex.getMessage());
    }

}
