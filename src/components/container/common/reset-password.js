import { useEffect, useRef, useState } from 'react';
import { Button, Form, Input } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { resetPassword } from "../../../services/recoveryService";

import { Link, useNavigate } from "react-router-dom";

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
    const [message, setMessage] = useState("");
    const [match, setMatch] = useState(2)

    useEffect(() => {
        setClientReady(true);
        setHeight(ref.current.offsetHeight);
        setWidth(ref.current.offsetWidth);
    }, [])


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
            const response = await resetPassword({correo: localStorage.getItem('correo'), password: values.password})
            
            if(response.status === 200) {
                navigation('/inicio-empleados'); // Example: Redirect to a success page
            } else {
                console.log('Unexpected status code:', response.status);
            }
        } catch {

        }

        setPasswordForm(initialResetForm)
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