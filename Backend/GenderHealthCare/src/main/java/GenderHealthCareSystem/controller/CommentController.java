package GenderHealthCareSystem.controller;

import GenderHealthCareSystem.dto.CommentRequest;
import GenderHealthCareSystem.model.Comment;
import GenderHealthCareSystem.service.BlogPostService;
import GenderHealthCareSystem.service.CommentService;
import GenderHealthCareSystem.service.UserService;
import lombok.RequiredArgsConstructor;
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
    public ResponseEntity<Comment> createComment(@RequestBody CommentRequest commentRequest, @AuthenticationPrincipal Jwt jwt) {
        String userID = jwt.getClaimAsString("userID");
        Comment comment = new Comment();
        comment.setCreatedAt(LocalDateTime.now());
        comment.setUser(userService.getUserById(Integer.parseInt(userID)));
        comment.setBlogPost(blogPostService.findBlogPostById(commentRequest.getBlogPostId()));
        comment.setContent(commentRequest.getContent());
        comment.setStatus("VISIBLE"); //
        Comment savedComment = commentService.saveComment(comment);
        return new ResponseEntity<>(savedComment, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Comment>> getAllComments() {
        List<Comment> comments = commentService.getAllComments();
        return new ResponseEntity<>(comments, HttpStatus.OK);
    }

    @GetMapping("{blogId}")
    public ResponseEntity<List<Comment>> getCommentsByBlogId(@PathVariable Integer blogId) {
        List<Comment> comments = commentService.getCommentsByBlogId(blogId);
        return new ResponseEntity<>(comments, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCommentById(@PathVariable Integer id) {
        commentService.deleteCommentById(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
