package GenderHealthCareSystem.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO đại diện cho một trang dữ liệu phân trang.
 *
 * @param <T> Kiểu dữ liệu của các mục trong trang
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PageResponse<T> {
    private List<T> content;          // Nội dung của trang hiện tại
    private int pageNumber;           // Số trang hiện tại (bắt đầu từ 0)
    private int pageSize;             // Kích thước của trang
    private long totalElements;       // Tổng số phần tử
    private int totalPages;           // Tổng số trang
    private boolean isFirst;          // Có phải là trang đầu tiên
    private boolean isLast;           // Có phải là trang cuối cùng
    private boolean hasNext;          // Có trang tiếp theo
    private boolean hasPrevious;      // Có trang trước đó
}
