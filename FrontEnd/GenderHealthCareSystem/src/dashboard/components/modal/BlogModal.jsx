import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  Form, 
  Input, 
  Button, 
  Select, 
  Upload, 
  message, 
  Spin,
  Space
} from 'antd';
import { 
  UploadOutlined, 
  PlusOutlined,
  EyeOutlined,
  DeleteOutlined
} from '@ant-design/icons';

const { Option } = Select;
const { TextArea } = Input;

/**
 * Modal đa năng cho việc thêm mới và chỉnh sửa blog
 * @param {boolean} visible - Trạng thái hiển thị của modal
 * @param {function} onCancel - Hàm gọi khi đóng modal
 * @param {function} onSuccess - Hàm gọi khi thành công (thêm hoặc cập nhật)
 * @param {object} blog - Thông tin blog cần chỉnh sửa (null nếu thêm mới)
 */
const BlogModal = ({ visible, onCancel, onSuccess, blog = null }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [uploadLoading, setUploadLoading] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  
  // Xác định mode của modal (new hoặc edit)
  const isEditMode = !!blog;

  // Danh sách tags mẫu
  const tagOptions = [
    { value: 'sức khỏe', label: 'Sức Khỏe' },
    { value: 'giới tính', label: 'Giới Tính' },
    { value: 'tư vấn', label: 'Tư Vấn' },
    { value: 'STIs', label: 'STIs' },
    { value: 'kinh nguyệt', label: 'Kinh Nguyệt' },
  ];

  // Reset form và thiết lập dữ liệu khi modal mở
  useEffect(() => {
    if (visible) {
      if (isEditMode && blog) {
        // Chế độ chỉnh sửa: Điền dữ liệu vào form
        form.setFieldsValue({
          title: blog.title,
          content: blog.content,
          tags: Array.isArray(blog.tags) ? blog.tags : []
        });
        setImageUrl(blog.thumbnailUrl || '');
      } else {
        // Chế độ thêm mới: Reset form
        form.resetFields();
        setImageUrl('');
      }
    }
  }, [visible, blog, form, isEditMode]);

  // Hàm upload ảnh thumbnail
  const handleUpload = async (options) => {
    const { file, onSuccess, onError } = options;

    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('Bạn chỉ có thể tải lên file hình ảnh!');
      onError('Not an image file');
      return;
    }

    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Hình ảnh phải nhỏ hơn 2MB!');
      onError('File too large');
      return;
    }

    try {
      setUploadLoading(true);
      
      // Mock upload thành công - thay thế bằng logic API thực tế
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setTimeout(() => {
          setImageUrl(reader.result);
          setUploadLoading(false);
          onSuccess('ok');
          message.success('Tải ảnh thành công!');
        }, 500);
      };

    } catch (error) {
      setUploadLoading(false);
      message.error('Tải ảnh thất bại.');
      onError('Upload failed');
    }
  };

  // Preview hình ảnh
  const handlePreview = () => {
    setPreviewImage(imageUrl);
    setPreviewVisible(true);
  };

  // Xử lý submit form
  const handleSubmit = async (values) => {
    try {
      setLoading(true);

      if (!values.content || !values.content.trim()) {
        message.error('Vui lòng nhập nội dung bài viết!');
        setLoading(false);
        return;
      }

      if (!imageUrl) {
        message.error('Vui lòng tải lên ảnh thumbnail!');
        setLoading(false);
        return;
      }

      // Chuẩn bị dữ liệu blog
      const blogData = {
        title: values.title,
        content: values.content,
        thumbnailUrl: imageUrl, 
        tags: Array.isArray(values.tags) ? values.tags : values.tags.split(', '),
      };

      // Nếu là edit mode, thêm ID và cập nhật thời gian
      if (isEditMode) {
        blogData.id = blog.id;
        blogData.updatedAt = new Date().toISOString();
        
        // API Call cho cập nhật - thay thế bằng API thực tế
        // await axios.put(`/api/blogs/${blog.id}`, blogData);
      } else {
        // Thêm các trường cần thiết cho bài viết mới
        blogData.publishedAt = new Date().toISOString();
        blogData.status = 'published';
        blogData.views = 0;
        
        // API Call cho tạo mới - thay thế bằng API thực tế
        // const response = await axios.post('/api/blogs', blogData);
        // blogData.id = response.data.id;
      }

      // Mock API call
      setTimeout(() => {
        if (!isEditMode) {
          // Giả lập ID cho bài viết mới
          blogData.id = Date.now();
        }
        
        message.success(
          isEditMode
            ? 'Cập nhật bài viết thành công!'
            : 'Thêm bài viết mới thành công!'
        );
        
        setLoading(false);
        onSuccess(blogData);
      }, 500);

    } catch (error) {
      console.error('Error saving blog:', error);
      message.error(
        isEditMode
          ? 'Cập nhật bài viết thất bại! Vui lòng thử lại.'
          : 'Thêm bài viết thất bại! Vui lòng thử lại.'
      );
      setLoading(false);
    }
  };

  // Các components upload
  const uploadButton = (
    <div>
      {uploadLoading ? <Spin /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Tải ảnh lên</div>
    </div>
  );

  return (
    <>
      <Modal
        title={isEditMode ? "Chỉnh sửa bài viết" : "Đăng bài viết mới"}
        open={visible}
        onCancel={onCancel}
        width={700}
        footer={null}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="title"
            label="Tiêu đề"
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
          >
            <Input placeholder="Nhập tiêu đề bài viết" maxLength={100} />
          </Form.Item>

          <Form.Item
            name="tags"
            label="Tags"
            rules={[{ required: true, message: 'Vui lòng chọn ít nhất 1 tag!' }]}
          >
            <Select
              mode="multiple"
              placeholder="Chọn tags cho bài viết"
              style={{ width: '100%' }}
              options={tagOptions}
            />
          </Form.Item>

          <Form.Item
            label="Ảnh thumbnail"
            required
            tooltip="Ảnh hiển thị ở trang danh sách (kích thước khuyến nghị: 1200x800px)"
          >
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div>
                <Upload
                  name="thumbnail"
                  listType="picture-card"
                  showUploadList={false}
                  customRequest={handleUpload}
                  className="blog-thumbnail-uploader"
                >
                  {imageUrl ? (
                    <img 
                      src={imageUrl} 
                      alt="thumbnail" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : uploadButton}
                </Upload>
              </div>
              
              {imageUrl && (
                <div className="flex flex-col sm:flex-row gap-2 justify-start mt-2">
                  <Button 
                    icon={<EyeOutlined />} 
                    onClick={handlePreview}
                  >
                    Xem trước
                  </Button>
                  <Button 
                    type="default" 
                    danger 
                    icon={<DeleteOutlined />}
                    onClick={() => setImageUrl('')}
                  >
                    Xóa ảnh
                  </Button>
                </div>
              )}
            </div>
          </Form.Item>

          <Form.Item
            name="content"
            label="Nội dung"
            rules={[{ required: true, message: 'Vui lòng nhập nội dung bài viết!' }]}
          >
            <TextArea
              placeholder="Nhập nội dung bài viết tại đây..."
              autoSize={{ minRows: 10, maxRows: 20 }}
              showCount
              maxLength={10000}
              className="resize-none"
            />
          </Form.Item>

          <Form.Item className="flex justify-end mt-8 pt-4 border-t">
            <Button onClick={onCancel} style={{ marginRight: 8 }}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              {isEditMode ? 'Cập nhật' : 'Đăng bài'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        open={previewVisible}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
      >
        <img alt="Preview" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </>
  );
};

export default BlogModal;