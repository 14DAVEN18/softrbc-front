// React imports
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";

// External components / libraries
import { Button, Form, Input } from 'antd';
import { LockOutlined } from '@ant-design/icons';

// Self created components
import { resetPassword } from "../../../services/recoveryService";
import FeedbackMessage from './feedback-message/feedback-message';

const initialResetForm = {
    password: ''
}

const PasswordReset = () => {   

    //const navigate = useNavigate();
  
    const ref = useRef(null);
    const [height, setHeight] = useState(0);
    const [width, setWidth] = useState(0);

    const [form] = Form.useForm();
    const [clientReady, setClientReady] = useState(false);

    const [, forceUpdate] = useState({});
    const navigation = useNavigate();
    const [message, setMessage] = useState({
        visible: false,
        type: '',
        text: ''
    })

    useEffect(() => {
        setClientReady(true);
        setHeight(ref.current.offsetHeight);
        setWidth(ref.current.offsetWidth);
    }, [])

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


    // To disable submit button at the beginning.
    useEffect(() => {
        forceUpdate({});
    }, []);

    const [ passwordForm, setPasswordForm] = useState(initialResetForm);

    const { password } = passwordForm;

    const onInputChange = ({ target }) => {
        const { name, value } = target;
        setPasswordForm({
            ...passwordForm,
            [ name ]: value,
        })
    }
    
    const validate = async (values) => {
        
        try {
            const response = await resetPassword({cedula: localStorage.getItem('cedula'), password: values.password})
            
            if(response.status === 200) {
                showMessage(
                    'success',
                    `Su contraseña se reinició exitosamente. En breve será redirigido a la página de inicio.`
                )
                setTimeout(() => {
                    navigation('/inicio-empleados');
                }, 5000)
            }
        } catch (error) {
            showMessage(
                'error',
                `Ocurrió un error al reiniciar su contraseña. ${error.message}`
            )
        }

        setPasswordForm(initialResetForm)
    };

    return (
        <div id="login" className="page" ref={ref}>
            <FeedbackMessage visible={message?.visible} type={message?.type} text={message?.text} onClose={() => hideMessage()}>
            </FeedbackMessage>
            <div className='bottom'>
                <div className='frame'>
                    <h1>Reinicio de contraseña</h1>
                    <div className='instructions'>
                        <p>Introduzca la nueva contraseña para su cuenta.</p>
                    </div>
                    <Form
                        className="login-form"
                        initialValues={{ remember: false }}
                        form={form}
                        name="account-recovery"
                        onFinish={validate}
                    >
                        <Form.Item
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    type: "string",
                                }, {
                                    message: 'La contraseña debe tener al menos 8 caracteres',
                                    min: 8
                                }, {
                                    max: 15,
                                    message: "La contraseña no puede tener más de 15 caracteres"
                                }, {
                                    pattern: "^(?=.*[a-z]).+$",
                                    message: "La contraseña debe contener al menos una letra minúscula (a - z)"
                                }, {
                                    pattern: "^(?=.*[A-Z]).+$",
                                    message: "La contraseña debe contener al menos una letra mayúscula (A - Z)"
                                }, {
                                    pattern: "^(?=.*[0-9]).+$",
                                    message: "La contraseña debe contener por lo menos 1 número"
                                }, {
                                    pattern: "^(?=.*[*+!.]).+$",
                                    message: "La contraseña solo puede tener al menos uno de los siguientes caracteres: * + ! ó ."
                                }
                            ]}
                        >
                            <Input.Password prefix={<LockOutlined/>} placeholder='Contraseña' onChange={onInputChange} value={password}/>
                        </Form.Item>

                        <Form.Item
                            name="confirm"
                            dependencies={['password']}
                            hasFeedback
                            rules={[
                            {
                                required: true,
                                message: 'Por favor confirme su contraseña!',
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('La contraseña ingresada no coincide!'));
                                },
                            }),
                            ]}
                        >
                            <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} placeholder='Confirmar contraseña'/>
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
                                    REINICIAR CONTRASEÑA
                                </Button>
                            }}
                        </Form.Item>
                    </Form>

                    <Link to="/inicio-empleados">Reiniciar contraseña</Link>
                    <Link to="/inicio-empleados">Inicio de sesión</Link>
                    <Link to="/optometra/agenda">Entrar optometra</Link>
                </div>
            </div>
        </div>
    );
}

export default PasswordReset;