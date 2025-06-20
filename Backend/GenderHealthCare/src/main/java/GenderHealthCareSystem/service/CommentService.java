package GenderHealthCareSystem.service;

import GenderHealthCareSystem.dto.BlogPostResponse;
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

    public void HideComment(Integer id) {
        if (!commentRepository.existsById(id)) {
            throw new RuntimeException("Comment not found with id: " + id);
        }
        commentRepository.findById(id).get().setStatus("HIDDEN");
    }

    public List<Comment> getCommentsByBlogId(Integer blogId) {
        return commentRepository.findByBlogPost_PostIdAndStatus(blogId, "visible");
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
