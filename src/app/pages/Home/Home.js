import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, Spin, message } from 'antd';
import { Line } from '@ant-design/charts';
import { UserOutlined, TrophyOutlined } from '@ant-design/icons';
import { getUserStats } from './services/homeService';
import Sidebar from '../../components/Sidebar';
import './home.css';

const Home = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);

    useEffect(() => {
        fetchHomeStats();
    }, []);

    const fetchHomeStats = async () => {
        try {
            setLoading(true);
            const response = await getUserStats();
            setStats(response);
        } catch (error) {
            console.error('Error fetching home stats:', error);
            message.error('Không thể lấy thông tin thống kê');
        } finally {
            setLoading(false);
        }
    };

    const userChartConfig = {
        data: stats?.dailyStats?.map(stat => ({
            date: `${stat._id.year}-${String(stat._id.month).padStart(2, '0')}-${String(stat._id.day).padStart(2, '0')}`,
            value: stat.count
        })) || [],
        xField: 'date',
        yField: 'value',
        smooth: true,
        title: 'Số lượng người dùng mới theo ngày',
    };

    if (loading) {
        return (
            <div className="loading-container">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="home">
            <Sidebar />
            <div className="content-wrapper">
                <h2 className="page-title">Thống kê tổng quan</h2>

                <Row gutter={[16, 16]} className="stats-overview">
                    <Col xs={24} md={8}>
                        <Card>
                            <Statistic
                                title="Tổng số người dùng"
                                value={stats?.totalUsers}
                                prefix={<UserOutlined />}
                            />
                        </Card>
                    </Col>
                </Row>

                <Card title="Biểu đồ người dùng mới" className="chart-card">
                    <Line {...userChartConfig} />
                </Card>

                <Row gutter={[16, 16]}>
                    <Col xs={24} md={8}>
                        <Card 
                            title={<><TrophyOutlined /> Top người tạo Quiz</>}
                            className="ranking-card"
                        >
                            <Table 
                                dataSource={stats?.topQuizCreators}
                                columns={[
                                    { title: 'Tên', dataIndex: 'username' },
                                    { title: 'Số Quiz', dataIndex: 'totalQuizzes' }
                                ]}
                                pagination={false}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} md={8}>
                        <Card 
                            title={<><TrophyOutlined /> Top người tạo Question</>}
                            className="ranking-card"
                        >
                            <Table 
                                dataSource={stats?.topQuestionCreators}
                                columns={[
                                    { title: 'Tên', dataIndex: 'username' },
                                    { title: 'Số Question', dataIndex: 'totalQuestions' }
                                ]}
                                pagination={false}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} md={8}>
                        <Card 
                            title={<><TrophyOutlined /> Top người dùng tích cực</>}
                            className="ranking-card"
                        >
                            <Table 
                                dataSource={stats?.topActiveUsers}
                                columns={[
                                    { title: 'Tên', dataIndex: 'username' },
                                    { title: 'Số lần làm quiz', dataIndex: 'totalAttempts' }
                                ]}
                                pagination={false}
                            />
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default Home;
