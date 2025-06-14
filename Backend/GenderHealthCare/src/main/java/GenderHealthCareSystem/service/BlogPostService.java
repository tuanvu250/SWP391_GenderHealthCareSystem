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
        blogPost.setViewCount(0);
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

    public void updateBlogPost(int id, BlogPost updatedBlogPost) {
        BlogPost existingBlogPost = blogPostRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bài viết với id: " + id));
        // Kiểm tra quyền sửa bài viết
        if (existingBlogPost.isDeleted()) {
            throw new RuntimeException("Bài viết đã bị xóa, không thể sửa");
        }
        existingBlogPost.setTitle(updatedBlogPost.getTitle());
        existingBlogPost.setContent(updatedBlogPost.getContent());
        existingBlogPost.setThumbnailUrl(updatedBlogPost.getThumbnailUrl());
        existingBlogPost.setTags(updatedBlogPost.getTags());

        blogPostRepository.save(existingBlogPost);
    }

    public Page<BlogPostResponse> findBlogPostsByAuthor(String title, String tag, String orderBy, int page, int size, String sort,int Id) {
        Pageable pageable;
        if ("asc".equalsIgnoreCase(sort)) {
            pageable = PageRequest.of(page, size, Sort.by(orderBy).ascending());
        } else {
            pageable = PageRequest.of(page, size, Sort.by(orderBy).descending());
        }

        Page<BlogPost> blogPosts;
        blogPosts = this.blogPostRepository.searchBlogPostsByAuthor(title,tag, Id, pageable);
        return blogPosts.map(this::mapToResponse);
    }

    public List<BlogPostResponse> findFourNewestBlogs() {
        List<BlogPost> blogPosts = blogPostRepository.findTop4ByDeletedFalseOrderByPublishedAtDesc();
        List<BlogPostResponse> responses = new ArrayList<>();
        for (BlogPost blogPost : blogPosts) {
            responses.add(mapToResponse(blogPost));
        }
        return responses;
    }

    public Page<BlogPostResponse> searchBlogPosts(String title, String tag, String orderBy, int page, int size, String sort) {
        Pageable pageable;
        if ("asc".equalsIgnoreCase(sort)) {
            pageable = PageRequest.of(page, size, Sort.by(orderBy).ascending());
        } else {
            pageable = PageRequest.of(page, size, Sort.by(orderBy).descending());
        }

        Page<BlogPost> blogPosts;
        blogPosts = this.blogPostRepository.searchBlogPosts(title,tag, pageable);


        return blogPosts.map(this::mapToResponse);

    }
    public BlogPostResponse getBlogPostById(int id,boolean increaseViewCount) {
        BlogPost blogPost = blogPostRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bài viết với id: " + id));
        if (increaseViewCount) {
            blogPost.setViewCount(blogPost.getViewCount() + 1);
            blogPostRepository.save(blogPost);
        }
        return mapToResponse(blogPost);
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
        blogPostResponse.setViewCount(blogPost.getViewCount());
        return blogPostResponse;
    }
}
