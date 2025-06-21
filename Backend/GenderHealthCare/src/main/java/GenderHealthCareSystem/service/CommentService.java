package GenderHealthCareSystem.service;

import GenderHealthCareSystem.dto.BlogPostResponse;
import GenderHealthCareSystem.dto.CommentRequest;
import GenderHealthCareSystem.dto.CommentResponse;
import GenderHealthCareSystem.model.BlogPost;
import GenderHealthCareSystem.model.Comment;
import GenderHealthCareSystem.repository.BlogPostRepository;
import GenderHealthCareSystem.repository.CommentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final BlogPostRepository blogPostRepository;

    public CommentResponse saveComment(Comment comment) {
        comment.setStatus("VISIBLE");
        return mapToCommentResponse(commentRepository.save(comment));
    }
    public CommentResponse UpdateComment(CommentRequest updatedComment, int commentId, int userId) {
        Comment existingComment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found with id: " + commentId));
        // Update the content of the existing comment
        if (!existingComment.getUser().getUserId().equals(userId) ) {
            throw new RuntimeException("You do not have permission to update this comment");
        }
        existingComment.setContent(updatedComment.getContent());
        existingComment.setUpdatedAt(java.time.LocalDateTime.now());

        return mapToCommentResponse(commentRepository.save(existingComment));
    }

    public Page<CommentResponse> searchCommentByPostId(int page, int size, String sort, int BlogId) {
        Pageable pageable;
        if ("asc".equalsIgnoreCase(sort)) {
            pageable = PageRequest.of(page, size, Sort.by("createdAt").ascending());
        } else {
            pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        }

        Page<Comment> comments;
        comments = this.commentRepository.searchCommentByBlogPost_PostId(BlogId, pageable);
        return comments.map(this::mapToCommentResponse);
    }

    public void HideComment(Integer id, Integer userId, String role) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found with id: " + id));
        if (comment.getUser().getUserId().equals(userId) || "Staff".equals(role) || "Manager".equals(role)||"Consultant".equals(role)) {
            comment.setStatus("HIDDEN");
            commentRepository.save(comment);
        } else {
            throw new RuntimeException("You do not have permission to hide this comment");
        }

    }

    public CommentResponse mapToCommentResponse(Comment comment) {
        CommentResponse response = new CommentResponse();
        response.setCommentId(comment.getCommentId());
        response.setContent(comment.getContent());
        response.setCreatedAt(comment.getCreatedAt());
        response.setUpdatedAt(comment.getUpdatedAt());
        response.setUserID(comment.getUser().getUserId());
        response.setUserFullName(comment.getUser().getFullName());
        response.setUserImageUrl(comment.getUser().getUserImageUrl());
        return response;
    }
}
