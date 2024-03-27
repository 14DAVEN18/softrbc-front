import { useEffect, useRef, useState } from 'react';
import { Button, Form, Input, Space, Table, Tabs } from 'antd';
import { UserOutlined } from '@ant-design/icons';

import { useNavigate } from "react-router-dom";

import './optometrist-schedule.css';

import { appointments } from './appointmentData';

export default function OptometristSchedule() {

    const ref = useRef(null);
    const [height, setHeight] = useState(0);
    const [width, setWidth] = useState(0);

    const navigation = useNavigate();

    useEffect(() => {
        setHeight(ref.current.offsetHeight);
        setWidth(ref.current.offsetWidth);
    }, [])





    // TO FILTER NAMES IN THE TABLE ***********************************************************
    const [searchText, setSearchText] = useState('');
    const [filteredData, setFilteredData] = useState([]);

    useEffect(() => {
        setTimeout(() => {
            const filtered = appointments
            ? appointments.filter(appointment =>
                appointment.nombre.toLowerCase().includes(searchText.toLowerCase())
            ): [];
            setFilteredData(filtered);
        },500)
    }, [searchText, appointments])

    const search = (values) => {
        console.log('Received values from form: ', values);
    };




    // TO MAANGE PATIENT'S INFO
    const [patient, setPatient] = useState(null)


    const onFinish = (values) => {
        console.log("El boton de crear optometra: ", JSON.stringify(values) )
    };
    /*
                End of form controls
                                                */

    // TO DEFINE TABLES FOR COLUMNS
    const columns = [
        {
            title: 'Hora',
            key: 'time',
            render: (_, record) => (
                record.hora
            )
        },
        {
            title: 'Nombre del paciente',
            key: 'nombre',
            render: (_, record) => (
                record.nombre
            )
        },
        {
            title: 'Acciones',
            key: 'action',
            render: (_, record) => (
            <Space size="middle">
                <Button type="primary" onClick={() => setPatient(true)} htmlType='submit'>
                    Iniciar consulta
                </Button>
            </Space>
            ),
        },
    ];

    return (
        /* div optometrist-schedule contains the whole screen in which thd component is displayed */
        <div className="optometrist-schedule" ref={ref}>
            
            <div className='search-form'>
                <Form name="search" layout="inline" onFinish={search}>
                    <Form.Item name="search-input">
                        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Nombre del paciente" onChange={e => setSearchText(e.target.value)}/>
                    </Form.Item>
                </Form>
            </div>

            {!!patient &&
                <div className='patient-info'>
                    <div className='tab-header'>
                        <div></div>
                    </div>
                    <div className='tab-content'></div>
                </div>
            }
            {!patient &&
                <div className='appointment-table'>
                    <Table
                        columns={columns}
                        dataSource={
                            filteredData.map(appointment => ({
                                ...appointment,
                                key: appointment.id
                            }))} scroll={{y: 600}} pagination={false}/>
                </div>
            }
            
        </div>
    );
}