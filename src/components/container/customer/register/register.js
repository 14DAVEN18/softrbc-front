import { Button, Checkbox, DatePicker, Form, Input, InputNumber, Select } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, LockOutlined, IdcardOutlined } from '@ant-design/icons';
import { format } from 'date-fns';

import { createPatient } from '../../../../services/patientService';

import { CREATE_USER } from '../../../../constants/constants';

import React, { useEffect , useRef, useState} from 'react';

import { Link, useNavigate } from "react-router-dom";

import './register.css';

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
        // Exclude the optional field from the completeness check
        const requiredValues = { ...allValues }
        delete requiredValues.nombreacompañante
        
        // Check if all required fields are filled
        const isComplete = Object.values(requiredValues).every(value => !!value);
        
        // Set the state based on the completeness of required fields
        setIsCreationFormComplete(isComplete);
        console.log("allValues: ", allValues);
    };

    const handleCreatePatient = async () => {
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
                ); // Call the create function from userService.js
                //console.log('Response:', response.data);
                setLoading(true);
                navigation('/cliente/preguntas')
                // Handle success if needed
            } catch (error) {
                console.error('Error en la solicitud:', error);
                // Handle error if needed
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
                        initialValues={{ remember: false }}
                        form={creationForm}
                        name="employee-creation"
                        onFinish={handleCreatePatient}
                        onValuesChange={onCreationValuesChange}
                    >
                            
                        <Form.Item
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
                            name="cedula"
                            rules={[
                                {
                                    type: 'number',
                                    message: 'El número ingresado no es válido!'
                                },
                                {
                                    required: true,
                                    message: 'Por favor ingrese el número de identificación del optómetra!'
                                }
                            ]}
                        >
                            <InputNumber prefix={<IdcardOutlined/>} placeholder='Ingrese el número de cédula sin puntos'/>
                        </Form.Item>
        

                        <Form.Item
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
                            name="nombreacompañante"
                        >
                            <Input prefix={<UserOutlined/>} placeholder='Nombre de acompañante'/>
                        </Form.Item>

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
                            <Input.Password prefix={<LockOutlined/>} placeholder='Contraseña'/>
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

                        <Form.Item
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

                        <Form.Item shouldUpdate>
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