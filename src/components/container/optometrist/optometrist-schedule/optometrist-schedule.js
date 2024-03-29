import { useEffect, useRef, useState } from 'react';
import { Button, DatePicker, Form, Input, InputNumber, Select, Space, Table } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, IdcardOutlined } from '@ant-design/icons';
import { format } from 'date-fns';

import { useNavigate } from "react-router-dom";

import './optometrist-schedule.css';

// import { appointments } from './appointmentData';

import { getPatientById, updatePatient } from '../../../../services/patientService';
import { getAppointments } from '../../../../services/appointmentService';

export default function OptometristSchedule() {

    const ref = useRef(null);
    const [height, setHeight] = useState(0);
    const [width, setWidth] = useState(0);
    const [loading, setLoading] = useState(false);


    const navigation = useNavigate();

    useEffect(() => {
        setHeight(ref.current.offsetHeight);
        setWidth(ref.current.offsetWidth);
    }, [])

    const [activeTab, setActiveTab] = useState(1);





    
    // TO LOAD TODAY'S APPOINTMENTS
    const [appointments, setAppointments] = useState([])
    
    useEffect(() => {
        const today = new Date()
        const selectedDayFormatted = format(today, 'dd/MM/yyyy');
    
        getAppointments(selectedDayFormatted)
            .then(appointments => {
                setAppointments(appointments)
            })
            .catch(error => {
                console.error('Error while getting appointments', error)
            });
    }, []);





    // TO HANDLE FORMS
    const [updateForm] = Form.useForm();
    const selectGenderOptions = [{
        label: 'Masculino',
        value: 'masculino'
    },{
        label: 'Femenino',
        value: 'femenino'
    }];





    // TO FILTER NAMES IN THE TABLE ***********************************************************
    const [searchText, setSearchText] = useState('');
    const [filteredData, setFilteredData] = useState([]);

    useEffect(() => {
        setTimeout(() => {
            const filtered = Array.isArray(appointments) ? appointments.filter(appointment =>
                appointment.nombre.toLowerCase().includes(searchText.toLowerCase())
            ) : [];
            setFilteredData(filtered);
        }, 500);
    }, [searchText, appointments]);

    const search = (values) => {
        console.log('Received values from form: ', values);
    };




    // TO MAANGE PATIENT'S INFO
    const [patient, setPatient] = useState(null)


    const getPatientInfo = (values) => {
        console.log("El boton de crear optometra: ", JSON.stringify(values) )
    };
    /*
                End of form controls
                                                */

    // TO DEFINE TABLES FOR COLUMNS
    const columns = [
        {
            title: 'Hora',
            key: 'time',
            render: (_, record) => (
                record.hora
            )
        },
        {
            title: 'Nombre del paciente',
            key: 'nombre',
            render: (_, record) => (
                record.nombre
            )
        },
        {
            title: 'Acciones',
            key: 'action',
            render: (_, record) => (
            <Space size="middle">
                <Button type="primary" onClick={() => setPatient(true)} htmlType='submit'>
                    Iniciar consulta
                </Button>
            </Space>
            ),
        },
    ];






    // TO UPDATE PATIENT'S INFO
    const [isConfirmationFormComplete, setIsConfirmationFormComplete] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState(null);

    const onUpdateValuesChange = (_, allValues) => {
        const isComplete = Object.values(allValues).every(value => !!value);
        setIsConfirmationFormComplete(isComplete);
    };

    const handleUpdatePatient = async () => {
        setLoading(true);
        if (updateForm != null) {
            try {
                const values = await updateForm.validateFields();
                const response = await updatePatient(
                    {
                        id: selectedPatient.idpaciente,
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
                getPatientById(selectedPatient.idpaciente)
                setLoading(false);
                setTimeout(() => {
                    setLoading(false);
                    setSelectedPatient(null);
                }, 2000);
            }
        }
        setLoading(true)
    };
    





    return (
        /* div optometrist-schedule contains the whole screen in which thd component is displayed */
        <div className="optometrist-schedule" ref={ref}>
            
            {
                !patient &&
                <div className='search-form'>
                    <Form name="search" layout="inline" onFinish={search}>
                        <Form.Item name="search-input">
                            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Nombre del paciente" onChange={e => setSearchText(e.target.value)}/>
                        </Form.Item>
                    </Form>
                </div>
            }
            

            {!!patient &&
                <div className='patient-info'>
                    <div className='tab-header'>
                        <div className={`tab ${activeTab === 1 ? 'active' : ''}`} onClick={() => setActiveTab(1)}>Datos Personales</div>
                        <div className={`tab ${activeTab === 2 ? 'active' : ''}`} onClick={() => setActiveTab(2)}>Historía clínica</div>
                        <div className={`tab ${activeTab === 3 ? 'active' : ''}`} onClick={() => setActiveTab(3)}>Formula Clínica</div>
                    </div>
                    {activeTab === 1 &&
                        <div className='tab-content'>
                            <Form
                                className='creation-form'
                                initialValues={{ remember: false }}
                                form={updateForm}
                                name="patientUpdate"
                                onFinish={handleUpdatePatient}
                                onValuesChange={onUpdateValuesChange}
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

                                <Form.Item shouldUpdate>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        className="login-form-button"
                                        disabled={!isConfirmationFormComplete}
                                    >
                                        CREAR CUENTA
                                    </Button>
                                </Form.Item>

                            </Form>
                        </div>
                    }

                    {activeTab === 2 &&
                        <div className='tab-content'></div>
                    }

                    {activeTab === 3 &&
                        <div className='tab-content'></div>
                    }
                </div>
            }
            {!patient &&
                <div className='appointment-table'>
                    <Table
                        columns={columns}
                        dataSource={
                            filteredData.map(appointment => ({
                                ...appointment,
                                key: appointment.id
                            }))
                        }
                        scroll={{y: 600}}
                        pagination={false}
                    />
                </div>
            }
        </div>
    );
}