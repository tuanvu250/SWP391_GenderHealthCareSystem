package GenderHealthCareSystem.controller;

import GenderHealthCareSystem.dto.ApiResponse;
import GenderHealthCareSystem.dto.CommentRequest;
import GenderHealthCareSystem.dto.CommentResponse;
import GenderHealthCareSystem.dto.PageResponse;
import GenderHealthCareSystem.model.Comment;
import GenderHealthCareSystem.service.BlogPostService;
import GenderHealthCareSystem.service.CommentService;
import GenderHealthCareSystem.service.UserService;
import GenderHealthCareSystem.util.PageResponseUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;
    private final UserService userService;
    private final BlogPostService blogPostService;

    @PostMapping
    @PreAuthorize("hasRole('Customer')")
    public ResponseEntity<ApiResponse<CommentResponse>> createComment(@RequestBody CommentRequest commentRequest, @AuthenticationPrincipal Jwt jwt) {
        String userID = jwt.getClaimAsString("userID");
        Comment comment = new Comment();
        comment.setCreatedAt(LocalDateTime.now());
        comment.setUser(userService.getUserById(Integer.parseInt(userID)));
        comment.setBlogPost(blogPostService.findBlogPostById(commentRequest.getBlogPostId()));
        comment.setContent(commentRequest.getContent());
        comment.setStatus("VISIBLE"); //
        CommentResponse savedComment = commentService.saveComment(comment);
        return ResponseEntity.ok().body(new ApiResponse<>(HttpStatus.CREATED, "Comment created successfully", savedComment, null));
    }

    @PutMapping("/{commentId}")
    @PreAuthorize("hasRole('Customer')")
    public ResponseEntity<ApiResponse<CommentResponse>> updateComment(@RequestBody @Valid CommentRequest commentRequest,
                                                                      @PathVariable Integer commentId,
                                                                      @AuthenticationPrincipal Jwt jwt) {
        String userID = jwt.getClaimAsString("userID");
        CommentResponse savedComment = commentService.UpdateComment(commentRequest, commentId, Integer.parseInt(userID));
        return ResponseEntity.ok().body(new ApiResponse<>(HttpStatus.OK, "Comment Updated successfully", savedComment, null));
    }


    @GetMapping("{blogId}")
    public ResponseEntity<ApiResponse<PageResponse<CommentResponse>>> getCommentsByBlogId(@PathVariable Integer blogId,
                                                                                          @RequestParam(defaultValue = "0") int page,
                                                                                          @RequestParam(defaultValue = "5") int size,
                                                                                          @RequestParam(defaultValue = "desc") String sort) {
        Page<CommentResponse> comments = commentService.searchCommentByPostId(page, size, sort, blogId);
        return new ResponseEntity<>(
                new ApiResponse<>(HttpStatus.OK, "Comments retrieved successfully", PageResponseUtil.mapToPageResponse(comments), null),
                HttpStatus.OK
        );
    }

    @PutMapping("/{id}/hide")
    public ResponseEntity<ApiResponse<String>> HideComment(@PathVariable Integer id,
                                                           @AuthenticationPrincipal Jwt jwt) {

        String userID = jwt.getClaimAsString("userID");
        String role = jwt.getClaimAsString("role");
        commentService.HideComment(id, Integer.parseInt(userID), role);
        return new ResponseEntity<>(
                new ApiResponse<>(HttpStatus.OK, "Comment hidden successfully", null, null),
                HttpStatus.OK
        );
    }

}
