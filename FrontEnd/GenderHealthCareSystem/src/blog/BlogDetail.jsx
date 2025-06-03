import React, { useState, useEffect } from 'react';
import { Typography, Avatar, Tag, Space, Divider, Button, Card, Row, Col, Breadcrumb, Spin, Image } from 'antd';
import { 
  ArrowLeftOutlined, 
  CalendarOutlined, 
  UserOutlined, 
  ShareAltOutlined,
  FacebookOutlined,
  TwitterOutlined,
  LinkedinOutlined
} from '@ant-design/icons';
import { useParams, useNavigate, Link } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState([]);

  // Dữ liệu mẫu cho bài viết chi tiết
  const blogData = {
    id: 1,
    title: "Chu kỳ kinh nguyệt không đều: Nguyên nhân và giải pháp",
    content: `
      <p>Chu kỳ kinh nguyệt không đều là tình trạng phổ biến ảnh hưởng đến nhiều phụ nữ trong độ tuổi sinh sản. Điều này có thể gây ra lo lắng và khó khăn trong việc dự đoán thời gian rụng trứng, đặc biệt đối với những người đang cố gắng có thai.</p>

      <h2>Chu kỳ kinh nguyệt bình thường</h2>
      <p>Một chu kỳ kinh nguyệt được tính từ ngày đầu tiên của kỳ kinh nguyệt đến ngày đầu tiên của kỳ kinh nguyệt tiếp theo. Thông thường, chu kỳ này kéo dài từ 21 đến 35 ngày. Tuy nhiên, đối với nhiều phụ nữ, chu kỳ có thể ngắn hơn hoặc dài hơn và vẫn được coi là bình thường nếu nó nhất quán.</p>

      <h2>Khi nào chu kỳ kinh nguyệt được coi là không đều?</h2>
      <p>Chu kỳ kinh nguyệt được coi là không đều khi:</p>
      <ul>
        <li>Thời gian giữa các chu kỳ thay đổi đáng kể (hơn 7-9 ngày)</li>
        <li>Chu kỳ ngắn hơn 21 ngày hoặc dài hơn 35 ngày</li>
        <li>Lượng máu kinh thay đổi đáng kể từ kỳ kinh này đến kỳ kinh khác</li>
        <li>Số ngày hành kinh thay đổi đáng kể</li>
      </ul>

      <h2>Nguyên nhân phổ biến của chu kỳ kinh nguyệt không đều</h2>
      
      <h3>1. Mất cân bằng hormone</h3>
      <p>Sự mất cân bằng trong các hormone kiểm soát chu kỳ kinh nguyệt - đặc biệt là estrogen và progesterone - có thể dẫn đến chu kỳ không đều. Điều này có thể do nhiều yếu tố, bao gồm rối loạn tuyến giáp, buồng trứng đa nang (PCOS), hoặc thay đổi hormon liên quan đến tuổi tác.</p>

      <h3>2. Căng thẳng</h3>
      <p>Căng thẳng mạn tính có thể ảnh hưởng đến vùng dưới đồi trong não, một vùng kiểm soát tuyến yên tiết ra hormone điều hòa buồng trứng. Điều này có thể làm gián đoạn chu kỳ bình thường.</p>

      <h3>3. Thay đổi cân nặng đáng kể</h3>
      <p>Tăng hoặc giảm cân nhanh chóng có thể ảnh hưởng đến việc sản xuất hormone và gây ra chu kỳ không đều. Cả lượng mỡ cơ thể quá thấp (như trong trường hợp của vận động viên nữ) và quá cao đều có thể gây ra vấn đề.</p>

      <h3>4. Hội chứng buồng trứng đa nang (PCOS)</h3>
      <p>PCOS là một tình trạng hormone phổ biến gây ra bởi sự mất cân bằng hormone sinh dục. Phụ nữ mắc PCOS thường có chu kỳ kinh nguyệt không đều hoặc không có kinh nguyệt.</p>

      <h3>5. Các bệnh lý về tuyến giáp</h3>
      <p>Cả suy giáp (tuyến giáp hoạt động kém) và cường giáp (tuyến giáp hoạt động quá mức) đều có thể gây ra chu kỳ kinh nguyệt không đều.</p>

      <h3>6. Các phương pháp tránh thai</h3>
      <p>Một số biện pháp tránh thai, như thuốc tránh thai, vòng tránh thai, hoặc thuốc tiêm tránh thai, có thể ảnh hưởng đến chu kỳ kinh nguyệt.</p>

      <h2>Giải pháp cho chu kỳ kinh nguyệt không đều</h2>

      <h3>1. Theo dõi chu kỳ</h3>
      <p>Việc theo dõi chu kỳ kinh nguyệt có thể giúp bạn nhận ra các mô hình và chia sẻ thông tin chính xác với bác sĩ. Sử dụng ứng dụng theo dõi kinh nguyệt hoặc ghi chép thủ công về ngày bắt đầu và kết thúc chu kỳ, cũng như các triệu chứng kèm theo.</p>

      <h3>2. Duy trì cân nặng khỏe mạnh</h3>
      <p>Nếu thừa cân hoặc thiếu cân, việc đạt được cân nặng khỏe mạnh có thể giúp điều chỉnh chu kỳ kinh nguyệt. Hãy tư vấn với bác sĩ về kế hoạch giảm cân hoặc tăng cân phù hợp.</p>

      <h3>3. Giảm căng thẳng</h3>
      <p>Thực hành các kỹ thuật giảm căng thẳng như yoga, thiền, hoặc các bài tập thở sâu có thể giúp cải thiện chu kỳ kinh nguyệt. Đảm bảo ngủ đủ giấc và duy trì lối sống cân bằng.</p>

      <h3>4. Tập thể dục đều đặn nhưng không quá mức</h3>
      <p>Hoạt động thể chất vừa phải có thể giúp duy trì cân bằng hormone và chu kỳ kinh nguyệt đều đặn. Tuy nhiên, tập luyện quá mức có thể có tác dụng ngược lại.</p>

      <h3>5. Xem xét các biện pháp tránh thai khác</h3>
      <p>Nếu bạn nghĩ rằng phương pháp tránh thai hiện tại là nguyên nhân gây ra chu kỳ không đều, hãy thảo luận với bác sĩ về các lựa chọn thay thế.</p>

      <h3>6. Điều trị y tế</h3>
      <p>Tùy thuộc vào nguyên nhân cơ bản, bác sĩ có thể đề xuất:</p>
      <ul>
        <li>Thuốc tránh thai kết hợp để điều hòa chu kỳ</li>
        <li>Thuốc điều trị các tình trạng như PCOS hoặc rối loạn tuyến giáp</li>
        <li>Bổ sung progesterone để kích thích kinh nguyệt nếu bạn đã bỏ lỡ một kỳ kinh</li>
      </ul>

      <h2>Khi nào nên gặp bác sĩ</h2>
      <p>Bạn nên tham khảo ý kiến bác sĩ nếu:</p>
      <ul>
        <li>Chu kỳ kinh nguyệt thường xuyên ngắn hơn 21 ngày hoặc dài hơn 35 ngày</li>
        <li>Chu kỳ của bạn thay đổi đột ngột</li>
        <li>Bạn không có kinh nguyệt trong hơn 3 tháng (và không mang thai)</li>
        <li>Kinh nguyệt kéo dài hơn 7 ngày</li>
        <li>Lượng máu kinh quá nhiều hoặc có cục máu đông lớn</li>
        <li>Bạn bị đau bụng dữ dội trong kỳ kinh</li>
        <li>Bạn bị chảy máu giữa chu kỳ</li>
      </ul>

      <h2>Lời kết</h2>
      <p>Chu kỳ kinh nguyệt không đều có thể gây khó chịu và lo lắng, nhưng trong nhiều trường hợp, có thể được cải thiện thông qua thay đổi lối sống hoặc điều trị y tế. Hiểu về chu kỳ của bạn và các yếu tố ảnh hưởng đến nó là bước đầu tiên hướng tới việc quản lý hiệu quả sức khỏe sinh sản của bạn.</p>
      
      <p>Hãy nhớ rằng mỗi cơ thể phụ nữ là khác nhau, và điều quan trọng là hiểu được những gì là "bình thường" đối với bạn. Việc theo dõi chu kỳ kinh nguyệt định kỳ và tham khảo ý kiến bác sĩ khi có thay đổi đáng kể là cách tốt nhất để duy trì sức khỏe sinh sản tối ưu.</p>
    `,
    image: "https://img.freepik.com/free-photo/woman-suffering-from-menstrual-pain_23-2148741815.jpg",
    coverImage: "https://img.freepik.com/free-photo/woman-with-painful-abdomen-white-background_1150-21000.jpg?size=626&ext=jpg&ga=GA1.1.632798143.1708992000&semt=ais",
    tags: [
      { value: "suc-khoe-phu-nu", label: "Sức khỏe phụ nữ", color: "blue" },
      { value: "kinh-nguyet", label: "Kinh nguyệt", color: "cyan" }
    ],
    author: {
      name: "BS. Trần Minh Hà",
      avatar: "https://randomuser.me/api/portraits/women/22.jpg",
      bio: "Bác sĩ chuyên khoa sản phụ khoa với hơn 10 năm kinh nghiệm, chuyên về sức khỏe sinh sản và nội tiết phụ khoa."
    },
    date: "2023-05-15",
    readTime: "8 phút",
    views: 1250
  };

  // Dữ liệu mẫu cho bài viết liên quan
  const sampleRelatedPosts = [
    {
      id: 2,
      title: "5 dấu hiệu cần đi khám sức khỏe sinh sản ngay lập tức",
      excerpt: "Những dấu hiệu cảnh báo về vấn đề sức khỏe sinh sản không nên bỏ qua và lợi ích của việc thăm khám sớm.",
      image: "https://img.freepik.com/free-photo/doctor-patient-medical-consultation-hospital-office_1303-21297.jpg",
      date: "2023-06-02",
      author: {
        name: "BS. Nguyễn Văn Lâm",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg"
      }
    },
    {
      id: 5,
      title: "Cách chăm sóc da trong thời kỳ kinh nguyệt",
      excerpt: "Mẹo hữu ích để chăm sóc da trong thời kỳ kinh nguyệt khi hormone thay đổi có thể ảnh hưởng đến tình trạng da.",
      image: "https://img.freepik.com/free-photo/woman-applying-face-cream_23-2148896787.jpg",
      date: "2023-07-18",
      author: {
        name: "BS. Ngô Thanh Mai",
        avatar: "https://randomuser.me/api/portraits/women/67.jpg"
      }
    },
    {
      id: 8,
      title: "Đối phó với hội chứng tiền kinh nguyệt (PMS): Phương pháp tự nhiên",
      excerpt: "Khám phá các phương pháp tự nhiên giúp giảm triệu chứng của hội chứng tiền kinh nguyệt.",
      image: "https://img.freepik.com/free-photo/sad-woman-bed-suffering-from-pain_23-2148825302.jpg",
      date: "2023-09-10",
      author: {
        name: "BS. Lê Thị Hoa",
        avatar: "https://randomuser.me/api/portraits/women/56.jpg"
      }
    }
  ];

  useEffect(() => {
    // Giả lập API call
    const fetchBlog = () => {
      setLoading(true);
      // Trong thực tế, bạn sẽ gọi API với ID từ params
      setTimeout(() => {
        setBlog(blogData);
        setRelatedPosts(sampleRelatedPosts);
        setLoading(false);
        // Scroll to top when page loads
        window.scrollTo(0, 0);
      }, 500);
    };

    fetchBlog();
  }, [id]);

  const handleGoBack = () => {
    navigate(-1); // Quay lại trang trước đó
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <Button type="primary" icon={<ArrowLeftOutlined />} onClick={handleGoBack}>
          Quay lại
        </Button>
        <div className="text-center mt-8">
          <Title level={3}>Không tìm thấy bài viết</Title>
          <Button type="primary" onClick={() => navigate('/blog')}>
            Xem tất cả bài viết
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-6 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Breadcrumb và nút quay lại */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <Breadcrumb 
            items={[
              { title: <Link to="/">Trang chủ</Link> },
              { title: <Link to="/blog">Blog</Link> },
              { title: blog.title }
            ]}
          />
          
          <Button 
            type="primary" 
            icon={<ArrowLeftOutlined />} 
            onClick={handleGoBack}
            className="mt-2 sm:mt-0"
          >
            Quay lại
          </Button>
        </div>

        {/* Ảnh bìa bài viết */}
        <div className="mb-8 rounded-xl overflow-hidden">
          <img 
            src={blog.coverImage || blog.image} 
            alt={blog.title} 
            className="w-full h-[300px] sm:h-[400px] object-cover"
          />
        </div>

        {/* Tiêu đề và thông tin bài viết */}
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm mb-8">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {blog.tags.map((tag, index) => (
              <Tag color={tag.color} key={index}>
                {tag.label}
              </Tag>
            ))}
          </div>

          {/* Tiêu đề */}
          <Title level={1} className="text-2xl sm:text-3xl md:text-4xl mb-6">
            {blog.title}
          </Title>

          {/* Thông tin tác giả và ngày đăng */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-gray-200">
            <Space size="large">
              <Space>
                <Avatar src={blog.author.avatar} size={40} />
                <div>
                  <Text strong>{blog.author.name}</Text>
                  <div className="text-gray-500 text-sm">{blog.author.bio}</div>
                </div>
              </Space>
            </Space>

            <Space className="mt-4 sm:mt-0 text-gray-500">
              <Space>
                <CalendarOutlined />
                <span>{blog.date}</span>
              </Space>
            </Space>
          </div>

          {/* Nội dung bài viết */}
          <div 
            className="prose max-w-none mt-8 blog-content"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {/* Chia sẻ bài viết */}
          <Divider />
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <Text strong>Chia sẻ bài viết này:</Text>
            <Space className="mt-2 sm:mt-0">
              <Button icon={<FacebookOutlined />} shape="circle" />
              <Button icon={<TwitterOutlined />} shape="circle" />
              <Button icon={<LinkedinOutlined />} shape="circle" />
              <Button icon={<ShareAltOutlined />} shape="circle" />
            </Space>
          </div>
        </div>

        {/* Bài viết liên quan */}
        <div className="mb-12">
          <Title level={3} className="mb-6">Bài viết liên quan</Title>
          <Row gutter={[16, 16]}>
            {relatedPosts.map(post => (
              <Col xs={24} sm={12} lg={8} key={post.id}>
                <Card
                  hoverable
                  cover={
                    <div className="h-40 overflow-hidden">
                      <img
                        alt={post.title}
                        src={post.image}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  }
                  onClick={() => navigate(`/blog/${post.id}`)}
                >
                  <Title level={5} className="mb-2 line-clamp-2">
                    {post.title}
                  </Title>
                  <Paragraph className="text-gray-600 mb-3 line-clamp-2">
                    {post.excerpt}
                  </Paragraph>
                  <div className="flex justify-between items-center">
                    <Space>
                      <Avatar src={post.author.avatar} size="small" />
                      <Text className="text-xs">{post.author.name}</Text>
                    </Space>
                    <Text className="text-xs text-gray-500">{post.date}</Text>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* Nút quay lại cuối trang */}
        <div className="text-center mb-8">
          <Button type="primary" onClick={() => navigate('/blog')}>
            Xem tất cả bài viết
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;