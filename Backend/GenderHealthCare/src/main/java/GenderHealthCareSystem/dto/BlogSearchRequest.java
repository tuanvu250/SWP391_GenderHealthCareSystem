package GenderHealthCareSystem.dto;

import lombok.Data;

@Data
public class BlogSearchRequest {
    private String title;
    private String tag;
    private String sortOrder = "desc"; // "asc" hoặc "desc"
    private int page = 0;
    private int size = 10;
}
