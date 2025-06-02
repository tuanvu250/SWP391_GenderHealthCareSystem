package ForgetPasswordApplication.exceptionHandler;

import ForgetPasswordApplication.model.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<ApiResponse> handleUserAlreadyExistsException(UserAlreadyExistsException ex) {
        String[] errors = ex.getMessage().split(",");
        ApiResponse<String[]> response = new ApiResponse(
                HttpStatus.BAD_REQUEST,
                errors,
                null,
                "Register error"
        );
        return  ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }
    @ExceptionHandler(value ={ UsernameNotFoundException.class, BadCredentialsException.class})
    public ResponseEntity<ApiResponse<Object>> HandleLoginException(Exception exception) {
        var result = new ApiResponse<>(HttpStatus.BAD_REQUEST,"Incorrect Username/Email Or Password", null, exception.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
    }
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<?>> handleAllException(Exception exception) {
        var result = new ApiResponse<>(HttpStatus.INTERNAL_SERVER_ERROR, exception.getMessage(), null,"handle unexpected error");
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(result);
    }
}
