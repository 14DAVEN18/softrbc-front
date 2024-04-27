// React imports
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";

// External component / libraries
import { Button, Form, Input, InputNumber, Modal, Space, Table, Typography } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, IdcardOutlined } from '@ant-design/icons';

// Self created components
import FeedbackMessage from '../../common/feedback-message/feedback-message';

// Self created services
import { createOptometrist, getOptometrists, updateOptometrist, updateOptometristStatus } from '../../../../services/optometristService';

// Styles
import './optometrist-management.css';

const layout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 16,
    },
};

export default function OptometristManagement() {

    // TO DEFINE THE SIZE OF THE COMPONENT ***********************************************************
    const ref = useRef(null);
    const [height, setHeight] = useState(0);
    const [width, setWidth] = useState(0);
    const [message, setMessage] = useState({
        visible: false,
        type: '',
        text: ''
    })


    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

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







    // TO FETCH OPTOMETRIST DATA WHEN COMPONENT IS LOADED FOR THE FIRST TIME ***********************************************************
    const [optometristsData, setOptometristsData] = useState(null);
    const fetchOptometrists = useCallback(async () => {
        try {
            const response = await getOptometrists();
            setOptometristsData(response.data)
        } catch (error) {
            if (error.response.data.hasOwnProperty('error')) {
                if (error.response.data.error.toLowerCase().includes('expired')){
                    showMessage(
                        'error',
                        `Su sesión expiró. En breve será redirigido a la página de inicio de sesión.`
                    )
                    setTimeout(() => {
                        localStorage.clear()
                        navigate('/inicio-empleados')
                    }, 5000)
                } else if (error.response.data.error.toLowerCase().includes('does not match')) {
                    showMessage(
                        'error',
                        `Su sesión actual no es válida. Debe iniciar sesión de nuevo. En breve será redirigido a la página de inicio de sesión.`
                    )
                    setTimeout(() => {
                        localStorage.clear()
                        navigate('/inicio-empleados')
                    }, 5000)
                }
            } else {
                showMessage(
                    'error',
                    `Ocurrió un error al cargar los optometras. ${error.message}`
                )
            }
        } finally {
            setLoading(false);
        }
    }, [navigate])

    useEffect(() => {
        setHeight(ref.current.offsetHeight);
        setWidth(ref.current.offsetWidth);
        if(!localStorage.getItem('token')) {
            navigate("/inicio-empleados")
        } else {
            fetchOptometrists();
        }
    }, [navigate, fetchOptometrists])






    // TO FILTER NAMES IN THE TABLE ***********************************************************
    const [searchText, setSearchText] = useState('');
    const [filteredData, setFilteredData] = useState([]);

    useEffect(() => {
        setTimeout(() => {
            const filtered = optometristsData
            ? optometristsData.filter(optometrist =>
                optometrist.usuario.nombre.toLowerCase().includes(searchText.toLowerCase()) ||
                optometrist.usuario.apellido.toLowerCase().includes(searchText.toLowerCase())
            ): [];
            setFilteredData(filtered);
        },500)
    }, [searchText, optometristsData])






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
            const response = await updateOptometristStatus({
                idadmin: JSON.parse(localStorage.getItem('user')).idadmin,
                idusuario: selectedOptometrist.usuario.idusuario,
                idoptometra: selectedOptometrist.idoptometra
            });
            if (response.status === 200) {
                showMessage(
                    'success',
                    `El estado del optometra se actualizó correctamente.`
                )
            }
        } catch (error) {
            if (error.response.data.hasOwnProperty('error')) {
                if(error.response.data.error.toLowerCase().includes('expired')){
                    showMessage(
                        'error',
                        `Su sesión expiró. En breve será redirigido a la página de inicio de sesión.`
                    )
                    setTimeout(() => {
                        localStorage.clear()
                        navigate('/inicio-empleados')
                    }, 5000)
                } else if (error.response.data.error.toLowerCase().includes('does not match')) {
                    showMessage(
                        'error',
                        `Su sesión actual no es válida. Debe iniciar sesión de nuevo. En breve será redirigido a la página de inicio de sesión.`
                    )
                    setTimeout(() => {
                        localStorage.clear()
                        navigate('/inicio-empleados')
                    }, 7000)
                }
            } else {
                showMessage(
                    'error',
                    `Ocurrió un error actualizando el estado del optometra. ${error.message}`
                )
            }
        } finally {
            setTimeout(() => {
                fetchOptometrists();
                setLoading(false);
                setIsStatusChangeConfirmationModalOpen(false);
                setStatusChangeConfirmationModalAction("");
            }, 2000)
            
        }
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
                setLoading(true);
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
                        idadmin: JSON.parse(localStorage.getItem('user')).idadmin
                    }
                );
                
                if (response.status === 200) {
                    showMessage(
                        'success',
                        `Los datos del optometra se registraron exitosamente.`
                    )
                }
            } catch (error) {
                if (error.response.data.hasOwnProperty('error')) {
                    if(error.response.data.error.toLowerCase().includes('expired')){
                        showMessage(
                            'error',
                            `Su sesión expiró. En breve será redirigido a la página de inicio de sesión.`
                        )
                        setTimeout(() => {
                            localStorage.clear()
                            navigate('/inicio-empleados')
                        }, 5000)
                    } else if (error.response.data.error.toLowerCase().includes('does not match')) {
                        showMessage(
                            'error',
                            `Su sesión actual no es válida. Debe iniciar sesión de nuevo. En breve será redirigido a la página de inicio de sesión.`
                        )
                        setTimeout(() => {
                            localStorage.clear()
                            navigate('/inicio-empleados')
                        }, 7000)
                    }
                } else {
                    console.log(error)
                    showMessage(
                        'error',
                        `Ocurrió un error al registrar los datos del optometra. ${error.response.data}`
                    )
                }
                creationForm.resetFields()
            } finally {
                fetchOptometrists();
                setLoading(false);
                setIsCreationModalOpen(false);
                setIsCreationFormComplete(false);
                creationForm.resetFields()
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

    const handleUpdateOptometrist = async () => {
        if (updateForm != null) {
            try {
                setLoading(true);
                const values = await updateForm.validateFields();
                const response = await updateOptometrist(
                    {
                        idadmin: JSON.parse(localStorage.getItem('user')).idadmin,
                        id: selectedOptometrist.usuario.idusuario,
                        direccion: values.direccion,
                        correo: values.correo,
                        telefono: values.telefono,
                    }
                );
                setLoading(true);
                if (response.status === 200) {
                    showMessage(
                        'success',
                        `Los datos del optometra se actualizaron correctamente.`
                    )
                }
            } catch (error) {
                if (error.response.data.hasOwnProperty('error')) {
                    if(error.response.data.error.toLowerCase().includes('expired')){
                        showMessage(
                            'error',
                            `Su sesión expiró. En breve será redirigido a la página de inicio de sesión.`
                        )
                        setTimeout(() => {
                            localStorage.clear()
                            navigate('/inicio-empleados')
                        }, 5000)
                    } else if (error.response.data.error.toLowerCase().includes('does not match')) {
                        showMessage(
                            'error',
                            `Su sesión actual no es válida. Debe iniciar sesión de nuevo. En breve será redirigido a la página de inicio de sesión.`
                        )
                        setTimeout(() => {
                            localStorage.clear()
                            navigate('/inicio-empleados')
                        }, 7000)
                    }
                } else{
                    showMessage(
                        'error',
                        `Ocurrió un al actualizar los datos del optometra. ${error.response.data}`
                    )
                }
            } finally {
                fetchOptometrists();
                setIsUpdateModalOpen(false);
                setIsUpdateFormComplete(false);
                setSelectedOptometrist(null);
                setLoading(false);
            }
        }
    };
    
    const handleUpdateModalCancel = () => {
        setIsUpdateModalOpen(false);
        setIsUpdateFormComplete(false);
        setSelectedOptometrist(null);
        updateForm.resetFields()
    };






    // TO DEFINE TABLES FOR COLUMNS
    const columns = [
        {
            title: 'ID Optometra',
            key: 'idoptometra',
            render: (_, record) => (
                <h3>{record.idoptometra}</h3>
            )
        },
        {
            title: 'Nombre',
            key: 'name',
            render: (_, record) => (
                record.usuario.nombre + " " + record.usuario.apellido
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

            <FeedbackMessage visible={message?.visible} type={message?.type} text={message?.text} onClose={() => hideMessage()}></FeedbackMessage>
            
            
            <div className='search-form'>
                <Form name="search" layout="inline">
                    <Form.Item name="search-input">
                        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Nombre de optometra" onChange={e => setSearchText(e.target.value)} autoCapitalize='off'/>
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
                    <p className='confirmation'>¿Está seguro que desea {StatusChangeConfirmationModalAction === "enable" ? "habilitar" : "inhabilitar"} al optómetra {selectedOptometrist ? selectedOptometrist.usuario.nombre + ' ' + selectedOptometrist.usuario.apellido : ''}?</p>
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
                    {...layout}
                    className='creation-form'
                    initialValues={{ remember: false }}
                    form={creationForm}
                    name="employee-creation"
                    onFinish={handleCreateOptometrist}
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
                        <Input prefix={<UserOutlined/>} placeholder='Nombres' autoComplete='off'/>
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
                        <Input prefix={<UserOutlined/>} placeholder='Apellidos' autoComplete='off'/>
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
                        <Input prefix={<UserOutlined/>} placeholder='Dirección' autoComplete='off'/>
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
                        <Input prefix={<MailOutlined/>} placeholder='Correo eléctronico' autoComplete='off'/>
                    </Form.Item>

                    <Form.Item
                        label='Número telefónico'
                        name="telefono"
                        rules={[
                            {
                                type: 'number',
                                message: 'El número ingresado no es válido!'
                            },
                            {
                                required: true,
                                message: 'Por favor ingrese el número telefónico del optometra!'
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    const numericValue = Number(value);
                                    if (!isNaN(numericValue)) {
                                        const stringValue = String(numericValue);
                                        if (stringValue.length < 7) {
                                            return Promise.reject('El número de número telefónico debe tener al menos 7 dígitos.');
                                        }
                                        if (stringValue.length > 10) {
                                            return Promise.reject('El número de número telefónico no puede tener más de 10 dígitos.');
                                        }
                                        return Promise.resolve();
                                    } else {
                                        return Promise.reject('El número ingresado no es válido!');
                                    }
                                }
                            })
                        ]}
                    >
                        <InputNumber prefix={<PhoneOutlined/>} placeholder='Número telefónico' autoComplete='off'/>
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
                                message: 'Por favor ingrese el número de identificación del optómetra!'
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    const numericValue = Number(value);
                                    if (!isNaN(numericValue)) {
                                        const stringValue = String(numericValue);
                                        if (stringValue.length < 4) {
                                            return Promise.reject('El número de documento de identidad debe tener al menos 4 dígitos.');
                                        }
                                        if (stringValue.length > 12) {
                                            return Promise.reject('El número de documento de identidad no puede tener más de 12 dígitos.');
                                        }
                                        return Promise.resolve();
                                    } else {
                                        return Promise.reject('El número ingresado no es válido!');
                                    }
                                }
                            })
                        ]}
                    >
                        <InputNumber prefix={<IdcardOutlined/>} placeholder='Ingrese el número de cédula sin puntos' autoComplete='off'/>
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
                    {...layout}
                    className='creation-form'
                    form={updateForm}
                    name="employee-creation"
                    onFinish={handleUpdateOptometrist}
                    onValuesChange={onUpdateValuesChange}
                >
                    <Form.Item
                        label='Nombres'
                    >
                        <Typography>
                            <pre>{selectedOptometrist?.usuario.nombre}</pre>
                        </Typography>
                    </Form.Item>
                    
                    
                    <Form.Item
                        label='Apellidos'
                    >
                        <Typography>
                            <pre>{selectedOptometrist?.usuario.apellido}</pre>
                        </Typography>
                    </Form.Item>
                    

                    <Form.Item
                        label='Dirección'
                        name="direccion"
                        rules={[
                        {
                            required: true,
                            message: 'Por favor ingrese la dirección física del optómetra!',
                        }]}
                        initialValue={selectedOptometrist?.usuario.direccion}
                    >
                        <Input prefix={<UserOutlined/>} placeholder='Dirección' autoComplete='off'/>
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
                        initialValue={selectedOptometrist?.usuario.correo}
                    >
                        <Input prefix={<MailOutlined/>} placeholder='Correo eléctronico' autoComplete='off'/>
                    </Form.Item>

                    <Form.Item
                        label='Número telefónico'
                        name="telefono"
                        rules={[
                            {
                                type: 'number',
                                message: 'El número ingresado no es válido!'
                            },
                            {
                                required: true,
                                message: 'Por favor ingrese el número telefónico del optometra!'
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    const numericValue = Number(value);
                                    if (!isNaN(numericValue)) {
                                        const stringValue = String(numericValue);
                                        if (stringValue.length < 7) {
                                            return Promise.reject('El número de número telefónico debe tener al menos 7 dígitos.');
                                        }
                                        if (stringValue.length > 10) {
                                            return Promise.reject('El número de número telefónico no puede tener más de 10 dígitos.');
                                        }
                                        return Promise.resolve();
                                    } else {
                                        return Promise.reject('El número ingresado no es válido!');
                                    }
                                }
                            })
                        ]}
                        initialValue={selectedOptometrist?.usuario.telefono}
                    >
                        <InputNumber prefix={<PhoneOutlined/>} placeholder='Número telefónico' autoComplete='off'/>
                    </Form.Item>

                    <Form.Item
                        label='Documento de identidad'
                    >
                        <Typography>
                            <pre>{selectedOptometrist?.usuario.cedula}</pre>
                        </Typography>
                    </Form.Item>
                    
                </Form>
            </Modal>






            <div className='employee-table'>
                <Table columns={columns} dataSource={filteredData.map((item, index) => ({ ...item, key: index }))} scroll={{y: 600}} pagination={false}/>
            </div>
        </div>
    );
}