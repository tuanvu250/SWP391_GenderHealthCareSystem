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
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BlogPostService {
    private final BlogPostRepository blogPostRepository;

    public void saveBlogPost(BlogPost blogPost) {
        blogPost.setStatus("PENDING");
        blogPost.setPublishedAt(java.time.LocalDateTime.now());
        blogPost.setViewCount(0);
        blogPost.setLikeCount(0);
        this.blogPostRepository.save(blogPost);
    }

    public BlogPost findBlogPostById(int id) {
        return blogPostRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bài viết với id " + id));
    }

    public void deleteBlogPostById(int id) {
        BlogPost blog = blogPostRepository.findById(id).get();
        if (blog == null) {
            throw new RuntimeException("Không tìm thấy bài viết với id: " + id);
        }
        blog.setStatus("DELETED");
        this.blogPostRepository.save(blog);
    }

    public void approveBlogPost(int id) {
        BlogPost blog = blogPostRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bài viết với id: " + id));
        if ("DELETED".equals(blog.getStatus())) {
            throw new RuntimeException("Bài viết này đã bị xóa và không thể được phê duyệt.");
        }
        blog.setStatus("PUBLISHED");
        blogPostRepository.save(blog);
    }
    public void rejectBlogPost(Integer id) {
        BlogPost blog = blogPostRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bài viết với id: " + id));
        if ("DELETED".equals(blog.getStatus())) {
            throw new RuntimeException("Bài viết này đã bị xóa và không thể được phê duyệt.");
        }
        blog.setStatus("Rejected");
        blogPostRepository.save(blog);
    }

    public void updateBlogPost(int id, BlogPost updatedBlogPost) {
        BlogPost existingBlogPost = blogPostRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bài viết với id: " + id));
        // Kiểm tra quyền sửa bài viết
        if ("DELETED".equals(existingBlogPost.getStatus())) {
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
        List<BlogPost> blogPosts = blogPostRepository.findTop4ByStatusOrderByPublishedAtDesc("PUBLISHED");
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
    public Page<BlogPostResponse> searchBlogPostsForManager(String title, String tag, String orderBy, int page, int size, String sort) {
        Pageable pageable;
        if ("asc".equalsIgnoreCase(sort)) {
            pageable = PageRequest.of(page, size, Sort.by(orderBy).ascending());
        } else {
            pageable = PageRequest.of(page, size, Sort.by(orderBy).descending());
        }

        Page<BlogPost> blogPosts;
        blogPosts = this.blogPostRepository.searchBlogPostsForManager(title,tag, pageable);


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

    public void increaseLikeCount(int id) {
        BlogPost blogPost = blogPostRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bài viết với id: " + id));
        blogPost.setLikeCount(blogPost.getLikeCount() + 1);
        blogPostRepository.save(blogPost);
    }

    public List<BlogPostResponse> findRelatedBlogPosts(String tags, Integer postId) {
        // Split the tags string into individual tags
        String[] tagArray = tags.split(",");

        // Prepare a list to hold related blog posts
        List<BlogPost> relatedBlogPosts = new ArrayList<>();
        HashMap<Integer, BlogPost> relatedBlogPostsMap = new HashMap<Integer, BlogPost>();
        // Fetch related blog posts for each tag
        for (String tag : tagArray) {
            relatedBlogPosts= new ArrayList<>();
            relatedBlogPosts.addAll(blogPostRepository.findRelatedBlogPosts(tag.trim(), postId));
            // Add to map to avoid duplicates
            for (BlogPost blogPost : relatedBlogPosts) {
                if (!relatedBlogPostsMap.containsKey(blogPost.getPostId())) {
                    relatedBlogPostsMap.put(blogPost.getPostId(), blogPost);
                }
            }
        }
        // Convert the map values to a list
        relatedBlogPosts = new ArrayList<>(relatedBlogPostsMap.values());
        System.out.println("Related blog posts found: " + relatedBlogPosts.size());

        // Shuffle the list to randomize the order
        Collections.shuffle(relatedBlogPosts);

        // Limit the list to 4 items
        List<BlogPost> limitedBlogPosts = relatedBlogPosts.stream().limit(3).toList();
        System.out.println("Limited blog posts: " + limitedBlogPosts.size());
        // Map the related blog posts to response objects
        List<BlogPostResponse> responses = new ArrayList<>();
        for (BlogPost blogPost : limitedBlogPosts) {
            responses.add(mapToResponse(blogPost));
        }

        return responses;
    }
    public List<BlogPostResponse> findRelatedBlogPostsByTags(String tags) {
        String[] tagArray = tags.split(",");

        // Prepare a list to hold related blog posts
        List<BlogPost> relatedBlogPosts = new ArrayList<>();
        HashMap<Integer, BlogPost> relatedBlogPostsMap = new HashMap<Integer, BlogPost>();

        // Fetch related blog posts for each tag
        for (String tag : tagArray) {
            relatedBlogPosts = new ArrayList<>();
            relatedBlogPosts.addAll(blogPostRepository.findRelatedBlogPostsByTag(tag.trim()));
            for (BlogPost blogPost : relatedBlogPosts) {
                if (!relatedBlogPostsMap.containsKey(blogPost.getPostId())) {
                    relatedBlogPostsMap.put(blogPost.getPostId(), blogPost);
                }
            }
        }
        // Convert the map values to a list
        relatedBlogPosts = new ArrayList<>(relatedBlogPostsMap.values());

        // Shuffle the list to randomize the order
        Collections.shuffle(relatedBlogPosts);

        // Limit the list to 4 items
        List<BlogPost> limitedBlogPosts = relatedBlogPosts.stream().limit(3).toList();

        // Map the related blog posts to response objects
        List<BlogPostResponse> responses = new ArrayList<>();
        for (BlogPost blogPost : limitedBlogPosts) {
            responses.add(mapToResponse(blogPost));
        }

        return responses;
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
        blogPostResponse.setLikeCount(blogPost.getLikeCount());
        blogPostResponse.setStatus(blogPost.getStatus());
        return blogPostResponse;
    }



}
