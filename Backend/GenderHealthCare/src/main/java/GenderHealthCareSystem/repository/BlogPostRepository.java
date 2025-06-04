package GenderHealthCareSystem.repository;

import GenderHealthCareSystem.model.BlogPost;
import GenderHealthCareSystem.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BlogPostRepository extends JpaRepository<BlogPost, Integer> {

    List<BlogPost> findByConsultant_UserId(int userId);


    List<BlogPost> findTop4ByOrderByPublishedAtDesc();

}
