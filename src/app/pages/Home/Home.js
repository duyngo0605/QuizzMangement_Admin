import React, { useState, useEffect } from 'react';
import { Card, Button, InputNumber, message, Select, Row, Col, Tabs, Input, Modal } from 'antd';
import Sidebar from '../../components/Sidebar';
import './home.css';
import Loading from '../../components/Loading/Loading';
export default function Home() {
  return (
    <div className="home">
      <Sidebar/>
    </div>
  );
}
