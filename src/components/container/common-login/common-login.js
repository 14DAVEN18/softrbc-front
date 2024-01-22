import { useEffect, useRef, useState } from 'react';
import { Button, Form, Input } from 'antd';
import { LockOutlined ,UserOutlined } from '@ant-design/icons';
import axios from "axios";

import { LOGIN_USER, CREDENTIALS_SUCCESSFULLY_VALIDATED, USER_DOES_NOT_EXIST, INVALID_PASSWORD } from '../../../constants/constants';

import { Link, useNavigate } from "react-router-dom";

export default function EmployeeLogin() {

    

    //const navigate = useNavigate();
  
    const ref = useRef(null);
    const [height, setHeight] = useState(0);
    const [width, setWidth] = useState(0);

    const [form] = Form.useForm();
    const [, forceUpdate] = useState({});
    const navigation = useNavigate();
    const [message, setMessage] = useState("");
    const [match, setMatch] = useState(2)

    useEffect(() => {
        setHeight(ref.current.offsetHeight);
        setWidth(ref.current.offsetWidth);
        if(localStorage.getItem("user_id") !== null)
            navigation("/application")
    }, [])


    // To disable submit button at the beginning.
    useEffect(() => {
        forceUpdate({});
    }, []);
    
    const onFinish = async (values) => {
        localStorage.clear()
        try {
            axios.post (
                LOGIN_USER,
                {
                    values
                },
                {
                    headers: 
                    {
                        'Content-Type': 'application/json',
                        withCredentials: true,
                        username: values.username,
                        password: values.password
                    }
                })
                .then(({data}) => 
                {
                    if (data.isMatch === 2) {
                        localStorage.setItem("user_id", data.user_id);
                        localStorage.setItem("user_name" , data.user_username);
                        setMessage(CREDENTIALS_SUCCESSFULLY_VALIDATED)
                        navigation("/application/register-transaction");
                    } else if (data.isMatch === 1) {
                        setMatch(data.isMatch)
                        setMessage(INVALID_PASSWORD);
                    } else if (data.isMatch === 0) {
                        setMatch(data.isMatch)
                        setMessage(USER_DOES_NOT_EXIST);
                    }
                })
                .catch(error => {
                    console.log(error);
                })
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div 
            id="login" 
            className="page" 
            ref={ref}
        >
            <div className='top'>
                <img src={process.env.PUBLIC_URL + "/Expense-Tracker-Logo-192.png"} alt="Expense tracker logo"/>
            </div>

            <div className='bottom'>
                
                {   
                    match === 1 && 
                    (
                        <div className='error-message'  onClick={() => setMatch(true)}>
                            <p>{message}</p>
                        </div>
                    )
                }
                {   
                    match === 0 && 
                    (
                        <div className='error-message'  onClick={() => setMatch(true)}>
                            <p>{message}</p>
                        </div>
                    )
                }
                <div className='frame'>
                    <h1>Inciar sesión</h1>
                    <Form
                        className="login-form"
                        initialValues={{ remember: false }}
                        form={form}
                        name="normal_login"
                        onFinish={onFinish}
                    >
                        <Form.Item
                            name="username"
                            rules={[
                                {
                                    required: true,
                                    message: 'Por favor ingresa tu usuario!'
                                }]}
                        >
                            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Usuario" />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Por favor ingresa tu contraseña!'
                                }
                            ]}
                        >
                            <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} placeholder='Contraseña'/>
                        </Form.Item>
                        

                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                INICIAR SESIÓN
                            </Button>
                        </Form.Item>
                    </Form>

                    <Link to="/login">El login normal.</Link>
                    <Link to="/administrador/gestion-optometras">Entrar admin</Link>
                </div>
            </div>
        </div>
    );
}