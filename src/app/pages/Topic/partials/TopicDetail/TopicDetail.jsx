import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Spin, message } from 'antd';
import { Line } from '@ant-design/charts';
import { useParams } from 'react-router-dom';
import { getTopicStats, getTopic } from '../../services/topicService';
import './topicDetail.css';
import Sidebar from '../../../../components/Sidebar';

const TopicDetail = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [topic, setTopic] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [statsResponse, topicResponse] = await Promise.all([
                getTopicStats(id),
                getTopic(id)
            ]);
            setStats(statsResponse);
            setTopic(topicResponse);
        } catch (error) {
            console.error('Error fetching data:', error);
            message.error('Không thể lấy thông tin topic');
        } finally {
            setLoading(false);
        }
    };

    // Cấu hình cho biểu đồ theo tháng
    const monthlyConfig = {
        data: stats?.monthlyStats?.map(stat => ({
            date: `${stat._id.year}-${String(stat._id.month).padStart(2, '0')}`,
            value: stat.count,
            category: 'Số lượt làm'
        })) || [],
        xField: 'date',
        yField: 'value',
        seriesField: 'category',
        smooth: true,
        animation: {
            appear: {
                animation: 'path-in',
                duration: 1000,
            },
        },
    };

    if (loading) {
        return (
            <div className="loading-container">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="topic-detail-page">
            <Sidebar />
            <div className="content-wrapper">
                <div className="page-header">
                    <h2 className="page-title">Thống kê chi tiết Topic: {topic?.name}</h2>
                </div>
                
                {/* Thống kê tổng quan */}
                <Row gutter={[16, 16]} className="stats-overview">
                    <Col xs={24} sm={12} lg={8}>
                        <Card>
                            <Statistic
                                title="Tổng số Quiz"
                                value={stats?.totalQuizzes}
                                suffix="quiz"
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={8}>
                        <Card>
                            <Statistic
                                title="Tổng lượt làm"
                                value={stats?.totalAttempts}
                                suffix="lượt"
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={8}>
                        <Card>
                            <Statistic
                                title="Điểm trung bình"
                                value={stats?.averageScore?.toFixed(2)}
                                suffix="điểm"
                            />
                        </Card>
                    </Col>
                </Row>

                {/* Biểu đồ thống kê theo tháng */}
                <Card title="Thống kê lượt làm theo tháng" className="chart-card">
                    <Line {...monthlyConfig} />
                </Card>

                {/* Bảng thống kê chi tiết theo ngày */}
                <Card title="Thống kê chi tiết theo ngày" className="stats-table">
                    <div className="table-scroll">
                        <table>
                            <thead>
                                <tr>
                                    <th>Ngày</th>
                                    <th>Số lượt làm</th>
                                    <th>Điểm trung bình</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats?.dailyStats?.map((stat, index) => (
                                    <tr key={index}>
                                        <td>{`${stat._id.day}/${stat._id.month}/${stat._id.year}`}</td>
                                        <td>{stat.count}</td>
                                        <td>{stat.averageScore.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default TopicDetail; 