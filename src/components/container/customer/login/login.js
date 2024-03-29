import { useEffect, useRef, useContext, useState } from 'react';
import { Button, Form, Input } from 'antd';
import { LockOutlined ,UserOutlined } from '@ant-design/icons';
import { AuthContext } from "../../../../auth/context/AuthContext";

import { Link, useNavigate } from "react-router-dom";
import { click } from '@testing-library/user-event/dist/click';

const initialLoginForm = {
    username: '',
    password: ''
}

export default function Login({onLogin}) {

    

    //const navigate = useNavigate();
  
    const ref = useRef(null);
    const [height, setHeight] = useState(0);
    const [width, setWidth] = useState(0);

    const [form] = Form.useForm();
    const [clientReady, setClientReady] = useState(false);

    const [, forceUpdate] = useState({});
    const navigation = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');
    const [match, setMatch] = useState(2)
    const [loading, setLoading] = useState(false);

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
            await handlerLogin({ correo: values.username, password: values.password });
            onLogin();
        } catch (error) {
            console.error('Login error:', error);
            setErrorMessage(error.message);
        }
    };

    return (
        <div 
            id="login" 
            className="page" 
            ref={ref}
        >
            <div className='patient-login'>
                { errorMessage && (
                    <div className='error-message'>
                        <p>{errorMessage}</p>
                    </div>
                )}
                
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
                                    loading={loading}
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
                                ¿No tienes una cuenta? <Link to="/cliente/registro">Crea una aqui.</Link>
                            </p>
                        </Form.Item>
                    </Form>
            </div>
        </div>
    );
}