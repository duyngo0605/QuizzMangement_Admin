import React, { useState } from 'react';
import { Layout, Menu, Avatar, Typography, Space } from 'antd';
import { LogoutOutlined, UserOutlined, BookOutlined, PieChartOutlined } from '@ant-design/icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './sidebar.css';
import { getMenuItems } from '../../../settings/localVar';
import { jwtDecode } from 'jwt-decode';
import { TOKEN } from '../../../settings/localVar';
import { logoutService } from '../../pages/Login/services/loginService';

const { Sider } = Layout;
const { Text, Title } = Typography;

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem(TOKEN);
  const user = token ? jwtDecode(token) : null;
  const menuItems = user ? getMenuItems(user?.role) : null;

  const getAvatar = (role) => {
    return role === 'admin' 
      ? `${process.env.PUBLIC_URL}/adminAvatar.png`
      : `${process.env.PUBLIC_URL}/staffAvatar.png`;
  };

  const handleLogout = () => {
    logoutService(navigate);
  };

  if (!user) return null;

  // Hàm chuyển đổi tên icon thành component icon tương ứng
  const getIcon = (iconName) => {
    const iconMap = {
      'manage_accounts': <UserOutlined />,
      'topic': <BookOutlined />,
      'quiz': <PieChartOutlined/>
      // Thêm các icon khác tương ứng ở đây
    };
    return iconMap[iconName] || <UserOutlined />;
  };

  // Cập nhật hàm getAntdMenuItems
  const getAntdMenuItems = (items) => {
    return items.map(item => {
      if (item.subItems) {
        return {
          key: item.path || item.title,
          icon: getIcon(item.icon),
          label: item.title,
          children: item.subItems.map(subItem => ({
            key: subItem.path,
            label: <Link to={subItem.path}>{subItem.title}</Link>
          }))
        };
      }
      return {
        key: item.path,
        icon: getIcon(item.icon),
        label: <Link to={item.path}>{item.title}</Link>
      };
    });
  };

  return (
    <Sider 
      width={280} 
      style={{
        background: '#fff',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        paddingTop: 70
      }}
    >
      <div style={{ padding: '20px', borderBottom: '1px solid #f0f0f0' }}>
        <Space align="center">
          <Avatar
            size={50}
            src={getAvatar(user?.role)}
            style={{ marginRight: 8 }}
          />
          <div>
            <Title level={5} style={{ margin: 0 }}>{user?.username}</Title>
            <Text type="secondary">
              {user?.role === 'admin' ? 'Quản trị viên' : 'Nhân viên'}
            </Text>
          </div>
        </Space>
      </div>

      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        items={getAntdMenuItems(menuItems)}
        style={{ borderRight: 0 }}
      />

      <Menu
        mode="inline"
        selectable={false}
        style={{ 
          borderRight: 0,
          position: 'absolute',
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #f0f0f0'
        }}
        items={[
          {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: <Link to="/logout" onClick={handleLogout}>Đăng xuất</Link>
          }
        ]}
      />
    </Sider>
  );
}