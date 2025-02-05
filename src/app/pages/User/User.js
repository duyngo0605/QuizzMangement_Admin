import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, message, Tag, Space } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { getUser, createUser, updateUser, deleteUser } from './services/userService';
import Sidebar from '../../components/Sidebar';
import './user.css';
import Loading from '../../components/Loading/Loading';

const { Option } = Select;
const { Search } = Input;

const User = () => {
    const [users, setUsers] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [hasAdmin, setHasAdmin] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        // Lọc users khi searchText thay đổi
        const filtered = users.filter(user => 
            user.username.toLowerCase().includes(searchText.toLowerCase()) ||
            (user.email && user.email.toLowerCase().includes(searchText.toLowerCase()))
        );
        setFilteredUsers(filtered);
    }, [searchText, users]);

    const fetchUsers = async () => {
        try {
            const data = await getUser();
            setUsers(data);
            setHasAdmin(data.some(user => user.role === 'admin'));
        } catch (error) {
            message.error('Lấy danh sách tài khoản thất bại');
        }
    };

    const handleAdd = () => {
        setEditingId(null);
        form.resetFields();
        if (hasAdmin) {
            form.setFieldsValue({ role: 'customer' });
        }
        setIsModalVisible(true);
    };

    const handleEdit = (record) => {
        setEditingId(record._id);
        form.setFieldsValue({
            username: record.username,
            role: record.role,
            email: record.email,
            avatar: record.avatar
        });
        setIsModalVisible(true);
    };

    const handleDelete = async (id) => {
        const userToDelete = users.find(user => user._id === id);
        if (userToDelete.role === 'admin') {
            message.error('Không thể xóa tài khoản admin');
            return;
        }

        Modal.confirm({
            title: 'Xác nhận xóa',
            content: 'Bạn có chắc chắn muốn xóa tài khoản này không?',
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: async () => {
                try {
                    await deleteUser(id);
                    message.success('Xóa tài khoản thành công');
                    fetchUsers();
                } catch (error) {
                    message.error('Xóa tài khoản thất bại');
                }
            },
        });
    };

    const handleSubmit = async (values) => {
        // Kiểm tra username trùng
        const isUsernameTaken = users.some(user => 
            user.username === values.username && user._id !== editingId
        );
        
        if (isUsernameTaken) {
            message.error('Tên đăng nhập đã tồn tại');
            return;
        }

        // Kiểm tra admin
        if (!editingId && values.role === 'admin' && hasAdmin) {
            message.error('Chỉ được phép tồn tại một tài khoản admin');
            return;
        }

        setLoading(true);
        try {
            if (editingId) {
                await updateUser(editingId, values);
                message.success('Cập nhật tài khoản thành công');
            } else {
                await createUser(values);
                message.success('Thêm tài khoản thành công');
            }
            setIsModalVisible(false);
            fetchUsers();
        } catch (error) {
            message.error('Thao tác thất bại');
        } finally {
            setLoading(false);
        }
    };

    const handleSidebarCollapse = (collapsed) => {
        setSidebarCollapsed(collapsed);
    };

    const columns = [
        {
            title: 'Avatar',
            dataIndex: 'avatar',
            key: 'avatar',
            width: 80,
            render: (avatar) => (
                avatar ? <img src={avatar} alt="avatar" style={{ width: 40, height: 40, borderRadius: '50%' }} /> 
                : <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: '#f0f0f0' }} />
            )
        },
        {
            title: 'Tên đăng nhập',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Vai trò',
            dataIndex: 'role',
            key: 'role',
            render: (role) => (
                <Tag color={role === 'admin' ? 'red' : 'green'}>
                    {role === 'admin' ? 'Quản trị viên' : 'Khách hàng'}
                </Tag>
            ),
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (createdAt) => new Date(createdAt).toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            })
        },
        {
            title: 'Thao tác',
            key: 'action',
            width: 150,
            render: (_, record) => (
                <div className="table-actions">
                    <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                    />
                    {record.role !== 'admin' && (
                        <Button
                            type="text"
                            icon={<DeleteOutlined />}
                            danger
                            onClick={() => handleDelete(record._id)}
                        />
                    )}
                </div>
            ),
        },
    ];

    return (
        <div className={`user-page ${sidebarCollapsed ? 'collapsed' : ''}`}>
            {loading && <Loading />}
            <Sidebar onCollapse={handleSidebarCollapse} />
            <div className="content-wrapper">
                <div className="page-header">
                    <div className="header-left">
                        <h2>Quản lý người dùng</h2>   
                    </div>
                    <Space>
                        <Search
                            placeholder="Tìm kiếm theo tên đăng nhập hoặc email"
                            allowClear
                            enterButton={<SearchOutlined />}
                            style={{ width: 300 }}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={handleAdd}
                        >
                            Thêm người dùng
                        </Button>
                    </Space>
                </div>

                <Table
                    columns={columns}
                    dataSource={filteredUsers}
                    rowKey="_id"
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total) => `Tổng số ${total} người dùng`
                    }}
                />

                <Modal
                    title={editingId ? "Sửa người dùng" : "Thêm người dùng mới"}
                    open={isModalVisible}
                    onCancel={() => {
                        setIsModalVisible(false);
                        form.resetFields();
                    }}
                    footer={null}
                >
                    <Form
                        form={form}
                        onFinish={handleSubmit}
                        layout="vertical"
                    >
                        <Form.Item
                            name="username"
                            label="Tên đăng nhập"
                            rules={[
                                { required: true, message: 'Vui lòng nhập tên đăng nhập' },
                                { min: 3, message: 'Tên đăng nhập phải có ít nhất 3 ký tự' }
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        {!editingId && (
                            <Form.Item
                                name="password"
                                label="Mật khẩu"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập mật khẩu' },
                                ]}
                            >
                                <Input.Password />
                            </Form.Item>
                        )}

                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[
                                { type: 'email', message: 'Email không hợp lệ' }
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="avatar"
                            label="Avatar URL"
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="role"
                            label="Vai trò"
                            rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
                        >
                            <Select disabled={hasAdmin && (!editingId || (editingId && users.find(u => u._id === editingId)?.role !== 'admin'))}>
                                <Option value="customer">Khách hàng</Option>
                                <Option value="admin">Quản trị viên</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item className="form-buttons">
                            <Button onClick={() => {
                                setIsModalVisible(false);
                                form.resetFields();
                            }}>
                                Hủy
                            </Button>
                            <Button type="primary" htmlType="submit" loading={loading}>
                                {editingId ? 'Cập nhật' : 'Thêm mới'}
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </div>
    );
};

export default User;