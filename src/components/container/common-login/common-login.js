import { useEffect, useRef, useState, useContext } from 'react';
import { Button, Form, Input } from 'antd';
import { LockOutlined ,UserOutlined } from '@ant-design/icons';
import { AuthContext } from "../../../auth/context/AuthContext";

import { Link, useNavigate } from "react-router-dom";

const initialLoginForm = {
    username: '',
    password: ''
}

const EmployeeLogin = () => {

    

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
    }, [])


    // To disable submit button at the beginning.
    useEffect(() => {
        forceUpdate({});
    }, []);


    const { handlerLogin } = useContext(AuthContext);

    const [ loginForm, setLoginForm] = useState(initialLoginForm);
    const { username, password } = loginForm;

    const onInputChange = ({ target }) => {
        const { name, value } = target;
        setLoginForm({
            ...loginForm,
            [ name ]: value,
        })
    }
    
    const login = (values) => {
        console.log('values', values)
        if(!username || !password) {
            console.log("Error", "Correo y contraseña requeridos.")
        }

        handlerLogin({username: values.username, password: values.password})

        setLoginForm(initialLoginForm)
    };

    return (
        <div 
            id="login" 
            className="page" 
            ref={ref}
        >

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
                        onFinish={login}
                    >
                        <Form.Item
                            name="username"
                            rules={[
                                {
                                    required: true,
                                    message: 'Por favor ingresa tu usuario!'
                                }]}
                        >
                            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Usuario" onChange={ onInputChange } value={username}/>
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
                            <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} placeholder='Contraseña' onChange={ onInputChange } value={password}/>
                        </Form.Item>
                        

                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                INICIAR SESIÓN
                            </Button>
                        </Form.Item>
                    </Form>

                    <Link to="/inicio-de-sesion">El login normal.</Link>
                    <Link to="/administrador/gestion-optometras">Entrar admin</Link>
                    <Link to="/optometra/agenda">Entrar optometra</Link>
                </div>
            </div>
        </div>
    );
}

export default EmployeeLogin;