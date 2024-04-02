import { useEffect, useRef, useState } from 'react';
import { Button, Form, Input, InputNumber } from 'antd';
import { KeyOutlined, IdcardOutlined } from '@ant-design/icons';
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
    
    const reset = async (values) => {

        try {
            const response = await recoveryAccount({ cedula: values.cedula, codigorecuperacion: values.recoverykey });

            if (response.status === 200) {
                // Redirect to another window or perform other actions
                localStorage.setItem('cedula', values.cedula)
                navigation('/reiniciar-clave'); // Example: Redirect to a success page
            } else {
                // Handle other status codes if needed
                console.log('Unexpected status code:', response.status);
            }
        } catch {
        }

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
                        <p>Para reiniciar su contraseña primero ingrese su número de identificación y la clave de recuperación que recibió en su correo al momento de registrarse en al plataforma.</p>
                    </div>
                    <Form
                        className="login-form"
                        initialValues={{ remember: false }}
                        form={form}
                        name="account-recovery"
                        onFinish={reset}
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
                            <InputNumber prefix={<IdcardOutlined/>} placeholder='Ingrese el número de cédula sin puntos'/>
                        </Form.Item>

                        <Form.Item
                            name="recoverykey"
                            rules={[
                                {
                                    required: true,
                                    type: "string",
                                },
                                {
                                    min: 20,
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
                </div>
            </div>
        </div>
    );
}

export default AccountRecovery;