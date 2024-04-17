import { useEffect, useRef, useState } from 'react';
import { Button, Space, Table } from 'antd';

import { useNavigate } from "react-router-dom";

import './reports.css';

import { reports } from './data';

export default function Reports() {

    const ref = useRef(null);
    const [height, setHeight] = useState(0);
    const [width, setWidth] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        setHeight(ref.current.offsetHeight);
        setWidth(ref.current.offsetWidth);
        if(!localStorage.getItem('token')) {
            navigate("/inicio-empleados")
        }
    }, [navigate])

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
                <Table columns={columns} dataSource={reports} />
            </div>
        </div>
    )
}