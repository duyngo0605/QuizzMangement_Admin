import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, message } from 'antd';
import { EditOutlined, DeleteOutlined, UnorderedListOutlined, PlusOutlined } from '@ant-design/icons';
import { createTopic, updateTopic, deleteTopic } from './services/topicService';
import { sTopics, sLoading, fetchTopics } from './topicStore';
import Sidebar from '../../components/Sidebar';
import './topic.css';
import { useNavigate } from 'react-router-dom';
import Loading from '../../components/Loading/Loading';
import { useAuth } from '../../hooks/useAuth';

export default function Topic() {
  const { getRole } = useAuth();
  const role = getRole();
  const isAdmin = role === 'admin';

  const navigate = useNavigate();
  const Topics = sTopics.use();
  const loading = sLoading.use();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (Topics.length === 0) {
      fetchTopics();
    }
  }, []);

  const handleAdd = () => {
    setEditingId(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (Topic) => {
    setEditingId(Topic._id);
    form.setFieldsValue(Topic);
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    Modal.confirm({
        title: 'Xác nhận xóa',
        content: 'Bạn có chắc chắn muốn xóa Topic này không?',
        okText: 'Xóa',
        okType: 'danger',
        cancelText: 'Hủy',
        onOk: async () => {
            try {
                await deleteTopic(id);
                message.success('Xóa Topic thành công');
                fetchTopics();
            } catch (error) {
                message.error('Không thể xóa Topic');
            }
        },
    });
  };

  const handleViewItems = (Topic) => {
    navigate(`/topic/${Topic._id}`);
  };

  const handleSubmit = async (values) => {
    try {
      if (editingId) {
        await updateTopic(editingId, values);
        message.success('Cập nhật Topic thành công');
      } else {
        await createTopic(values);
        message.success('Thêm Topic thành công');
      }
      fetchTopics();
      setIsModalVisible(false);
    } catch (error) {
      message.error(`Không thể ${editingId ? 'cập nhật' : 'thêm'} Topic`);
    }
  };

  return (
    <div className="Topic-page">
      {loading ? <Loading/> : <></>}
      <Sidebar />
      <div className="content-wrapper">
        <div className="page-header">
          <h2>Quản lý Topic</h2>
          <div className="header-buttons">
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            Thêm Topic
          </Button>
          </div>
          
        </div>
        <div className="Topic-list">
          {Topics.map(Topic => (
            <div key={Topic._id} className="Topic-item">
              <div className="item-name">
                <h3>{Topic.name}</h3>
              </div>
              <div className="item-actions">
                <Button 
                  icon={<UnorderedListOutlined />} 
                  onClick={() => handleViewItems(Topic)}
                  title="Xem danh sách món"
                >
                  Chi tiết
                </Button>
                {isAdmin ? <>  <Button 
                  icon={<EditOutlined />} 
                  onClick={() => handleEdit(Topic)}
                  title="Sửa Topic"
                >
                  Sửa
                </Button>
                <Button 
                  icon={<DeleteOutlined />} 
                  danger
                  onClick={() => handleDelete(Topic._id)}
                  title="Xóa Topic"
                >
                  Xóa
                </Button></> : <></>}
              
              </div>
            </div>
          ))}
        </div>

        <Modal
          title={editingId ? "Cập nhật Topic" : "Thêm Topic mới"}
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
          >
            <Form.Item
              name="name"
              label="Tên Topic"
              rules={[{ required: true, message: 'Vui lòng nhập tên Topic' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item className="form-buttons">
              <Button onClick={() => setIsModalVisible(false)}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit">
                {editingId ? 'Cập nhật' : 'Thêm mới'}
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
} 