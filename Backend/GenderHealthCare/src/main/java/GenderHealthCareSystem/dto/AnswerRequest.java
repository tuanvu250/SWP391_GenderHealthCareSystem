package GenderHealthCareSystem.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AnswerRequest {

    @NotBlank(message = "Answer is required")
    @Size(max = 5000, message = "Answer must not exceed 5000 characters")
    private String answer;
}
