package GenderHealthCareSystem.repository;

import GenderHealthCareSystem.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Integer> {
    List<Comment> findByBlogPost_PostId(Integer blogId);
}
