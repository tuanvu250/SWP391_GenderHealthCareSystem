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

    /**
     * Creates a new blog post and saves it to the database.
     *
     * @param blogPostJson JSON string representing the blog post details.
     * @param image        Image file to be used as the thumbnail for the blog post.
     * @param jwt          Authenticated user's JWT, used to identify the blog post author.
     * @return ResponseEntity containing the status and details of the created blog post.
     * @throws IOException if there is an error processing the image file.
     */
    @PostMapping()
    @PreAuthorize("hasRole('Consultant') or hasRole('Manager')")
    public ResponseEntity<ApiResponse<?>> createBlogPost(@RequestPart("blogPost") String blogPostJson, @RequestPart("image") MultipartFile image, @AuthenticationPrincipal Jwt jwt) throws IOException {
        // Parse JSON string thành BlogPost object
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.findAndRegisterModules(); // để parse LocalDateTime
        BlogPost blogPost = objectMapper.readValue(blogPostJson, BlogPost.class);
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

    /**
     * Updates an existing blog post.
     *
     * @param id           The ID of the blog post to be updated.
     * @param blogPostJson JSON string representing the updated blog post details.
     * @param image        (Optional) New image file to be used as the thumbnail for the blog post.
     * @return ResponseEntity containing the status and details of the updated blog post.
     * @throws IOException if there is an error processing the image file.
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('Consultant') or hasRole('Manager')")
    public ResponseEntity<ApiResponse<?>> updateBlogPost(
            @PathVariable Integer id,
            @RequestPart("blogPost") String blogPostJson,
            @RequestPart(value = "image", required = false) MultipartFile image,
            @AuthenticationPrincipal Jwt jwt
    ) throws IOException {
        // Parse JSON string to BlogPost object
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.findAndRegisterModules(); // To handle LocalDateTime parsing
        BlogPost updatedBlogPost = objectMapper.readValue(blogPostJson, BlogPost.class);
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
            @RequestParam(defaultValue = "desc") String sort,
            @AuthenticationPrincipal Jwt jwt
    ) {
        Integer userId = Integer.parseInt(jwt.getClaimAsString("userID"));
        Page<BlogPostResponse> blogPosts = blogPostService.findBlogPostsByAuthor(title, tag, page, size, sort, userId);

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

    /**
     * Retrieves a blog post by its ID.
     *
     * @param id The ID of the blog post to retrieve.
     * @return ResponseEntity containing the details of the blog post.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BlogPostResponse>> getBlogPostById(@PathVariable Integer id) {
        BlogPostResponse blogPost = blogPostService.getBlogPostById(id);
        var response = new ApiResponse<>(HttpStatus.OK, "Blog post retrieved successfully", blogPost, null);
        return ResponseEntity.ok(response);
    }
}
