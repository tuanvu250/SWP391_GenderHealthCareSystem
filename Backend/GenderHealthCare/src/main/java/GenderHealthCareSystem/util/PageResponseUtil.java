package GenderHealthCareSystem.util;

import GenderHealthCareSystem.dto.PageResponse;
import org.springframework.data.domain.Page;

public class PageResponseUtil {

    public static <T> PageResponse<T> mapToPageResponse(Page<T> page) {
        return new PageResponse<>(
                page.getContent(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isFirst(),
                page.isLast(),
                page.hasNext(),
                page.hasPrevious()
        );
    }
}
