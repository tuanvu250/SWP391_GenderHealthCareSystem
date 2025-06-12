import React, { useState, useEffect } from 'react';
import { Typography, Input, Select, Card, Tag, Avatar, Row, Col, Divider, Space, Pagination, Button, Empty } from 'antd';
import { SearchOutlined, CalendarOutlined, UserOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;
const { Option } = Select;

const Blog = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [sortOrder, setSortOrder] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 8; // Điều chỉnh số lượng bài hiển thị để chia hết cho 4
  
  // Giữ nguyên dữ liệu mẫu blog posts
  const blogPosts = [
    {
      id: 1,
      title: "Chu kỳ kinh nguyệt không đều: Nguyên nhân và giải pháp",
      excerpt: "Tìm hiểu về các yếu tố ảnh hưởng đến chu kỳ kinh nguyệt và những cách giúp cải thiện tình trạng không đều. Bài viết cung cấp thông tin về các triệu chứng, nguyên nhân phổ biến và phương pháp điều trị.",
      image: "https://img.freepik.com/free-photo/woman-suffering-from-menstrual-pain_23-2148741815.jpg",
      tags: [
        { value: "suc-khoe-phu-nu", label: "Sức khỏe phụ nữ", color: "blue" },
        { value: "kinh-nguyet", label: "Kinh nguyệt", color: "cyan" }
      ],
      author: {
        name: "BS. Trần Minh Hà",
        avatar: "https://randomuser.me/api/portraits/women/22.jpg"
      },
      date: "2023-05-15"
    },
    {
      id: 2,
      title: "5 dấu hiệu cần đi khám sức khỏe sinh sản ngay lập tức",
      excerpt: "Những dấu hiệu cảnh báo về vấn đề sức khỏe sinh sản không nên bỏ qua và lợi ích của việc thăm khám sớm. Bài viết giúp bạn nhận biết các triệu chứng cần được quan tâm để bảo vệ sức khỏe.",
      image: "https://img.freepik.com/free-photo/doctor-patient-medical-consultation-hospital-office_1303-21297.jpg",
      tags: [
        { value: "suc-khoe-sinh-san", label: "Sức khỏe sinh sản", color: "purple" },
        { value: "tu-van", label: "Tư vấn", color: "green" }
      ],
      author: {
        name: "BS. Nguyễn Văn Lâm",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg"
      },
      date: "2023-06-02"
    },
    {
      id: 3,
      title: "Xét nghiệm STI: Khi nào nên thực hiện và những điều cần biết",
      excerpt: "Hướng dẫn chi tiết về các loại xét nghiệm STI, thời điểm nên thực hiện và cách đọc kết quả xét nghiệm. Bài viết này cung cấp thông tin cần thiết để chủ động bảo vệ sức khỏe của bạn.",
      image: "https://img.freepik.com/free-photo/doctor-explaining-diagnosis-patient_23-2148030315.jpg",
      tags: [
        { value: "STIs", label: "STIs", color: "red" },
        { value: "xet-nghiem", label: "Xét nghiệm", color: "orange" }
      ],
      author: {
        name: "BS. Phạm Thu Hương",
        avatar: "https://randomuser.me/api/portraits/women/45.jpg"
      },
      date: "2023-06-20"
    },
    {
      id: 4,
      title: "Sức khỏe tình dục: Những điều cần biết về các bệnh lây truyền",
      excerpt: "Tổng quan về các bệnh lây truyền qua đường tình dục phổ biến, cách phòng tránh và điều trị hiệu quả. Hiểu rõ hơn về cách bảo vệ bản thân và đối tác của bạn.",
      image: "https://img.freepik.com/free-photo/close-up-doctor-with-stethoscope_23-2149191355.jpg",
      tags: [
        { value: "giao-duc-gioi-tinh", label: "Giáo dục giới tính", color: "magenta" },
        { value: "phong-ngua", label: "Phòng ngừa", color: "blue" }
      ],
      author: {
        name: "BS. Lê Minh Quân",
        avatar: "https://randomuser.me/api/portraits/men/55.jpg"
      },
      date: "2023-07-05"
    },
    {
      id: 5,
      title: "Cách chăm sóc da trong thời kỳ kinh nguyệt",
      excerpt: "Mẹo hữu ích để chăm sóc da trong thời kỳ kinh nguyệt khi hormone thay đổi có thể ảnh hưởng đến tình trạng da. Bài viết giúp bạn duy trì làn da khỏe mạnh trong suốt chu kỳ.",
      image: "https://img.freepik.com/free-photo/woman-applying-face-cream_23-2148896787.jpg",
      tags: [
        { value: "kinh-nguyet", label: "Kinh nguyệt", color: "cyan" },
        { value: "cham-soc", label: "Chăm sóc", color: "geekblue" }
      ],
      author: {
        name: "BS. Ngô Thanh Mai",
        avatar: "https://randomuser.me/api/portraits/women/67.jpg"
      },
      date: "2023-07-18"
    },
    {
      id: 6,
      title: "Dinh dưỡng cho phụ nữ mang thai: Những thực phẩm cần và nên tránh",
      excerpt: "Hướng dẫn chi tiết về chế độ dinh dưỡng cân bằng cho phụ nữ mang thai, bao gồm danh sách thực phẩm nên ăn và những thực phẩm cần tránh để đảm bảo sức khỏe cho mẹ và bé.",
      image: "https://img.freepik.com/free-photo/pregnant-woman-eating-healthy-salad_23-2148948803.jpg",
      tags: [
        { value: "suc-khoe-phu-nu", label: "Sức khỏe phụ nữ", color: "blue" },
        { value: "mang-thai", label: "Mang thai", color: "pink" }
      ],
      author: {
        name: "BS. Đỗ Thị Hồng",
        avatar: "https://randomuser.me/api/portraits/women/33.jpg"
      },
      date: "2023-08-05"
    },
    {
      id: 7,
      title: "Những hiểu lầm phổ biến về tránh thai khẩn cấp",
      excerpt: "Phân tích các hiểu lầm phổ biến về biện pháp tránh thai khẩn cấp và cung cấp thông tin chính xác về cách sử dụng, hiệu quả và tác dụng phụ có thể xảy ra.",
      image: "https://img.freepik.com/free-photo/alarm-clock-pills-calendar-birth-control-concept_23-2148548454.jpg",
      tags: [
        { value: "tranh-thai", label: "Tránh thai", color: "geekblue" },
        { value: "giao-duc-gioi-tinh", label: "Giáo dục giới tính", color: "magenta" }
      ],
      author: {
        name: "DS. Trần Thị Lan",
        avatar: "https://randomuser.me/api/portraits/women/28.jpg"
      },
      date: "2023-08-22"
    },
    {
      id: 8,
      title: "Đối phó với hội chứng tiền kinh nguyệt (PMS): Phương pháp tự nhiên",
      excerpt: "Khám phá các phương pháp tự nhiên giúp giảm triệu chứng của hội chứng tiền kinh nguyệt, từ thay đổi chế độ ăn uống đến các bài tập thể dục và kỹ thuật thư giãn.",
      image: "https://img.freepik.com/free-photo/sad-woman-bed-suffering-from-pain_23-2148825302.jpg",
      tags: [
        { value: "kinh-nguyet", label: "Kinh nguyệt", color: "cyan" },
        { value: "suc-khoe-phu-nu", label: "Sức khỏe phụ nữ", color: "blue" }
      ],
      author: {
        name: "BS. Lê Thị Hoa",
        avatar: "https://randomuser.me/api/portraits/women/56.jpg"
      },
      date: "2023-09-10"
    },
    {
      id: 9,
      title: "Sức khỏe sinh sản nam giới: Những vấn đề thường gặp và cách phòng ngừa",
      excerpt: "Tìm hiểu về các vấn đề sức khỏe sinh sản phổ biến ở nam giới, dấu hiệu cần chú ý và cách phòng ngừa để duy trì sức khỏe sinh sản tối ưu.",
      image: "https://img.freepik.com/free-photo/male-patient-doctor_23-2148970247.jpg",
      tags: [
        { value: "suc-khoe-nam-gioi", label: "Sức khỏe nam giới", color: "volcano" },
        { value: "phong-ngua", label: "Phòng ngừa", color: "blue" }
      ],
      author: {
        name: "BS. Nguyễn Đình Tuấn",
        avatar: "https://randomuser.me/api/portraits/men/42.jpg"
      },
      date: "2023-09-28"
    },
    {
      id: 10,
      title: "Chẩn đoán và điều trị lạc nội mạc tử cung",
      excerpt: "Thông tin chi tiết về bệnh lạc nội mạc tử cung, phương pháp chẩn đoán hiện đại và các lựa chọn điều trị hiệu quả cho phụ nữ mắc bệnh này.",
      image: "https://img.freepik.com/free-photo/woman-having-consultation-with-female-doctor_23-2149875566.jpg",
      tags: [
        { value: "suc-khoe-phu-nu", label: "Sức khỏe phụ nữ", color: "blue" },
        { value: "dieu-tri", label: "Điều trị", color: "gold" }
      ],
      author: {
        name: "BS. Phạm Hoàng Mai",
        avatar: "https://randomuser.me/api/portraits/women/72.jpg"
      },
      date: "2023-10-15"
    },
    {
      id: 11,
      title: "Những câu hỏi thường gặp về sàng lọc trước sinh",
      excerpt: "Giải đáp các câu hỏi phổ biến về sàng lọc trước sinh, bao gồm các loại xét nghiệm, thời điểm thích hợp và cách hiểu kết quả để có quyết định đúng đắn.",
      image: "https://img.freepik.com/free-photo/pregnant-woman-doctor-consultation_23-2148968170.jpg",
      tags: [
        { value: "mang-thai", label: "Mang thai", color: "pink" },
        { value: "xet-nghiem", label: "Xét nghiệm", color: "orange" }
      ],
      author: {
        name: "BS. Trần Thị Minh",
        avatar: "https://randomuser.me/api/portraits/women/62.jpg"
      },
      date: "2023-11-05"
    },
    {
      id: 12,
      title: "Vaccine HPV: Hiệu quả và độ an toàn trong phòng ngừa ung thư cổ tử cung",
      excerpt: "Tổng quan về vaccine HPV, lợi ích của việc tiêm phòng, lứa tuổi khuyến cáo và các nghiên cứu về hiệu quả lâu dài trong việc phòng ngừa ung thư cổ tử cung.",
      image: "https://img.freepik.com/free-photo/doctor-vaccinating-patient-clinic_23-2148752498.jpg",
      tags: [
        { value: "phong-ngua", label: "Phòng ngừa", color: "blue" },
        { value: "vaccine", label: "Vaccine", color: "lime" }
      ],
      author: {
        name: "BS. Lê Văn Hải",
        avatar: "https://randomuser.me/api/portraits/men/75.jpg"
      },
      date: "2023-11-20"
    }
  ];

  // Danh sách tất cả các tag từ blog posts
  const allTags = Array.from(
    new Set(
      blogPosts.flatMap(post => post.tags.map(tag => JSON.stringify(tag)))
    )
  ).map(tag => JSON.parse(tag));
  
  // Lọc bài viết dựa trên search và tags
  const getFilteredPosts = () => {
    return blogPosts
      .filter(post => {
        // Lọc theo từ khóa tìm kiếm
        const matchesSearch = 
          searchQuery === '' || 
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
        
        // Lọc theo tags
        const matchesTags = 
          selectedTags.length === 0 || 
          post.tags.some(tag => selectedTags.includes(tag.value));
        
        return matchesSearch && matchesTags;
      })
      .sort((a, b) => {
        // Sắp xếp theo thời gian
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        
        if (sortOrder === 'newest') {
          return dateB - dateA;
        } else {
          return dateA - dateB;
        }
      });
  };
  
  // Lấy danh sách các bài viết đã lọc
  const filteredPosts = getFilteredPosts();
  
  // Tính toán phân trang
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  
  // Thay đổi trang
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Reset về trang đầu khi thay đổi bộ lọc
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedTags, sortOrder]);
  
  // Xử lý thay đổi từ khóa tìm kiếm
  const handleSearch = (value) => {
    setSearchQuery(value);
  };
  
  // Xử lý thay đổi tags
  const handleTagChange = (values) => {
    setSelectedTags(values);
  };
  
  // Xử lý thay đổi thứ tự sắp xếp
  const handleSortChange = (value) => {
    setSortOrder(value);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-100vw mx-auto md:px-16 px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Title level={1} className="text-3xl md:text-4xl font-bold text-gray-800">
            Blog Sức Khỏe
          </Title>
          <h2 className="text-gray-600 max-w-2xl mx-auto mt-4">
            Khám phá kiến thức mới nhất về sức khỏe giới tính và chủ đề liên quan từ các chuyên gia hàng đầu
          </h2>
        </div>
        
        {/* Search & Filter Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} md={10}>
              <Search
                placeholder="Tìm kiếm bài viết..."
                allowClear
                enterButton={<><SearchOutlined /> Tìm kiếm</>}
                size="large"
                onSearch={handleSearch}
              />
            </Col>
            
            <Col xs={24} md={8}>
              <Select
                mode="multiple"
                allowClear
                style={{ width: '100%' }}
                placeholder="Lọc theo chủ đề"
                onChange={handleTagChange}
                size="large"
                optionLabelProp="label"
              >
                {allTags.map(tag => (
                  <Option key={tag.value} value={tag.value} label={tag.label}>
                    <Space>
                      <Tag color={tag.color}>{tag.label}</Tag>
                    </Space>
                  </Option>
                ))}
              </Select>
            </Col>
            
            <Col xs={24} md={6}>
              <Select
                style={{ width: '100%' }}
                placeholder="Sắp xếp theo"
                onChange={handleSortChange}
                defaultValue="newest"
                size="large"
              >
                <Option value="newest">Mới nhất trước</Option>
                <Option value="oldest">Cũ nhất trước</Option>
              </Select>
            </Col>
          </Row>
          
          {selectedTags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              <Text strong className="mr-2">Chủ đề đã chọn:</Text>
              {selectedTags.map(tagValue => {
                const tag = allTags.find(t => t.value === tagValue);
                return (
                  <Tag
                    key={tagValue}
                    color={tag?.color}
                    closable
                    onClose={() => setSelectedTags(selectedTags.filter(t => t !== tagValue))}
                  >
                    {tag?.label}
                  </Tag>
                );
              })}
              <Button 
                type="link" 
                onClick={() => setSelectedTags([])} 
                size="small"
              >
                Xóa tất cả
              </Button>
            </div>
          )}
        </div>
        
        {/* Results Count */}
        <div className="mb-6 flex justify-between items-center">
          <Text className="text-gray-600">
            Hiển thị {filteredPosts.length} bài viết
            {searchQuery && <span> với từ khóa "<strong>{searchQuery}</strong>"</span>}
          </Text>
        </div>
        
        {/* Blog Posts Grid - Thay đổi thành 4 cột */}
        {currentPosts.length > 0 ? (
          <Row gutter={[24, 24]}>
            {currentPosts.map(post => (
              <Col xs={24} sm={12} md={8} lg={6} key={post.id}>
                <Card
                  hoverable
                  cover={
                    <div className="h-40 overflow-hidden">
                      <img
                        alt={post.title}
                        src={post.image}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                  }
                  className="h-full flex flex-col"
                  bodyStyle={{ padding: '16px', flex: '1 1 auto', display: 'flex', flexDirection: 'column' }}
                >
                  <div className="mb-2 flex flex-wrap gap-1">
                    {post.tags.map((tag, idx) => (
                      <Tag color={tag.color} key={idx} className="text-xs">{tag.label}</Tag>
                    ))}
                  </div>
                  
                  <Title level={5} className="mb-2 line-clamp-2 text-base">{post.title}</Title>
                  
                  <Paragraph className="text-gray-600 flex-grow mb-3 line-clamp-3 text-sm">
                    {post.excerpt}
                  </Paragraph>
                  
                  <div className="mt-auto">
                    <Divider className="my-2" />
                    
                    <div className="flex justify-between items-center">
                      <Space>
                        <Avatar src={post.author.avatar} size="small" />
                        <Text className="text-xs text-gray-600">{post.author.name}</Text>
                      </Space>
                      
                      <Button
                        type="link"
                        className="p-0 flex items-center text-blue-500 text-xs"
                        onClick={() => navigate(`/blog/${post.id}`)}
                      >
                        Đọc thêm <ArrowRightOutlined className="ml-1" />
                      </Button>
                    </div>
                    
                    <div className="flex justify-start items-center mt-2 text-xs text-gray-500">
                      <Space>
                        <CalendarOutlined />
                        <span>{post.date}</span>
                      </Space>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <Empty
            description={
              <span>Không tìm thấy bài viết phù hợp</span>
            }
            className="my-12"
          />
        )}
        
        {/* Pagination */}
        {filteredPosts.length > postsPerPage && (
          <div className="mt-12 flex justify-center">
            <Pagination
              current={currentPage}
              pageSize={postsPerPage}
              total={filteredPosts.length}
              onChange={handlePageChange}
              showSizeChanger={false}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;