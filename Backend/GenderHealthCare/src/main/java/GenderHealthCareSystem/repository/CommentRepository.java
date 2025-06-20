package GenderHealthCareSystem.repository;

import GenderHealthCareSystem.model.BlogPost;
import GenderHealthCareSystem.model.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Integer> {
    List<Comment> findByBlogPost_PostId(Integer blogId);

    @Query("SELECT c FROM Comment c WHERE c.blogPost.postId = :blogId" +
            " AND c.status = 'VISIBLE'")
    Page<Comment> searchCommentByBlogPost_PostId(@Param("blogId") Integer blogId, Pageable pageable);


    List<Comment> findByBlogPost_PostIdAndStatus(Integer blogId, String visible);
}
