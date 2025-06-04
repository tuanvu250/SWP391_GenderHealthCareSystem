package GenderHealthCareSystem.controller;

import GenderHealthCareSystem.model.ApiResponse;
import GenderHealthCareSystem.model.BlogPost;
import GenderHealthCareSystem.service.BlogPostService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
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

    /**
     * Lấy tất cả các bài viết.
     *
     * @return ResponseEntity chứa danh sách tất cả các bài viết.
     */
    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<BlogPost>>> getAllBlogPosts() {
        List<BlogPost> blogPosts = blogPostService.findAllBlogPosts();
        var response = new ApiResponse<>(HttpStatus.OK, "Blog posts retrieved successfully", blogPosts, null);
        return ResponseEntity.ok().body(response);
    }

    /**
     * Tạo một bài viết mới và lưu nó vào cơ sở dữ liệu.
     *
     * @param blogPost Bài viết cần tạo.
     * @return ResponseEntity chứa bài viết đã được tạo.
     */
    @PostMapping
    public ResponseEntity<ApiResponse<?>> createBlogPost(@RequestBody BlogPost blogPost) {
        this.blogPostService.saveBlogPost(blogPost);
        var response = new ApiResponse<>(HttpStatus.CREATED, "Blog post created successfully", blogPost, null);
        return ResponseEntity.ok().body(response);
    }

    /**
     * Lấy một bài viết theo ID của nó.
     *
     * @param id ID của bài viết cần lấy.
     * @return ResponseEntity chứa bài viết, nếu tìm thấy.
     */
    @GetMapping("/{id}")
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
    @DeleteMapping("/{id}")
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
    @GetMapping("/newest")
    public ResponseEntity<ApiResponse<List<BlogPost>>> getNewestBlogPosts() {
        List<BlogPost> newestBlogPosts = blogPostService.findFourNewestBlogs(); // Assuming the service method is implemented
        var response = new ApiResponse<>(HttpStatus.OK, "4 newest blog posts retrieved successfully", newestBlogPosts, null);
        return ResponseEntity.ok().body(response);
    }

    /**
     * Lấy các bài viết thuộc danh mục của người dùng đã đăng nhập.
     *
     * @param jwt JWT token chứa thông tin của người dùng đã đăng nhập.
     * @return ResponseEntity chứa các bài viết của người dùng.
     */
    @GetMapping("/author")
    public ResponseEntity<ApiResponse<List<BlogPost>>> getBlogsByAuthor(@AuthenticationPrincipal Jwt jwt) {
        List<BlogPost> blogPosts = blogPostService.findBlogPostsByAuthor(jwt.getClaimAsString("userID"));
        var response = new ApiResponse<>(HttpStatus.OK, "Blogs retrieved successfully", blogPosts, null);
        return ResponseEntity.ok().body(response);
    }

}
