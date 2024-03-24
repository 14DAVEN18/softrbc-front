import { useEffect, useRef, useState, useContext } from 'react';
import { Button, Form, Input } from 'antd';
import { LockOutlined ,UserOutlined } from '@ant-design/icons';
import { AuthContext } from "../../../auth/context/AuthContext";

import { Link } from "react-router-dom";

const initialLoginForm = {
    username: '',
    password: ''
}

const EmployeeLogin = () => {
  
    const ref = useRef(null);
    const [height, setHeight] = useState(0);
    const [width, setWidth] = useState(0);

    const [form] = Form.useForm();
    const [clientReady, setClientReady] = useState(false);

    const [, forceUpdate] = useState({});
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        setClientReady(true);
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
    
    const login = async (values) => {

        try {
            await handlerLogin({correo: values.username, password: values.password})
        } catch(error) {
            setErrorMessage(error.message); // Set the error message state
        }
            

        setLoginForm(initialLoginForm)
    };

    return (
        <div 
            id="login" 
            className="page" 
            ref={ref}
        >

            <div className='bottom'>
                
               
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
                                    message: 'La entrada no es un correo electónico válido.',
                                    type: "email"
                                }]}
                        >
                            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Correo electrónico" onChange={ onInputChange } value={username}/>
                        </Form.Item>

                        <Form.Item
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    type: "string",
                                }
                            ]}
                        >
                            <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} placeholder='Contraseña' onChange={ onInputChange } value={password}/>
                        </Form.Item>

                        <Form.Item shouldUpdate>
                            {() => {
                                return <Button
                                    type="primary"
                                    htmlType="submit"
                                    className="login-form-button"
                                    disabled={
                                        !clientReady ||
                                        !form.isFieldsTouched(true) ||
                                        !!form.getFieldsError().filter(({ errors }) => errors.length).length
                                    }
                                >
                                    INICIAR SESIÓN
                                </Button>
                            }}
                        </Form.Item>

                        <Form.Item>
                            <p>
                                <Link to="/recuperacion-de-cuenta">¿Olvidó su contraseña?</Link>
                            </p>
                        </Form.Item>
                    </Form>
                    {   
                        errorMessage && 
                        (
                            <div className='error-message'  onClick={() => setErrorMessage("")}>
                                <p>{errorMessage}</p>
                            </div>
                        )
                    }

                    <Link to="/administrador/gestion-optometras">Entrar admin</Link>
                    <Link to="/optometra/agenda">Entrar optometra</Link>
                </div>
            </div>
        </div>
    );
}

export default EmployeeLogin;