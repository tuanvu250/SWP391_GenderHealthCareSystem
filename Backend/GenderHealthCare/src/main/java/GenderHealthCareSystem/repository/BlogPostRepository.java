package GenderHealthCareSystem.repository;

import GenderHealthCareSystem.model.BlogPost;
import GenderHealthCareSystem.model.Users;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BlogPostRepository extends JpaRepository<BlogPost, Integer> {


    List<BlogPost> findTop4ByStatusOrderByPublishedAtDesc(String status);
    
    @Query("""
    SELECT b FROM BlogPost b
    WHERE (:title IS NULL OR b.title LIKE %:title%)
      AND (:tags IS NULL OR b.tags LIKE %:tags%)
      AND b.status = 'PUBLISHED'
""")
    Page<BlogPost> searchBlogPosts(
            @Param("title") String title,
            @Param("tags") String tags,
            Pageable pageable
    );
    @Query("""
    SELECT b FROM BlogPost b
    WHERE (:title IS NULL OR b.title LIKE %:title%)
      AND (:tags IS NULL OR b.tags LIKE %:tags%)
""")
    Page<BlogPost> searchBlogPostsForManager(
            @Param("title") String title,
            @Param("tags") String tags,
            Pageable pageable
    );
    @Query("""
    SELECT b FROM BlogPost b
    WHERE (:title IS NULL OR b.title LIKE %:title%)
      AND (:tags IS NULL OR b.tags LIKE %:tags%)
      AND (:consultantId IS NULL OR b.consultant.userId = :consultantId)
""")
    Page<BlogPost> searchBlogPostsByAuthor(
            @Param("title") String title,
            @Param("tags") String tags,
            @Param("consultantId") Integer consultantId,
            Pageable pageable
    );


}
