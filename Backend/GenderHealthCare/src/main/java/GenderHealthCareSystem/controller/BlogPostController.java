package GenderHealthCareSystem.controller;

import GenderHealthCareSystem.dto.BlogPostResponse;
import GenderHealthCareSystem.dto.PageResponse;
import GenderHealthCareSystem.dto.ApiResponse;
import GenderHealthCareSystem.model.BlogPost;
import GenderHealthCareSystem.service.BlogPostService;
import GenderHealthCareSystem.service.ImageService;
import GenderHealthCareSystem.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/blog-posts")
@RequiredArgsConstructor
public class BlogPostController {

    private final BlogPostService blogPostService;
    private final UserService userService;
    private final ImageService imageService;

    @PostMapping()
    @PreAuthorize("hasRole('Consultant') or hasRole('Manager')")
    public ResponseEntity<ApiResponse<?>> createBlogPost(@RequestPart("tags") String tags,
                                                         @RequestPart("title") String title,
                                                         @RequestPart("content") String content,
                                                         @RequestPart("image") MultipartFile image,
                                                         @AuthenticationPrincipal Jwt jwt) throws IOException {

        BlogPost blogPost = new BlogPost();
        blogPost.setTags(tags);
        blogPost.setTitle(title);
        blogPost.setContent(content);
        System.out.println(Integer.parseInt(jwt.getClaimAsString("userID")));
        blogPost.setConsultant(this.userService.getUserById(Integer.parseInt(jwt.getClaimAsString("userID"))));
        blogPost.setThumbnailUrl(this.imageService.uploadImage(image));
        this.blogPostService.saveBlogPost(blogPost);

        var response = new ApiResponse<>(HttpStatus.CREATED, "Blog post created successfully", null, null);
        return ResponseEntity.ok().body(response);
    }

    /**
     * Deletes a blog post by its ID.
     *
     * @param id The ID of the blog post to be deleted.
     * @return ResponseEntity indicating the success status of the deletion operation.
     * @PreAuthorize Only accessible by users with 'Consultant' or 'Admin' roles.
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('Consultant') or hasRole('Manager')")
    public ResponseEntity<ApiResponse<?>> deleteBlogPost(@PathVariable Integer id) {
        blogPostService.deleteBlogPostById(id);
        var response = new ApiResponse<>(HttpStatus.OK, "Blog post deleted successfully", null, null);
        return ResponseEntity.ok().body(response);
    }


    @PutMapping("/{id}")
    @PreAuthorize("hasRole('Consultant') or hasRole('Manager')")
    public ResponseEntity<ApiResponse<?>> updateBlogPost(
            @PathVariable Integer id,
            @RequestPart("tags") String tags,
            @RequestPart("title") String title,
            @RequestPart("content") String content,
            @RequestPart(value = "image", required = false) MultipartFile image,
            @AuthenticationPrincipal Jwt jwt
    ) throws IOException {
        BlogPost updatedBlogPost = new BlogPost();
        updatedBlogPost.setTags(tags);
        updatedBlogPost.setTitle(title);
        updatedBlogPost.setContent(content);
        // Extract user ID and role from JWT claims
        Integer userId = Integer.parseInt(jwt.getClaimAsString("userID"));
        String role = jwt.getClaimAsString("role");
        // Update thumbnail if a new image is provided
        if (image != null) {
            updatedBlogPost.setThumbnailUrl(this.imageService.uploadImage(image));
        }
        updatedBlogPost.setPostId(id);
        updatedBlogPost.setConsultant(this.blogPostService.findBlogPostById(updatedBlogPost.getPostId()).getConsultant());

        // Update the blog post in the database
        if (role.equals("Manager")) {
            this.blogPostService.updateBlogPost(id, updatedBlogPost);
        } else if (role.equals("Consultant")) {
            // Ensure the user is authorized to update the blog post
            if (updatedBlogPost.getConsultant() == null || updatedBlogPost.getConsultant().getUserId() != userId) {
                throw new RuntimeException("Bạn không có quyền sửa bài viết này");
            }
            this.blogPostService.updateBlogPost(id, updatedBlogPost);
        }

        var response = new ApiResponse<>(HttpStatus.OK, "Blog post updated successfully", null, null);
        return ResponseEntity.ok().body(response);
    }

    /**
     * Retrieves the 4 most recent blog posts.
     *
     * @return ResponseEntity containing a list of the 4 newest blog posts, along with their details.
     */
    @GetMapping("/latest")
    public ResponseEntity<ApiResponse<List<BlogPostResponse>>> getNewestBlogPosts() {
        List<BlogPostResponse> newestBlogPosts = blogPostService.findFourNewestBlogs(); // Assuming the service method is implemented
        var response = new ApiResponse<>(HttpStatus.OK, "4 newest blog posts retrieved successfully", newestBlogPosts, null);
        return ResponseEntity.ok().body(response);
    }

