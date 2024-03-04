import { useEffect, useRef, useState } from 'react';
import { Button, Form, Input } from 'antd';
import { KeyOutlined, UserOutlined } from '@ant-design/icons';
import { recoveryAccount } from "../../../services/recoveryService";

import { Link, useNavigate } from "react-router-dom";

const initialRecoveryForm = {
    username: '',
    password: ''
}

const AccountRecovery = () => {   

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

    const [ recoveryForm, setRecoveryForm] = useState(initialRecoveryForm);

    const { username, recoverykey } = recoveryForm;

    const onInputChange = ({ target }) => {
        const { name, value } = target;
        setRecoveryForm({
            ...recoveryForm,
            [ name ]: value,
        })
    }
    
    const reset = (values) => {

        recoveryAccount({correo: values.username, recoverykey: values.recoverykey})

        setRecoveryForm(initialRecoveryForm)
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
                    <h1>Recuperación de cuenta</h1>
                    <div className='instructions'>
                        <p>Para reiniciar su contraseña primero ingrese su dirección de correo electrónico y la clave de recuperación que recibió en su correo al momento de registrarse en al plataforma.</p>
                    </div>
                    <Form
                        className="login-form"
                        initialValues={{ remember: false }}
                        form={form}
                        name="account-recovery"
                        onFinish={reset}
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
                            name="recoverykey"
                            rules={[
                                {
                                    required: true,
                                    type: "string",
                                },
                                {
                                    min: 15,
                                    message: "La clave de recuperación digitada no tiene la longitud mínima esperada de 20 caracteres"
                                }
                            ]}
                        >
                            <Input.Password prefix={<KeyOutlined className="site-form-item-icon" />} placeholder='Clave de recuperación' onChange={ onInputChange } value={recoverykey}/>
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
                                    VERIFICAR IDENTIDAD
                                </Button>
                            }}
                        </Form.Item>
                    </Form>

                    <Link to="/reiniciar-clave">Reiniciar contraseña</Link>
                    <Link to="/inicio-empleados">Inicio de sesión</Link>
                    <Link to="/optometra/agenda">Entrar optometra</Link>
                </div>
            </div>
        </div>
    );
}

export default AccountRecovery;