package GenderHealthCareSystem.service;

import GenderHealthCareSystem.model.BlogPost;
import GenderHealthCareSystem.repository.BlogPostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BlogPostService {
    private final BlogPostRepository blogPostRepository;

    public void saveBlogPost(BlogPost blogPost) {
        blogPost.setDeleted(false);
        blogPost.setPublishedAt(java.time.LocalDateTime.now());
        this.blogPostRepository.save(blogPost);
    }

    public BlogPost findBlogPostById(int id) {
        return blogPostRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bài viết với id " + id));
    }

    public void deleteBlogPostById(int id) {
        BlogPost blog= blogPostRepository.findById(id).get();
        if (blog == null) {
            throw new RuntimeException("Không tìm thấy bài viết với id: " + id);
        }
        blog.setDeleted(true);
        this.blogPostRepository.save(blog);

    }

    public void updateBlogPost(BlogPost blogPost) {
        if (blogPost.getPostId() == null || !blogPostRepository.existsById(blogPost.getPostId())) {
            throw new RuntimeException("Không tìm thấy bài viết với id: " + blogPost.getPostId());
        }
        blogPostRepository.save(blogPost);
    }

    public List<BlogPost> findAllBlogPosts() {
        return blogPostRepository.findAll();
    }

    public List<BlogPost> findBlogPostsByAuthor(String ID) {
        return blogPostRepository.findByConsultant_UserId(Integer.parseInt(ID));
    }

    public List<BlogPost> findFourNewestBlogs() {
        return blogPostRepository.findTop4ByOrderByPublishedAtDesc();
    }
         

}
