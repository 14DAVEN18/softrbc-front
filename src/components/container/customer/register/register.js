import { Button, Checkbox, DatePicker, Form, Input, InputNumber, Select } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, LockOutlined, IdcardOutlined } from '@ant-design/icons';

import { createPatient } from '../../../../services/patientService';

import React, { useEffect , useRef, useState} from 'react';

import { Link, useNavigate } from "react-router-dom";

import './register.css';

const layout = {
    labelCol: {
      span: 5,
    },
    wrapperCol: {
      span: 16,
    },
};

const selectGenderOptions = [{
    label: 'Masculino',
    value: 'masculino'
},{
    label: 'Femenino',
    value: 'femenino'
}];

export default function Register() {

    const ref = useRef(null);
    const [height, setHeight] = useState(0);
    const [width, setWidth] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');


    const [loading, setLoading] = useState(false);
    const navigation = useNavigate();

    useEffect(() => {
        setHeight(ref.current.offsetHeight);
        setWidth(ref.current.offsetWidth);
    }, [])

    const formItemLayout = {
    labelCol: {
        xs: { span: 500 },
        sm: { span: 0 },
    },
    wrapperCol: {
       span: 0
    },
    };
    const tailFormItemLayout = {
    wrapperCol: {
        span: 24
    },
    };

    




    // TO DEFINE FORM CONSTANTS ***********************************************************
    const [creationForm] = Form.useForm();






    // START OF HANDLING PATIENT CREATION
    const [isCreationFormComplete, setIsCreationFormComplete] = useState(false);
    
    const onCreationValuesChange = (_, allValues) => {
        const requiredValues = { ...allValues }
        delete requiredValues.nombreacompañante
        
        const isComplete = Object.values(requiredValues).every(value => !!value);
        
        setIsCreationFormComplete(isComplete);
        console.log("allValues: ", allValues);
    };

    const handleCreatePatient = async () => {
        setLoading(true);
        if (creationForm != null) {
            try {
                const values = await creationForm.validateFields();
                console.log("values: ", values)
                const response = await createPatient(
                    {
                        usuario: {
                            nombre: values.nombre,
                            apellido: values.apellido,
                            direccion: values.direccion,
                            correo: values.correo,
                            telefono: values.telefono,
                            password: values.password,
                            cedula: values.cedula
                        },
                        paciente: {
                            ocupacion: values.ocupacion,
                            fechanacimiento: values.fechanacimiento,
                            genero: values.genero,
                            nombreacompañante: values.nombreacompañante,
                            aceptarterminos: values.aceptarterminos
                        }
                    }
                );
                setSuccessMessage("Se ha registrado exitosamente. En breve será redirigido al inicio de sesión")
                setTimeout(() => {
                    navigation('/cliente/preguntas');
                }, 7000)
                
            } catch (error) {
                setErrorMessage(error)
                console.error('Error en la solicitud:', error);
            } finally {
                setLoading(true);
                setTimeout(() => {
                    setLoading(false);
                    setIsCreationFormComplete(false);
                }, 2000);
            }
        }
    };





    const openPDFInNewWindow = () => {
        window.open('/Tratamiento de Datos.pdf', '_blank');
    };





    return (
        <div 
            id="register" 
            className="page" 
            ref={ref}
        >
            <div className='patient-register-top'>
                <h1>Registro de paciente</h1>
            </div>
            <div className='patient-register-bottom'>
                <div className='patient-creation-form'>
                    <Form
                        {...layout}
                        initialValues={{ remember: false }}
                        form={creationForm}
                        name="employee-creation"
                        onFinish={handleCreatePatient}
                        onValuesChange={onCreationValuesChange}
                    >
                        <Form.Item
                            label='Nombres'
                            name="nombre"
                            rules={[
                            {
                                required: true,
                                message: 'Por favor ingrese el nombre del optómetra sin apellidos!',
                            }]}
                        >
                            <Input prefix={<UserOutlined/>} placeholder='Nombres'/>
                        </Form.Item>
                            
                            
                        <Form.Item
                            label='Apellidos'
                            name="apellido"
                            rules={[
                            {
                                required: true,
                                message: 'Por favor ingrese el apellido del optómetra sin nombres!',
                            }]}
                        >
                            <Input prefix={<UserOutlined/>} placeholder='Apellidos'/>
                        </Form.Item>

                        <Form.Item
                            label='Fecha de nacimiento'
                            name="fechanacimiento"
                            rules={[
                            {
                                required: true,
                                message: 'Por favor seleccione su fecha de nacimiento!'
                            }]}
                        >
                            <DatePicker size={'large'} ></DatePicker>
                        </Form.Item>

                        <Form.Item
                            label='Genero'
                            name="genero"
                            rules={[
                            {
                                required: true,
                                message: 'Por favor seleccione su sexo'
                            }
                            ]}
                        >
                            <Select size={'large'} defaultValue="Seleccione un sexo" options={selectGenderOptions} />
                        </Form.Item>

                        <Form.Item
                            label='Dirección'
                            name="direccion"
                            rules={[
                            {
                                required: true,
                                message: 'Por favor ingrese la dirección física del optómetra!',
                            }]}
                        >
                            <Input prefix={<UserOutlined/>} placeholder='Dirección'/>
                        </Form.Item>

                        <Form.Item
                            label='Correo electrónico'
                            name="correo"
                            rules={[
                            {
                                type: 'email',
                                message: 'El correo ingresado no es válido',
                            },
                            {
                                required: true,
                                message: 'Por favor ingrese el correo eléctronico del optómetra!',
                            },
                            ]}
                        >
                            <Input prefix={<MailOutlined/>} placeholder='Correo eléctronico'/>
                        </Form.Item>

                        <Form.Item
                            label='Teléfono'
                            name="telefono"
                            rules={[
                                {
                                    type: 'number',
                                    message: 'El número ingresado no es válido!'
                                },
                                {
                                    required: true,
                                    message: 'Por favor ingrese el número telefónico del optometra!'
                                }
                            ]}
                        >
                            <InputNumber prefix={<PhoneOutlined/>} placeholder='Número telefónico'/>
                        </Form.Item>


                        <Form.Item
                            label='Documento de identidad'
                            name="cedula"
                            rules={[
                                {
                                    type: 'number',
                                    message: 'El número ingresado no es válido!'
                                },
                                {
                                    required: true,
                                    message: 'Por favor ingrese el número documento de documento de identidad del paciente'
                                }
                            ]}
                        >
                            <InputNumber prefix={<IdcardOutlined/>} placeholder='Ingrese el número de document de identidad sin puntos'/>
                        </Form.Item>
        

                        <Form.Item
                            label='Ocupación'
                            name="ocupacion"
                            rules={[
                            {
                                required: true,
                                message: 'Por favor ingrese su ocupación!',
                            }]}
                        >
                            <Input prefix={<UserOutlined/>} placeholder='Ocupación'/>
                        </Form.Item>

                        <Form.Item
                            label='Nombre del acompañante'
                            name="nombreacompañante"
                        >
                            <Input prefix={<UserOutlined/>} placeholder='Nombre de acompañante'/>
                        </Form.Item>

                        <Form.Item
                            label='Contraseña'
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    type: "string",
                                    message: 'Debe diginar una contraseña que cumpla con los requisitos'
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
                                    pattern: "^(?=.*[*!.]).+$",
                                    message: "La contraseña solo puede tener al menos uno de los siguientes caracteres: * ! ó ."
                                }
                            ]}
                        >
                            <Input.Password prefix={<LockOutlined/>} placeholder='Contraseña'/>
                        </Form.Item>

                        <Form.Item
                            label='Contraseña'
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

                        <Form.Item
                            wrapperCol={{ offset: 5, span: 16 }}    
                            name="aceptarterminos"
                            valuePropName='checked'
                            rules={[
                                {
                                    required: true,
                                    message: 'Por favor acepte los terminos y condiciones de tratamiento de datos para continuar.'
                                }
                            ]}
                        >
                            <Checkbox>Aceptar terminos y condiciones de tratamiento de datos. Si desea leer los términos y condiciones, haga clic <a onClick={openPDFInNewWindow} href="public/Tratamiento de Datos.pdf" target="_blank">aqui.</a></Checkbox>
                        </Form.Item>

                        <Form.Item 
                            shouldUpdate
                            wrapperCol={{ offset: 5, span: 16 }}    
                        >
                            <Button
                                type="primary"
                                htmlType="submit"
                                className="login-form-button"
                                disabled={!isCreationFormComplete}
                            >
                                CREAR CUENTA
                            </Button>
                        </Form.Item>

                    </Form>
                    { errorMessage && (
                        <div className='error-message'>
                            <p>{errorMessage}</p>
                        </div>
                    )}
                    { successMessage && (
                        <div className='success-message'>
                            <p>{successMessage}</p>
                        </div>
                    )}
                    <Form.Item>
                        <p>
                            ¿Ya tienes una cuenta? <Link to="/inicio-de-sesion">Inicia sesión</Link>
                        </p>
                    </Form.Item>
                </div>
            </div>
        </div>
    );
}


/*
<Form.Item
                            name="email"
                            rules={[
                            {
                                type: 'email',
                                message: 'El correo ingresado no es válido',
                            },
                            {
                                required: true,
                                message: 'Por favor ingrese su correo eléctronico',
                            },
                            ]}
                        >
                            <Input placeholder='Correo eléctronico'/>
                        </Form.Item>

                        <Form.Item
                            name="username"
                            tooltip="Ingresa cualquier nombre de usuario que desees"
                            rules={[
                                {
                                    required: true,
                                    message: 'El nombre de usuario debe tener entre 8 y 16 caracteres',
                                    whitespace: true,
                                    min: 8,
                                    max: 15
                                }
                            ]}
                        >
                            <Input placeholder='Nombre de usuario'/>
                        </Form.Item>

                        <Form.Item
                            name="password"
                            tooltip="Ingresa cualquier nombre de usuario que desees"
                            rules={[
                            {
                                required: true,
                                message: 'Por favor ingrese su contraseña',
                                min: 8,
                                max: 15
                            },
                            ]}
                            hasFeedback
                        >
                            <Input.Password placeholder='Contraseña'/>
                        </Form.Item>
*/