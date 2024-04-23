// React imports
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";

// External components / libraries
import { Button, Form, Input, InputNumber } from 'antd';
import { KeyOutlined, IdcardOutlined } from '@ant-design/icons';

// Self created components
import FeedbackMessage from './feedback-message/feedback-message';

// Self created services
import { recoveryAccount } from "../../../services/recoveryService";

const initialRecoveryForm = {
    username: '',
    password: ''
}

const AccountRecovery = () => {   
  
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
                localStorage.setItem('cedula', values.cedula)
                showMessage(
                    'success',
                    `Su código de recuperación fue verificado exitosamente. En breve se le pedíra su nueva contraseña`
                )
                setTimeout(() => {
                    navigation('/reiniciar-clave');
                }, 5000)
                
            } 
        } catch (error) {
            showMessage(
                'error',
                `Ocurrió un error al verificar su código de recuperación. Verifique que el código sea correcto. ${error.message}`
            )
        }

        setRecoveryForm(initialRecoveryForm)
    };

    return (
        <div 
            id="login" 
            className="page" 
            ref={ref}
        >
            <FeedbackMessage visible={message?.visible} type={message?.type} text={message?.text} onClose={() => hideMessage()}>
            </FeedbackMessage>
            <div className='bottom'>
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
                            <InputNumber prefix={<IdcardOutlined/>} placeholder='Ingrese el número de identificación sin puntos' value={username}/>
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