    /**
     * Retrieves all blog posts authored by the currently authenticated user.
     *
     * @param jwt Authenticated user's JWT, used to identify the author's user ID.
     * @return ResponseEntity containing a list of blog posts belonging to the authenticated user.
     * @PreAuthorize Only accessible by users with a 'Consultant' role.
     */
    @PreAuthorize("hasRole('Consultant')")
    @GetMapping("/my-posts")
    public ResponseEntity<ApiResponse<PageResponse<BlogPostResponse>>> getMyBlogPosts(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String tag,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "publishedAt") String orderBy,//viewCount
            @RequestParam(defaultValue = "desc") String sort,
            @AuthenticationPrincipal Jwt jwt
    ) {
        Integer userId = Integer.parseInt(jwt.getClaimAsString("userID"));
        System.out.println("orderBy: " + orderBy);
        Page<BlogPostResponse> blogPosts = blogPostService.findBlogPostsByAuthor(title, tag, orderBy, page, size, sort, userId);

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
                "Search my post results retrieved successfully",
                pageResponse,
                null
        );

        return ResponseEntity.ok(response);
    }


    /**
     * Searches for blog posts based on title, tags, and publication date.
     *
     * @param title The title or part of the title to search for (optional).
     * @param tag   Tags or keywords associated with the blog post (optional).
     * @param page  The page number to retrieve (default is 0).
     * @param size  The number of blog posts to display per page (default is 5).
     * @param sort  The sorting order for publication date, either "asc" or "desc" (default is "desc").
     * @return ResponseEntity containing the paginated search results for the blog posts.
     */
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<PageResponse<BlogPostResponse>>> searchBlogPosts(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String tag,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "publishedAt") String orderBy,//viewCount
            @RequestParam(defaultValue = "desc") String sort
    ) {
        System.out.println("orderBy: " + orderBy);
        Page<BlogPostResponse> blogPosts = blogPostService.searchBlogPosts(title, tag, orderBy, page, size, sort);

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

    /**
     * Retrieves a blog post by its ID.
     *
     * @param id The ID of the blog post to retrieve.
     * @return ResponseEntity containing the details of the blog post.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BlogPostResponse>> getBlogPostById(@PathVariable Integer id, @AuthenticationPrincipal Jwt jwt) {
        boolean increaseViewCount = false; // Default to true, can be modified based on requirements
        if (jwt == null) {
            increaseViewCount = true; // If no JWT is present, we assume the request is from an unauthenticated user
        } else if (jwt.getClaimAsString("role").equals("Customer")) {
            increaseViewCount = true; // If the user is a customer, we also increase the view count

        }
        BlogPostResponse blogPost = blogPostService.getBlogPostById(id, increaseViewCount);
        var response = new ApiResponse<>(HttpStatus.OK, "Blog post retrieved successfully", blogPost, null);
        return ResponseEntity.ok(response);
    }
}
