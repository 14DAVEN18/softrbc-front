import { useEffect, useRef, useState } from 'react';
import { Button, Form, Input, InputNumber, Modal, Space, Table } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, IdcardOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";

import { createOptometrist, getOptometrists } from '../../../../services/adminService';

import './optometrist-management.css';

export default function OptometristManagement() {

    const ref = useRef(null);
    const [height, setHeight] = useState(0);
    const [width, setWidth] = useState(0);

    const navigation = useNavigate();

    useEffect(() => {
        setHeight(ref.current.offsetHeight);
        setWidth(ref.current.offsetWidth);
        fetchOptometrists();
    }, [])


    const [optometristsData, setOptometristsData] = useState(null);
    const fetchOptometrists = async () => {
        try {
            const response = await getOptometrists(); // Call the create function from admin Service.js
            setOptometristsData(response.data)
            console.log('optometrists:', optometristsData);
            // Handle success if needed
        } catch (error) {
            console.error('Error en la solicitud:', error);
            // Handle error if needed
        } finally {
            setLoading(false);
            // Handle modal state changes here if needed
        }
    }
    const search = (values) => {
        console.log('Received values from form: ', values);
    };

    /*
            START of const for handling Action Modal
                                                    */
    const [isActionModalOpen, setIsActionModalOpen] = useState(false);
    const [selectedOptometrist, setSelectedOptometrist] = useState(null);
    const [loading, setLoading] = useState(false);
    const [modalAction, setModalAction] = useState(""); 


    const showActionModal = (optometrist, action) => {
        setSelectedOptometrist(optometrist)
        setIsActionModalOpen(true);
        setModalAction(action);
    };  
    
    const changeOptometristStatus = () => {
        if (modalAction === "enable") {
            // Handle logic to enable the optometrist
            console.log("Enable optometrist:", selectedOptometrist);
        } else if (modalAction === "disable") {
            // Handle logic to disable the optometrist
            console.log("Disable optometrist:", selectedOptometrist);
        }
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setIsActionModalOpen(false);
            setModalAction("");
        }, 2000);
    };
    
    const handleActionCancel = () => {
        setIsActionModalOpen(false);
        setModalAction("");
    };
    

    /*
            START of const for handling Creation Modal
                                                            */
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [formAction, setFormAction] = useState("");
    const [isFormComplete, setIsFormComplete] = useState(false);


    const onValuesChange = (_, allValues) => {
        const isComplete = Object.values(allValues).every(value => !!value);
        setIsFormComplete(isComplete);
    };
    
    const showFormModal = (optometrist, action) => {
        setFormAction(action);
        if (action === "create")
            form.resetFields();
        else
            form.setFieldsValue(optometrist);
        setIsFormModalOpen(true);
    }
    
    const handleCreateOptometrist = async (values) => {
        setLoading(true)
        console.log("El boton de crear optometra: ", values);
        
        try {
            const response = await createOptometrist(
                {
                    usuario: {
                        nombre: values.nombre,
                        apellido: values.apellido,
                        direccion: values.direccion,
                        correo: values.correo,
                        telefono: values.telefono,
                        cedula: values.cedula,
                    },
                    optometra: {
                        numeroTarjeta: values.numeroTarjeta
                    }
                }
            ); // Call the create function from userService.js
            console.log('Response:', response.data);
            // Handle success if needed
        } catch (error) {
            console.error('Error en la solicitud:', error);
            // Handle error if needed
        } finally {
            setLoading(false);
            // Handle modal state changes here if needed
        }

        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setIsFormModalOpen(false);
            setIsFormComplete(false);
        }, 2000);
    };
    
    const handleFormOk = () => {
        // Triggers form submission when the modal button is clicked
        if (form != null) {
            form
            .validateFields()
            .then((values) => {
                if(formAction === "create")
                    handleCreateOptometrist(values);
                else if(formAction === "update")
                    handleUpdateOptometrist(values);
            })
            .catch((errorInfo) => {
                console.log("Validation failed:", errorInfo);
            });
        }
    
    };
    
    const handleFormCancel = () => {
        setIsFormModalOpen(false);
    };
    /*
            END of const for handling Creation Modal
                                                    */


    /*
            START of Moddify logic
                                        */
    
    const handleUpdateOptometrist = (values) => {
        console.log("El boton de modificar optometra: ", values);

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
            setIsFormModalOpen(false);
            setIsFormComplete(false);
        }, 2000);
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
    const [clientReady, setClientReady] = useState(false); 

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
                record.nombre + " " + record.apellido
            )
        },
        {
            title: 'Acciones',
            key: 'action',
            render: (_, record) => (
            <Space size="middle">
                {record.activo === 0 ? (
                    <Button type="primary" onClick={() => showActionModal(record, "enable")} htmlType='submit'>
                        Habilitar
                    </Button>
                ) : (
                    <Button type="primary" onClick={() => showActionModal(record, "disable")} danger htmlType='submit'>
                        Inhabilitar
                    </Button>
                )}
                <Button type="primary" onClick={ () => showFormModal(record, "update")} htmlType='submit'>
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
                
                <Modal title={modalAction === "enable" ? "Habilitar optometra" : "Inhabilitar optometra"} centered open={isActionModalOpen} onCancel={handleFormCancel} footer=
                    {modalAction === "enable" ? [
                        <Button key="cancel" onClick={handleActionCancel}>
                            Cancelar
                        </Button>,
                        <Button key="action" type="primary" loading={loading} onClick={changeOptometristStatus}>
                            Habilitar
                        </Button>
                    ] : [
                        <Button key="cancel" onClick={handleActionCancel}>
                            Cancelar
                        </Button>,
                        <Button key="action" type="primary" danger loading={loading} onClick={changeOptometristStatus}>
                            Inhabilitar
                        </Button>
                    ]}>
                    <p className='confirmation'>¿Está seguro que desea {modalAction === "enable" ? "habilitar" : "inhabilitar"} al optómetra {selectedOptometrist ? selectedOptometrist.nombre + ' ' + selectedOptometrist.apellido : ''}?</p>
                </Modal>
            </div>
            




            <div className='create'>
                <Button type="dashed" htmlType='submit' onClick={() => showFormModal(null, "create")}>
                    Crear Optometra
                </Button>

                <Modal title={formAction === "create" ? "Crear optómetra" : "Modificar optómetra"} centered open={isFormModalOpen} onCancel={handleFormCancel} width={'50%'} footer=
                    {formAction === "create" ? [
                        <Button key="cancel" onClick={handleFormCancel}>
                            Cancelar
                        </Button>,
                        <Button key="create" type="primary" loading={loading} onClick={handleFormOk} disabled={!isFormComplete}>
                            Crear
                        </Button>
                    ] : [
                        <Button key="cancel" onClick={handleFormCancel}>
                            Cancelar
                        </Button>,
                        <Button key="update" type="primary" loading={loading} onClick={handleFormOk} disabled={!isFormComplete}>
                            Actualizar
                        </Button>
                    ]}>

                    <p className='confirmation'>Por favor llene los siguientes campos:</p>
                    <Form
                        className='creation-form'
                        initialValues={{ remember: false }}
                        form={form}
                        name="employee-creation"
                        onFinish={handleCreateOptometrist}
                        onValuesChange={onValuesChange}
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
                            name="numeroTarjeta"
                            rules={[
                            {
                                required: true,
                                message: 'Por favor ingrese el número de tarjeta profesional del optómetra!',
                            }]}
                        >
                            <Input prefix={<UserOutlined/>} placeholder='Número de tarjeta profesional'/>
                        </Form.Item>

                    </Form>
                </Modal>
            </div>

            <div className='employee-table'>
                <Table columns={columns} dataSource={optometristsData} />
            </div>
        </div>
    );
}