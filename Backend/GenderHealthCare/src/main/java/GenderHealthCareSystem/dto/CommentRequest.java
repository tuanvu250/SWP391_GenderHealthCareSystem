package GenderHealthCareSystem.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CommentRequest {

    @NotNull
    private Integer blogPostId;

    @NotNull
    @Size(max = 5000, message = "Content must not exceed 5000 characters.")
    private String content;

}
