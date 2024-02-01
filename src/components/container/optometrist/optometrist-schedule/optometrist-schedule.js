import { useEffect, useRef, useState } from 'react';
import { Button, Form, Input, InputNumber, Modal, Space, Table } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, LockOutlined, IdcardOutlined } from '@ant-design/icons';

import axios from "axios";
import { CREATE_USER } from '../../../../constants/constants';
import { Link, useNavigate } from "react-router-dom";

// import './optometrist-management.css';

// import { data } from './data';

export default function OptometristSchedule() {

    const ref = useRef(null);
    const [height, setHeight] = useState(0);
    const [width, setWidth] = useState(0);

    const navigation = useNavigate();

    useEffect(() => {
        setHeight(ref.current.offsetHeight);
        setWidth(ref.current.offsetWidth);
    }, [])

    const onFinish = (values) => {
        /*try {
            axios.post (
                CREATE_USER,
                {
                    values
                },
                {
                    headers: 
                    {
                        'Content-Type': 'application/json',
                        withCredentials: true,
                        key: 1,
                        email: values.email,
                        username: values.username,
                        password: values.password
                    }
                })
                .then(({data}) => 
                {
                    localStorage.setItem("message" , data.message)
                    if (data.created) {
                        navigation("/login");
                    } 
                })
                .catch(error => {
                    console.log(error);
                })
        } catch (error) {
            console.log(error);
        }*/
        console.log("El boton de crear optometra: ", JSON.stringify(values) )
    };
    /*
                End of form controls
                                                */

    const columns = [
        {
            title: 'Hora',
            key: 'time',
            index: 'hora'
        },
        {
            title: 'Nombre del paciente',
            key: 'action',
            index: 'nombre_paciente'
        },
    ];

    return (
        /* div optometrist-schedule contains the whole screen in which thd component is displayed */
        <div className="optometrist-container" ref={ref}>
            
            <div className=''>
                
            </div>

            <div className='create'>
                
            </div>

            <div className='employee-table'>
                
            </div>
        </div>
    );
}