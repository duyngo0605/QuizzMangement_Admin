import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, Spin, message } from 'antd';
import { FileOutlined, QuestionCircleOutlined, TrophyOutlined } from '@ant-design/icons';
import { getRankingStats } from './services/rankingService';
import Sidebar from '../../components/Sidebar';
import './rankings.css';

const Rankings = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);

    useEffect(() => {
        fetchRankingStats();
    }, []);

    const fetchRankingStats = async () => {
        try {
            setLoading(true);
            const response = await getRankingStats();
            setStats(response);
        } catch (error) {
            console.error('Error fetching ranking stats:', error);
            message.error('Không thể lấy thông tin xếp hạng');
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            title: 'Tên chủ đề',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Số lượng Quiz',
            dataIndex: 'totalQuizzes',
            key: 'totalQuizzes',
            sorter: (a, b) => a.totalQuizzes - b.totalQuizzes,
        },
    ];

    if (loading) {
        return (
            <div className="loading-container">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="rankings-page">
            <Sidebar />
            <div className="content-wrapper">
                <h2 className="page-title">Bảng xếp hạng & Thống kê</h2>

                <Row gutter={[16, 16]} className="stats-overview">
                    <Col xs={24} md={12}>
                        <Card>
                            <Statistic
                                title="Tổng số Quiz"
                                value={stats?.totalQuizzes}
                                prefix={<FileOutlined />}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} md={12}>
                        <Card>
                            <Statistic
                                title="Tổng số Question"
                                value={stats?.totalQuestions}
                                prefix={<QuestionCircleOutlined />}
                            />
                        </Card>
                    </Col>
                </Row>

                <Card 
                    title={<><TrophyOutlined /> Top chủ đề hot nhất</>}
                    className="ranking-table"
                >
                    <Table 
                        columns={columns}
                        dataSource={stats?.hotTopics}
                        rowKey="_id"
                        pagination={false}
                    />
                </Card>
            </div>
        </div>
    );
};

export default Rankings; 