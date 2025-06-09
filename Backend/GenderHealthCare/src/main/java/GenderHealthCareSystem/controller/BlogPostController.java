package GenderHealthCareSystem.controller;

import GenderHealthCareSystem.model.BlogPost;
import GenderHealthCareSystem.service.BlogPostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import GenderHealthCareSystem.dto.ApiResponse;

import java.util.List;

@RestController
@RequestMapping("/api/blog-posts")
@RequiredArgsConstructor
public class BlogPostController {

    private final BlogPostService blogPostService;

    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<BlogPost>>> getAllBlogPosts() {
        List<BlogPost> blogPosts = blogPostService.findAllBlogPosts();
        var response = new ApiResponse<>(HttpStatus.OK, "Blog posts retrieved successfully", blogPosts, null);
        return ResponseEntity.ok().body(response);
    }

    @PostMapping
    public ResponseEntity<ApiResponse<?>> createBlogPost(@RequestBody BlogPost blogPost) {
        this.blogPostService.saveBlogPost(blogPost);
        var response = new ApiResponse<>(HttpStatus.CREATED, "Blog post created successfully", blogPost, null);
        return ResponseEntity.ok().body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> getBlogPostById(@PathVariable Integer id) {
        BlogPost blogPost= blogPostService.findBlogPostById(id);
        var response = new ApiResponse<>(HttpStatus.OK, "Blog post retrieved successfully", blogPost, null);
        return ResponseEntity.ok().body(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> deleteBlogPost(@PathVariable Integer id) {
        blogPostService.deleteBlogPostById(id);
        var response = new ApiResponse<>(HttpStatus.OK, "Blog post deleted successfully", null, null);
        return ResponseEntity.ok().body(response);
    }
    @GetMapping("/blogs")
    public ResponseEntity<ApiResponse<List<BlogPost>>> getBlogsByCategory(@AuthenticationPrincipal Jwt jwt) {
        List<BlogPost> blogPosts = blogPostService.findBlogPostsByAuthor(jwt.getClaimAsString("userID"));
        var response = new ApiResponse<>(HttpStatus.OK, "Blogs retrieved successfully", blogPosts, null);
        return ResponseEntity.ok().body(response);
    }
}
