import { useEffect, useRef, useState } from 'react';
import { Button, Form, Input, InputNumber, Modal, Select, Space, Table } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, LockOutlined, IdcardOutlined } from '@ant-design/icons';

import axios from "axios";
import { CREATE_USER } from '../../../../constants/constants';
import { Link, useNavigate } from "react-router-dom";

import './optometrist-management.css';

import { data } from './data';

export default function OptometristManagement() {

    const ref = useRef(null);
    const [height, setHeight] = useState(0);
    const [width, setWidth] = useState(0);

    const navigation = useNavigate();

    useEffect(() => {
        setHeight(ref.current.offsetHeight);
        setWidth(ref.current.offsetWidth);
    }, [])

    const search = (values) => {
        console.log('Received values from form: ', values);
    };

    /*
            START of const for handling Disable Modal
                                                    */
    const [isDisableModalOpen, setIsDisableModalOpen] = useState(false);
    const [selectedOptometrist, setSelectedOptometrist] = useState(null);
    const [loading, setLoading] = useState(false);


    const showDisableModal = (optometrist) => {
        setSelectedOptometrist(optometrist)
        setIsDisableModalOpen(true);
    };  
    
    const handleDisableOk = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setIsDisableModalOpen(false);
        }, 2000);
    };
    
    const handleDisableCancel = () => {
        setIsDisableModalOpen(false);
    };
    /*
            END of const for handling Disable Modal
                                                    */

    /*
            START of const for handling Creation Modal
                                                            */
    const [isCreationModalOpen, setIsCreationModalOpen] = useState(false);

    const showCreationModal = () => {
        form.resetFields();
        setIsCreationModalOpen(true);
    }
    
    const handleCreateOptometrist = (values) => {
        console.log("El boton de crear optometra: ", values);

        /*try {
             const response = await axios.post (
                CREATE_USER,
                {
                    nombre: values.nombre,
                    apellido: values.apellido,
                    direccion: values.direccion,
                    correo: values.correo,
                    telefono: values.telefono,
                    password: values.password,
                    cedula: values.cedula
                },
                {
                    headers: 
                    {
                        'Content-Type': 'application/json',
                        
                    },
                    withCredentials: true,
                }).then(response => {
                    console.log(response.data);

                }).catch(error => {
                    console.error("Error en la solicitud:", error);
                    // Manejar el error aquí
                })
                .finally(() => {
                    setLoading(false);
                    setIsCreationModalOpen(false);
                });

              
        } catch (error) {
            console.log(error);
        }*/
    
        setLoading(true);
        setTimeout(() => {
          setLoading(false);
          setIsCreationModalOpen(false);
        }, 2000);
      };
    
    const handleCreationOk = () => {
    // Trigger form submission when the modal button is clicked
    form
        .validateFields()
        .then((values) => {
            handleCreateOptometrist(values);
        })
        .catch((errorInfo) => {
        console.log("Validation failed:", errorInfo);
        });
    };
    
    const handleCreationCancel = () => {
        setIsCreationModalOpen(false);
    };
    /*
            END of const for handling Creation Modal
                                                    */


    /*
            START of Moddify logic
                                        */
    const handleModificar = (optometrist) => {
        
        // Set the form fields with the data of the selected optometrist
        form.setFieldsValue(optometrist);
    
        // Open the modal
        setIsCreationModalOpen(true);
    };

    /*
            END of Modify logic
                                        */

    /*
                START of form controls
                                                */
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
    
    const [form] = Form.useForm();

    const onFinish = (values) => {
        /*try {
            axios.post (
                CREATE_USER,
                {
                    values
                },
                {
                    headers: 
                    {
                        'Content-Type': 'application/json',
                        withCredentials: true,
                        key: 1,
                        email: values.email,
                        username: values.username,
                        password: values.password
                    }
                })
                .then(({data}) => 
                {
                    localStorage.setItem("message" , data.message)
                    if (data.created) {
                        navigation("/login");
                    } 
                })
                .catch(error => {
                    console.log(error);
                })
        } catch (error) {
            console.log(error);
        }*/
        console.log("El boton de crear optometra: ", JSON.stringify(values) )
    };
    /*
                End of form controls
                                                */

    const columns = [
        {
            title: 'Nombre',
            key: 'name',
            render: (_, record) => (
                record.name + " " + record.surname
            )
        },
        {
            title: 'Acciones',
            key: 'action',
            render: (_, record) => (
            <Space size="middle">
                <Button type="primary" onClick={ () => showDisableModal(record)} danger htmlType='submit'>
                    Inhabilitar
                </Button>
                <Button type="primary" onClick={ () => handleModificar(record)} htmlType='submti'>
                    Modificar
                </Button>
            </Space>
            ),
        },
    ];

    return (
        /* div optometrist-management contains the whole screen in which thd component is displayed */
        <div className="optometrist-management" ref={ref}>
            
            <div className='search-form'>
                <Form
                    name="search"
                    layout="inline"
                    onFinish={search}
                >
                    <Form.Item
                        name="search-input"
                        rules={[
                            {
                                required: true,
                                message: 'Ingrese un nombre!'
                            }]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Nombre de optometra" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType='submit'>
                            Buscar
                        </Button>
                    </Form.Item>
                </Form>
                
                <Modal title="Inhabilitar optometra" centered open={isDisableModalOpen} onCancel={handleDisableCancel} footer=
                    {[
                        <Button key="cancel" onClick={handleDisableCancel}>
                            Cancelar
                        </Button>,
                        <Button key="disable" type="primary" danger loading={loading} onClick={handleDisableOk}>
                            Inhabilitar
                        </Button>
                    ]}>
                    <p className='confirmation'>¿Está seguro que desea inhabilitar al optometra {selectedOptometrist ? selectedOptometrist.name : ''}</p>
                </Modal>
            </div>
            




            <div className='create'>
                <Button type="dashed" htmlType='submit' onClick={showCreationModal}>
                    Crear Optometra
                </Button>

                <Modal title="Crear optometra" centered open={isCreationModalOpen} onCancel={handleCreationCancel} width={'50%'} footer=
                    {[
                        <Button key="cancel" onClick={handleCreationCancel}>
                            Cancelar
                        </Button>,
                        
                        <Button key="disable" type="primary" loading={loading} onClick={handleCreationOk}>
                            Crear
                        </Button>
                    ]}>

                    <p className='confirmation'>Por favor llene los siguientes campos:</p>
                    <Form
                        className='creation-form'
                        initialValues={{ remember: false }}
                        form={form}
                        name="employee-creation"
                        onFinish={handleCreateOptometrist}
                        scrollToFirstError
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
                                message: 'Por favor ingrese los apellidos del optómetra!',
                            }]}
                        >
                            <Input prefix={<UserOutlined/>} placeholder='Apellidos'/>
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
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Por favor ingresa una contraseña para el optómetra!'
                                }
                            ]}
                        >
                            <Input.Password prefix={<LockOutlined/>} placeholder='Contraseña'/>
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

                    </Form>
                </Modal>
            </div>

            <div className='employee-table'>
                <Table columns={columns} dataSource={data} />
            </div>
        </div>
    );
}