// React imports
import { useEffect, useRef, useContext, useState } from 'react';
import { Link } from "react-router-dom";

// External components / libraries
import { Button, Form, Input, InputNumber } from 'antd';
import { IdcardOutlined, LockOutlined } from '@ant-design/icons';

// Self created components
import { AuthContext } from "../../../../auth/context/AuthContext";
import FeedbackMessage from '../../common/feedback-message/feedback-message';

const initialLoginForm = {
    username: '',
    password: ''
}

export default function Login({onLogin}) {

    const ref = useRef(null);
    const [height, setHeight] = useState(0);
    const [width, setWidth] = useState(0);

    const [form] = Form.useForm();
    const [clientReady, setClientReady] = useState(false);

    const [, forceUpdate] = useState({});
    const [message, setMessage] = useState({
        visible: false,
        type: '',
        text: ''
    });
    const [loading, setLoading] = useState(false);

    const showMessage = (type, text) => {
        setMessage({
          visible: true,
          type: type,
          text: text
        });
    };

    const hideMessage = () => {
        setMessage({
            visible: false,
            type: '',
            text: ''
        });
    };

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
            setLoading(true)
            const response = await handlerLogin({ cedula: values.cedula, password: values.password });
            if (response.status === 200) {
                showMessage(
                    'success',
                    `Ha iniciado sesión exitosamente. En breve podrá continuar con su interacción.`
                )
            }
            setTimeout(() => {                
                onLogin();
            }, 7000)
            
        } catch (error) {
            if(!error.hasOwnProperty('response')) {
                if(error.hasOwnProperty('message')) {
                    if(error.message.toLowerCase() === 'network error') {
                        showMessage(
                            'error',
                            `No se puedo conectar al servidor. Por favor intente más tarde.`
                        )
                    } else {
                        showMessage(
                            'error',
                            `Credeciales incorrectas.`
                        )
                    }
                }
            } else {
                showMessage(
                    'error',
                    `Error: ${error.message}`
                )
            }
        } finally {
            setLoading(false)
        }
    };

    return (
        <div id="login" className="page" ref={ref}>
            <FeedbackMessage visible={message?.visible} type={message?.type} text={message?.text} onClose={() => hideMessage()}>
            </FeedbackMessage>
            <div className='patient-login'>
                <h1>Inciar sesión</h1>
                    <Form
                        className="login-form"
                        initialValues={{ remember: false }}
                        form={form}
                        name="normal_login"
                        onFinish={login}
                    >
                        <Form.Item
                            name="cedula"
                            rules={[
                                {
                                    type: 'number',
                                    message: 'El número ingresado no es válido!'
                                },
                                {
                                    required: true,
                                    message: 'Por favor ingrese el número de identificación del paciente!'
                                }
                            ]}
                        >
                            <InputNumber prefix={<IdcardOutlined/>} placeholder='Ingrese el número de cédula sin puntos' value={username} autoComplete='off'/>
                        </Form.Item>

                        <Form.Item
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    type: "string",
                                    message: 'Por favor digite su contraseña.'
                                }
                            ]}
                        >
                            <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} placeholder='Contraseña' onChange={ onInputChange } value={password} autoComplete='off'/>
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

                        <Form.Item>
                            <p>
                                <Link to="/recuperacion-de-cuenta">¿Olvidó su contraseña?</Link>
                            </p>
                        </Form.Item>
                    </Form>
            </div>
        </div>
    );
}