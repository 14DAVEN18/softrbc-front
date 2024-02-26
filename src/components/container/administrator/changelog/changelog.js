import { useEffect, useRef, useState } from 'react';
import { Button, Form, Input, InputNumber, Modal, Space, Table } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, LockOutlined, IdcardOutlined } from '@ant-design/icons';

import axios from "axios";
import { CREATE_USER } from '../../../../constants/constants';
import { Link, useNavigate } from "react-router-dom";

import './changelog.css';


export default function Changelog() {

    const ref = useRef(null);
    const [height, setHeight] = useState(0);
    const [width, setWidth] = useState(0);

    useEffect(() => {
        setHeight(ref.current.offsetHeight);
        setWidth(ref.current.offsetWidth);
    }, [])

    const columns = [
        {
            dataIndex: 'fecha',
            title: 'Fecha',
            key: 'date'
        },
        {
            title: 'Acciones',
            key: 'action',
            render: (record) => (
            <Space size="middle">
                <Button type="primary" onClick={() => console.log("ver: ", record.patients)} htmlType='submit'>
                    Ver
                </Button>
            </Space>
            ),
        },
    ];

    return (
        <div className='reports' ref={ref}>
            <h1>Citas canceladas</h1>
            <div className='report-table'>

            </div>
        </div>
    )
}