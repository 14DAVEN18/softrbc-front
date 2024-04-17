import { useEffect, useRef, useState } from 'react';
import { Button, Space, } from 'antd';
import { useNavigate } from "react-router-dom";

import { log } from './log';

import './changelog.css';


export default function Changelog() {

    const ref = useRef(null);
    const [height, setHeight] = useState(0);
    const [width, setWidth] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        setHeight(ref.current.offsetHeight);
        setWidth(ref.current.offsetWidth);
        if(!localStorage.getItem('token')) {
            navigate("/inicio-empleados")
        } else {
            console.log("log: ", log)
            console.log("informacion: ", JSON.parse(log[0].informacion))
        }
    }, [])

    const columns = [
        {
            dataIndex: 'fecha',
            title: 'Fecha',
            key: 'date'
        },
        {
            dataIndex: 'accion',
            title: 'Acción realizada',
            key: 'accion'
        },
        {
            title: 'Acciones',
            key: 'action',
            render: (record) => (
            <Space size="middle">
                <Button type="primary" onClick={() => console.log("ver: ", record.patients)} htmlType='submit'>
                    Ver detalle
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