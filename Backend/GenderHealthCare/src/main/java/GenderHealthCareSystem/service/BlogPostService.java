package GenderHealthCareSystem.service;

import GenderHealthCareSystem.dto.BlogPostResponse;
import GenderHealthCareSystem.model.BlogPost;
import GenderHealthCareSystem.repository.BlogPostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
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

    public List<BlogPostResponse> findBlogPostsByAuthor(String ID) {
        List<BlogPost> blogPosts = blogPostRepository.findByConsultant_UserId(Integer.parseInt(ID));
        List<BlogPostResponse> responses = new ArrayList<>();
        for (BlogPost blogPost : blogPosts) {
            responses.add(mapToResponse(blogPost));
        }
        return responses;
    }

    public List<BlogPostResponse> findFourNewestBlogs() {
        List<BlogPost> blogPosts = blogPostRepository.findTop4ByOrderByPublishedAtDesc();
        List<BlogPostResponse> responses = new ArrayList<>();
        for (BlogPost blogPost : blogPosts) {
            responses.add(mapToResponse(blogPost));
        }
        return responses;
    }

    public Page<BlogPostResponse> searchBlogPosts(String title, String tag, int page, int size, String sort) {
        Pageable pageable;
        if ("asc".equalsIgnoreCase(sort)) {
            pageable = PageRequest.of(page, size, Sort.by("publishedAt").ascending());
        } else {
            pageable = PageRequest.of(page, size, Sort.by("publishedAt").descending());
        }

        Page<BlogPost> blogPosts;
        if (title != null && tag != null) {
            blogPosts = blogPostRepository.findByTitleContainingAndTagsContaining(title, tag, pageable);
        } else if (title != null) {
            blogPosts = blogPostRepository.findByTitleContaining(title, pageable);
        } else if (tag != null) {
            blogPosts = blogPostRepository.findByTagsContaining(tag, pageable);
        } else {
            blogPosts = blogPostRepository.findAll(pageable);
        }

        return blogPosts.map(this::mapToResponse);

    }

    public BlogPostResponse mapToResponse(BlogPost blogPost) {
        BlogPostResponse blogPostResponse = new BlogPostResponse();
        blogPostResponse.setPostId(blogPost.getPostId());
        blogPostResponse.setTitle(blogPost.getTitle());
        blogPostResponse.setContent(blogPost.getContent());
        blogPostResponse.setThumbnailUrl(blogPost.getThumbnailUrl());
        blogPostResponse.setPublishedAt(blogPost.getPublishedAt());
        blogPostResponse.setTags(blogPost.getTags());
        blogPostResponse.setConsultantId(blogPost.getConsultant().getUserId());
        blogPostResponse.setConsultantName(blogPost.getConsultant().getFullName());
        blogPostResponse.setConsultantImageUrl(blogPost.getConsultant().getUserImageUrl());
        return blogPostResponse;
    }
}
