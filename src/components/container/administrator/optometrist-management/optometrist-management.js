import { useEffect, useRef, useState } from 'react';
import { Button, Form, Input, InputNumber, Modal, Space, Table, Typography } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, IdcardOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";

import { createOptometrist, getOptometrists, updateOptometrist, updateOptometristStatus } from '../../../../services/optometristService';

import './optometrist-management.css';

export default function OptometristManagement() {

    // TO DEFINE THE SIZE OF THE COMPONENT ***********************************************************
    const ref = useRef(null);
    const [height, setHeight] = useState(0);
    const [width, setWidth] = useState(0);


    const [loading, setLoading] = useState(false);
    const navigation = useNavigate();

    useEffect(() => {
        setHeight(ref.current.offsetHeight);
        setWidth(ref.current.offsetWidth);
        fetchOptometrists();
    }, [])







    // TO FETCH OPTOMETRIST DATA WHEN COMPONENT IS LOADED FOR THE FIRST TIME ***********************************************************
    const [optometristsData, setOptometristsData] = useState(null);
    const fetchOptometrists = async () => {
        try {
            const response = await getOptometrists(); // Call the create function from admin Service.js
            setOptometristsData(response.data)
            //console.log('optometrists:', optometristsData);

        } catch (error) {
            console.error('Error en la solicitud:', error);
            
        } finally {
            setLoading(false);
            
        }
    }






    // TO FILTER NAMES IN THE TABLE ***********************************************************
    const [searchText, setSearchText] = useState('');
    const [filteredData, setFilteredData] = useState([]);

    useEffect(() => {
        const filtered = optometristsData?.filter(optometrist =>
            optometrist.nombre.toLowerCase().includes(searchText.toLowerCase()) ||
            optometrist.apellido.toLowerCase().includes(searchText.toLowerCase())
        );
        setFilteredData(filtered);
    }, [searchText, optometristsData])

    const search = (values) => {
        console.log('Received values from form: ', values);
    };







    // TO DEFINE FORM CONSTANTS ***********************************************************
    const [creationForm] = Form.useForm();
    const [updateForm] = Form.useForm();





    

    // TO HANDLE STATUS CHANGE CONFIRMATION MODAL ***********************************************************
    const [isStatusChangeConfirmationModalOpen, setIsStatusChangeConfirmationModalOpen] = useState(false);
    const [selectedOptometrist, setSelectedOptometrist] = useState(null);
    const [StatusChangeConfirmationModalAction, setStatusChangeConfirmationModalAction] = useState("");


    const showStatusChangeConfirmationModal = (optometrist, action) => {
        setSelectedOptometrist(optometrist)
        setIsStatusChangeConfirmationModalOpen(true);
        setStatusChangeConfirmationModalAction(action);
    };  
    
    const changeOptometristStatus = async () => {
        setLoading(true);
        try {
            const response = await updateOptometristStatus(selectedOptometrist.idusuario); // Call the create function from userService.js
            //console.log('Response:', response.data);
            // Handle success if needed
        } catch (error) {
            console.error('Error en la solicitud:', error);
            // Handle error if needed
        } finally {
            fetchOptometrists();
            setLoading(false);
            // Handle modal state changes here if needed
        }
        
        setTimeout(() => {
            setLoading(false);
            setIsStatusChangeConfirmationModalOpen(false);
            setStatusChangeConfirmationModalAction("");
        }, 2000);
    };
    
    const statusChangeConfirmationModalCancel = () => {
        setIsStatusChangeConfirmationModalOpen(false);
        setStatusChangeConfirmationModalAction("");
    };
    






    // START OF HANDLING CREATION MODAL ***********************************************************
    const [isCreationModalOpen, setIsCreationModalOpen] = useState(false);
    const [isCreationFormComplete, setIsCreationFormComplete] = useState(false);


    const onCreationValuesChange = (_, allValues) => {
        const isComplete = Object.values(allValues).every(value => !!value);
        setIsCreationFormComplete(isComplete);
    };
    
    const showCreationModal = (optometrist) => {
        setSelectedOptometrist(optometrist);
        setIsCreationModalOpen(true);
    }

    const handleCreateOptometrist = async () => {
        if (creationForm != null) {
            try {
                const values = await creationForm.validateFields();
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
                //console.log('Response:', response.data);
                setLoading(true);
                // Handle success if needed
            } catch (error) {
                console.error('Error en la solicitud:', error);
                // Handle error if needed
            } finally {
                fetchOptometrists();
                setLoading(true);
                setTimeout(() => {
                    setLoading(false);
                    setIsCreationModalOpen(false);
                    setIsCreationFormComplete(false);
                }, 2000);
            }
        }
    };
    
    const handleCreationModalCancel = () => {
        setIsCreationModalOpen(false);
    };
    


    
    

    // START OF HANDLING UPDATE MODAL ***********************************************************
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isUpdateFormComplete, setIsUpdateFormComplete] = useState(false);


    const onUpdateValuesChange = (_, allValues) => {
        const isComplete = Object.values(allValues).every(value => !!value);
        setIsUpdateFormComplete(isComplete);
    };
    
    const showUpdateModal = async (optometrist) => {
        setSelectedOptometrist(optometrist);
        updateForm.setFieldsValue(optometrist);
        setIsUpdateModalOpen(true);
        setIsUpdateFormComplete(false);
    }

    const handleUpdateOptometrist = async (values) => {
        if (updateForm != null) {
            try {
                const values = await updateForm.validateFields();
                const response = await updateOptometrist(
                    {
                        id: selectedOptometrist.id,
                        direccion: values.direccion,
                        correo: values.correo,
                        telefono: values.telefono,
                    }
    
                ); // Call the create function from userService.js
                console.log('Response:', response.data);
                setLoading(true);
                // Handle success if needed
            } catch (error) {
                console.error('Error en la solicitud:', error);
                // Handle error if needed
            } finally {
                fetchOptometrists();
                setLoading(true);
                setTimeout(() => {
                    setLoading(false);
                    setIsCreationModalOpen(false);
                    setIsUpdateFormComplete(false);
                }, 2000);
            }
        }
        setLoading(true)
        console.log("El boton de actualizar optometra: ", values);
    };
    
    const handleUpdateModalCancel = () => {
        setIsUpdateModalOpen(false);
        setIsUpdateFormComplete(false);
    };






    // TO DEFINE TABLES FOR COLUMNS
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
                {record.activo === false ? (
                    <Button type="primary" onClick={() => showStatusChangeConfirmationModal(record, "enable")} htmlType='submit'>
                        Habilitar
                    </Button>
                ) : (
                    <Button type="primary" onClick={() => showStatusChangeConfirmationModal(record, "disable")} danger htmlType='submit'>
                        Inhabilitar
                    </Button>
                )}
                <Button type="primary" onClick={ () => showUpdateModal(record)} htmlType='submit'>
                    Modificar
                </Button>
            </Space>
            ),
        },
    ];





    // HTML TEMPLATE
    return (
        /* div optometrist-management contains the whole screen in which thd component is displayed */
        <div className="optometrist-management" ref={ref}>
            
            <div className='search-form'>
                <Form name="search" layout="inline" onFinish={search}>
                    <Form.Item name="search-input">
                        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Nombre de optometra" onChange={e => setSearchText(e.target.value)}/>
                    </Form.Item>
                </Form>
                





                <Modal title={StatusChangeConfirmationModalAction === "enable" ? "Habilitar optometra" : "Inhabilitar optometra"} centered open={isStatusChangeConfirmationModalOpen} onCancel={statusChangeConfirmationModalCancel} footer=
                    {StatusChangeConfirmationModalAction === "enable" ? [
                        <Button key="cancel" onClick={statusChangeConfirmationModalCancel}>
                            Cancelar
                        </Button>,
                        <Button key="action" type="primary" loading={loading} onClick={changeOptometristStatus}>
                            Habilitar
                        </Button>
                    ] : [
                        <Button key="cancel" onClick={statusChangeConfirmationModalCancel}>
                            Cancelar
                        </Button>,
                        <Button key="action" type="primary" danger loading={loading} onClick={changeOptometristStatus}>
                            Inhabilitar
                        </Button>
                    ]}>
                    <p className='confirmation'>¿Está seguro que desea {StatusChangeConfirmationModalAction === "enable" ? "habilitar" : "inhabilitar"} al optómetra {selectedOptometrist ? selectedOptometrist.nombre + ' ' + selectedOptometrist.apellido : ''}?</p>
                </Modal>
            </div>
            




            <div className='modal'>
                <Button type="dashed" htmlType='submit' onClick={() => showCreationModal(null)}>
                    Crear Optometra
                </Button>
            </div>

            <Modal title="Crear optómetra" centered open={isCreationModalOpen} onCancel={handleCreationModalCancel} width={'50%'} footer=
                {<>
                    <Button key="cancel" onClick={handleCreationModalCancel}>
                        Cancelar
                    </Button>
                    <Button key="create" type="primary" loading={loading} onClick={handleCreateOptometrist} disabled={!isCreationFormComplete}>
                        Crear
                    </Button>
                </>}
            >

                <p className='confirmation'>Por favor llene los siguientes campos:</p>
                <Form
                    className='creation-form'
                    initialValues={{ remember: false }}
                    form={creationForm}
                    name="employee-creation"
                    onFinish={handleCreateOptometrist}
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





            <Modal title="Modificar optómetra" centered open={isUpdateModalOpen} onCancel={handleUpdateModalCancel} width={'50%'} footer=
                {<>
                    <Button key="cancel" onClick={handleUpdateModalCancel}>
                        Cancelar
                    </Button>
                    <Button key="update" type="primary" loading={loading} onClick={handleUpdateOptometrist} disabled={!isUpdateFormComplete}>
                        Actualizar
                    </Button>
                </>}
            >

                <p className='confirmation'>Por favor llene los siguientes campos:</p>
                <Form
                    className='creation-form'
                    initialValues={{ remember: false }}
                    form={updateForm}
                    name="employee-creation"
                    onFinish={handleUpdateOptometrist}
                    onValuesChange={onUpdateValuesChange}
                >
                    
                    <Typography>
                        <pre>{selectedOptometrist?.nombre}</pre>
                    </Typography>
                    
                    
                    <Typography>
                        <pre>{selectedOptometrist?.apellido}</pre>
                    </Typography>

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


                    <Typography>
                        <pre>{selectedOptometrist?.cedula}</pre>
                    </Typography>

                    

                    <Typography>
                        <pre>{selectedOptometrist?.tarjetaprofesional}</pre>
                    </Typography>

                </Form>
            </Modal>






            <div className='employee-table'>
                <Table columns={columns} dataSource={filteredData} scroll={{y: 600}} pagination={false}/>
            </div>
        </div>
    );
}