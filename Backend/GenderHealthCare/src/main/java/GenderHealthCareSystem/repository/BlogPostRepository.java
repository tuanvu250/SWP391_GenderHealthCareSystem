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

    List<BlogPost> findByConsultant_UserId(int userId);

    List<BlogPost> findTop4ByOrderByPublishedAtDesc();

    @Query("SELECT b FROM BlogPost b WHERE b.title LIKE %:title% AND b.tags LIKE %:tags%")
    Page<BlogPost> findByTitleContainingAndTagsContaining(@Param("title") String title, @Param("tags") String tags, Pageable pageable);

    Page<BlogPost> findByTitleContaining(String title, Pageable pageable);

    Page<BlogPost> findByTagsContaining(String tags, Pageable pageable);
}
