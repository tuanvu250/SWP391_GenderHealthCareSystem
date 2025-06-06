package GenderHealthCareSystem.controller;

import GenderHealthCareSystem.dto.BlogPostResponse;
import GenderHealthCareSystem.dto.BlogSearchRequest;
import GenderHealthCareSystem.dto.PageResponse;
import GenderHealthCareSystem.model.ApiResponse;
import GenderHealthCareSystem.model.BlogPost;
import GenderHealthCareSystem.service.BlogPostService;
import GenderHealthCareSystem.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/blog-posts")
@RequiredArgsConstructor
public class BlogPostController {

    private final BlogPostService blogPostService;
    private final UserService userService;

    /**
     * Tạo một bài viết mới và lưu nó vào cơ sở dữ liệu.
     *
     * @param blogPost Bài viết cần tạo.
     * @return ResponseEntity chứa bài viết đã được tạo.
     */
    @PostMapping("/new")
    public ResponseEntity<ApiResponse<?>> createBlogPost(@RequestBody BlogPost blogPost, @AuthenticationPrincipal Jwt jwt) {
        System.out.println(Integer.parseInt(jwt.getClaimAsString("userID")));
        blogPost.setConsultant(this.userService.getUserById(Integer.parseInt(jwt.getClaimAsString("userID"))));
        this.blogPostService.saveBlogPost(blogPost);

        var response = new ApiResponse<>(HttpStatus.CREATED, "Blog post created successfully", null, null);
        return ResponseEntity.ok().body(response);
    }

    /**
     * Lấy một bài viết theo ID của nó.
     *
     * @param id ID của bài viết cần lấy.
     * @return ResponseEntity chứa bài viết, nếu tìm thấy.
     */
    @GetMapping("/details/{id}")
    public ResponseEntity<ApiResponse<?>> getBlogPostById(@PathVariable Integer id) {
        BlogPost blogPost = blogPostService.findBlogPostById(id);
        var response = new ApiResponse<>(HttpStatus.OK, "Blog post retrieved successfully", blogPost, null);
        return ResponseEntity.ok().body(response);
    }

    /**
     * Xóa một bài viết theo ID của nó.
     *
     * @param id ID của bài viết cần xóa.
     * @return ResponseEntity chỉ ra rằng việc xóa đã thành công.
     */
    @DeleteMapping("/remove/{id}")
    public ResponseEntity<ApiResponse<?>> deleteBlogPost(@PathVariable Integer id) {
        blogPostService.deleteBlogPostById(id);
        var response = new ApiResponse<>(HttpStatus.OK, "Blog post deleted successfully", null, null);
        return ResponseEntity.ok().body(response);
    }

    /**
     * Lấy 4 bài viết mới nhất.
     *
     * @return ResponseEntity chứa danh sách 4 bài viết mới nhất.
     */
    @GetMapping("/latest")
    public ResponseEntity<ApiResponse<List<BlogPostResponse>>> getNewestBlogPosts() {
        List<BlogPostResponse> newestBlogPosts = blogPostService.findFourNewestBlogs(); // Assuming the service method is implemented
        var response = new ApiResponse<>(HttpStatus.OK, "4 newest blog posts retrieved successfully", newestBlogPosts, null);
        return ResponseEntity.ok().body(response);
    }

    /**
     * Lấy các bài viết thuộc danh mục của người dùng đã đăng nhập.
     *
     * @param jwt JWT token chứa thông tin của người dùng đã đăng nhập.
     * @return ResponseEntity chứa các bài viết của người dùng.
     */
    @GetMapping("/my-posts")
    public ResponseEntity<ApiResponse<List<BlogPostResponse>>> getMyBlogPosts(@AuthenticationPrincipal Jwt jwt) {
        Integer userId = Integer.parseInt(jwt.getClaimAsString("userID"));
        List<BlogPostResponse> blogPosts = blogPostService.findBlogPostsByAuthor(userId.toString());

        ApiResponse<List<BlogPostResponse>> response = new ApiResponse<>(
                HttpStatus.OK,
                "User blog posts retrieved successfully",
                blogPosts,
                null
        );

        return ResponseEntity.ok(response);
    }


    /**
     * Tìm kiếm bài viết theo tiêu đề, thẻ và sắp xếp theo ngày xuất bản.
     *
     * @param title Tiêu đề bài viết cần tìm kiếm.
     * @param tag Thẻ bài viết cần tìm kiếm.
     * @param page Số trang cần lấy (bắt đầu từ 0).
     * @param size Số lượng bài viết trên mỗi trang.
     * @param sort Thứ tự sắp xếp ("asc" hoặc "desc").
     * @return ResponseEntity chứa kết quả tìm kiếm.
     */
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<PageResponse<BlogPostResponse>>> searchBlogPosts(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String tag,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "desc") String sort
    ) {
        Page<BlogPostResponse> blogPosts = blogPostService.searchBlogPosts(title, tag, page, size, sort);

        PageResponse<BlogPostResponse> pageResponse = new PageResponse<>(
                blogPosts.getContent(),
                blogPosts.getNumber(),
                blogPosts.getSize(),
                blogPosts.getTotalElements(),
                blogPosts.getTotalPages(),
                blogPosts.isFirst(),
                blogPosts.isLast(),
                blogPosts.hasNext(),
                blogPosts.hasPrevious()
        );

        ApiResponse<PageResponse<BlogPostResponse>> response = new ApiResponse<>(
                HttpStatus.OK,
                "Search results retrieved successfully",
                pageResponse,
                null
        );

        return ResponseEntity.ok(response);
    }
}
