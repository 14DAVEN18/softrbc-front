import { useEffect, useRef, useState } from 'react';
import { Button, Collapse, DatePicker, Form, Input, InputNumber, Progress, Select, Space, Table, Typography } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, IdcardOutlined } from '@ant-design/icons';
import { format } from 'date-fns';

import './optometrist-schedule.css';

// import { appointments } from './appointmentData';

import { getPatientById, updatePatient } from '../../../../services/patientService';
import { getAppointments } from '../../../../services/appointmentService';
import { createMedicalRecord } from '../../../../services/medicalRecordService';


const layout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 10,
    },
};

const selectOjoDominante = [{
    label: 'Izquierdo',
    value: 'izquierdo'
},{
    label: 'Derecho',
    value: 'derecho'
}];

const selectManoDominante = [{
    label: 'Izquierda',
    value: 'izquierda'
},{
    label: 'Derecha',
    value: 'derecha'
}];

export default function OptometristSchedule() {

    const ref = useRef(null);
    const [height, setHeight] = useState(0);
    const [width, setWidth] = useState(0);
    const [loading, setLoading] = useState(false);
    const optometrist = useState(JSON.parse(localStorage.getItem('user')).name + ' ' + JSON.parse(localStorage.getItem('user')).surname )


    useEffect(() => {
        setHeight(ref.current.offsetHeight);
        setWidth(ref.current.offsetWidth);
    }, [])

    const [activeTab, setActiveTab] = useState(1);





    
    // TO LOAD TODAY'S APPOINTMENTS
    const [appointments, setAppointments] = useState([])
    
    useEffect(() => {
        const today = new Date(2024, 3, 1)
        const selectedDayFormatted = format(today, 'dd/MM/yyyy');
    
        getAppointments(selectedDayFormatted)
            .then(appointment => {
                setAppointments(appointment.data)
            })
            .catch(error => {
                console.error('Error while getting appointments', error)
            });
    }, []);





    // TO HANDLE FORMS
    const [updateForm] = Form.useForm();
    const [medicalRecordForm] = Form.useForm();
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




    // TO MANAGE PATIENT'S INFO
    const [patient, setPatient] = useState(null)


    const getPatientInfo = (values) => {
        console.log("El boton de crear optometra: ", JSON.stringify(values) )
    };
    





    // TO DEFINE TABLES FOR COLUMNS
    const columns = [
        {
            title: 'Hora',
            key: 'hora',
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
        if (isConfirmationFormComplete != null) {
            try {
                const values = await isConfirmationFormComplete.validateFields();
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







    // TO CREATE PATIENT'S MEDICAL RECORD
    const [isMedicalRecordFormComplete, setIsMedicalRecordFormComplete] = useState(false);
    const [progress, setProgress] = useState(0)

    const onMedicalRecordValuesChange = (_, allValues) => {
        console.log(allValues)
        const requiredFields = [
            'anamnesis',

            'antecedentesFamiliares',
            'antecedentesOculares',
            'antecedentesGenerales',

            'rxusood',
            'rxusooi',
            'rxusoadd',
            'vlejanarxod',
            'vlejanarxoi',
            'vlejanaod',
            'vlejanaoi',
            'distanciapupilar',
            'externo',

            'vproximarxod',
            'vproximarxoi',
            'vproximaod',
            'vproximaoi',

            'ducciones',
            'versiones',
            'ppc',
            'ct6m',
            'cm',
            'ojodominante',
            'manodominante',

            'oftalmoscopiaod',
            'oftalmoscopiaoi',

            'queratomeriaod',
            'queratometriaoi',

            'retinoscopiaod',
            'retinoscopiaoi',

            'rxfinalod',
            'rxfinaloi',
            'avl',
            'avp',
            'color',
            'rxfinaladd',
            'bif',
            'uso',
            'diagnostico',
            'conducta',
            'control' 
        ];
        const totalFields = requiredFields.length
        let count = 0;
        requiredFields.forEach(field => {
            if(!!allValues[field])
                count++;
        })
        setProgress(((count*100)/totalFields).toFixed(2))
        const isComplete = requiredFields.every(field => !!allValues[field]);
        setIsMedicalRecordFormComplete(isComplete);
    };
    
    const handleCreateMedicalRecord = async () => {
        if (medicalRecordForm != null) {
            try {
                setLoading(true);
                const values = await medicalRecordForm.validateFields();
                const response = await createMedicalRecord(
                    {
                        Anamnesis: {
                            anamnesis: values.anamnesis,
                        },
                        Antecedentes: {
                            antecedentesFamiliares: values.antecedentesFamiliares,
                            antecedentesOculares: values.antecedentesOculares,
                            antecedentesGenerales: values.antecedentesGenerales
                        },
                        RxUso: {
                            rxusood: values.rxusood,
                            rxusooi: values.rxusooi,
                            rxusoadd: values.rxusoadd
                        },
                        VisionLejana: {
                            vlejanarxod: values.vlejanarxod,
                            vlejanarxoi: values.vlejanarxoi,
                            vlejanaod: values.vlejanaod,
                            vlejanaoi: values.vlejanaoi,
                            distanciapupilar: values.distanciapupilar,
                            externo: values.externo
                        },
                        visionProxima: {
                            vproximarxod: values.vproximarxod,
                            vproximarxoi: values.vproximarxoi,
                            vproximaod: values.vproximaod,
                            vproximaoi: values.vproximaoi
                        },
                        Motilidad: {
                            ducciones: values.ducciones,
                            versiones: values.versiones,
                            ppc: values.ppc,
                            ct6m: values.ct6m,
                            cm: values.cm,
                            ojodominante: values.ojodominante,
                            manodominante: values.manodominante
                        },
                        Oftalmoscopia: {
                            oftalmoscopiaod: values.oftalmoscopiaod,
                            oftalmoscopiaoi: values.oftalmoscopiaoi
                        },
                        Queratometria: {
                            queratomeriaod: values.queratometriaod,
                            queratometriaoi: values.queratometriaoi
                        },
                        Retinoscopia: {
                            retinoscopiaod: values.retinoscopiaod,
                            retinoscopiaoi: values.retinoscopiaoi,
                        },
                        RxFinal: {
                            rxfinalod: values.rxfinalod,
                            rxfinaloi: values.rxfinaloi,
                            avl: values.avl,
                            avp: values.avp,
                            color: values.color,
                            add: values.rxfinaladd,
                            bif: values.bif,
                            uso: values.uso,
                            diagnostico: values.diagnostico,
                            conducta: values.conducta,
                            examinador: optometrist,
                            control: values.control 
                        }
                    }
                ); // Call the create function from userService.js
                //console.log('Response:', response.data);
                // Handle success if needed
            } catch (error) {
                console.error('Error en la solicitud:', error);
                // Handle error if needed
            } finally {
                setLoading(false);
                setIsMedicalRecordFormComplete(false);
            }
        }
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
                                {...layout}
                                className='creation-form'
                                initialValues={{ remember: false }}
                                form={updateForm}
                                name="patientUpdate"
                                onFinish={handleUpdatePatient}
                                onValuesChange={onUpdateValuesChange}
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
                                            message: 'Por favor ingrese el número de identificación del optómetra!'
                                        }
                                    ]}
                                >
                                    <InputNumber prefix={<IdcardOutlined/>} placeholder='Ingrese el número de cédula sin puntos'/>
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
                                    label='Género'
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
                                    shouldUpdate
                                    wrapperCol={{ offset: 8, span: 14 }}   
                                >
                                    <Button
                                        loading={loading}
                                        type="primary"
                                        htmlType="submit"
                                        className="login-form-button"
                                        disabled={!isConfirmationFormComplete}
                                    >
                                        CONFIRMAR INFORMACIÓN
                                    </Button>
                                </Form.Item>

                            </Form>
                        </div>
                    }







                    {activeTab === 2 &&
                        <div className='tab-content2'>
                            <div className='progress-bar'>
                                <Progress percent={progress} />
                            </div>

                            <Form
                                {...layout}
                                className='medical-record-form'
                                initialValues={{ remember: false }}
                                form={medicalRecordForm}
                                name="medicalRecord"
                                onFinish={handleCreateMedicalRecord}
                                onValuesChange={onMedicalRecordValuesChange}
                            >
                                <Collapse
                                    items={[
                                        {
                                            key: 1,
                                            label: 'Anamnesis',
                                            children:
                                                <Form.Item
                                                    label='Anamnesis'
                                                    name="anamnesis"
                                                    rules={[
                                                    {
                                                        required: true,
                                                        message: 'Por favor ingrese el diagnostico de anamensis del paciente!',
                                                    }]}
                                                >
                                                    <Input placeholder='Anamnesis' autoComplete='off'/>
                                                </Form.Item>
                                        },
                                        {
                                            key: 2,
                                            label: 'Antecedentes',
                                            children:
                                                <>
                                                    <Form.Item
                                                        label='Antecedentes familiares'
                                                        name="antecedentesFamiliares"
                                                        rules={[
                                                        {
                                                            required: true,
                                                            message: 'Por favor ingrese los antecedentes familiares del paciente!',
                                                        }]}
                                                    >
                                                        <Input placeholder='Antecedentes familiares' autoComplete='off'/>
                                                    </Form.Item>
                    
                                                    <Form.Item
                                                        label='Antecedentes oculares'
                                                        name="antecedentesOculares"
                                                        rules={[
                                                        {
                                                            required: true,
                                                            message: 'Por favor ingrese los antecedentes oculares del paciente!',
                                                        }]}
                                                    >
                                                        <Input placeholder='Antecedentes oculares' autoComplete='off'/>
                                                    </Form.Item>
                    
                                                    <Form.Item
                                                        label='Antecedentes generales'
                                                        name="antecedentesGenerales"
                                                        rules={[
                                                        {
                                                            required: true,
                                                            message: 'Por favor ingrese los antecedentes generales del paciente!',
                                                        }]}
                                                    >
                                                        <Input placeholder='Antecedentes generales' autoComplete='off'/>
                                                    </Form.Item>
                                                </>
                                        },
                                        {
                                            key: 3,
                                            label: 'RX en uso',
                                            children:
                                            <Space>
                                                <Form.Item
                                                    label='OD'
                                                    name='rxusood'
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: 'Por favor ingrese el valor para el ojo derecho!'
                                                        }
                                                    ]}
                                                >
                                                    <Input placeholder='OD' autoComplete='off'/>
                                                </Form.Item>
            
                                                <Form.Item
                                                    label='OI'
                                                    name='rxusooi'
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: 'Por favor ingrese el valor para el ojo izquierdo'
                                                        }
                                                    ]}
                                                >
                                                    <Input placeholder='OI' autoComplete='off'/>
                                                </Form.Item>
            
                                                <Form.Item
                                                    label='ADD+'
                                                    name='rxusoadd'
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: 'Por favor ingrese el valor add+'
                                                        }
                                                    ]}
                                                >
                                                    <Input placeholder='ADD+' autoComplete='off'/>
                                                </Form.Item>
                                            </Space>
                                        },
                                        {
                                            key: 4,
                                            label: 'Visión lejana',
                                            children:
                                                <>
                                                    <h3>Con RX</h3>
                                                    <Space>
                                                        <Form.Item
                                                            label='OD'
                                                            name='vlejanarxod'
                                                            rules={[
                                                                {
                                                                    required: true,
                                                                    message: 'Por favor ingrese el valor OD'
                                                                }
                                                            ]}
                                                        >
                                                            <Input placeholder='OD' autoComplete='off'/>
                                                        </Form.Item>

                                                        <Form.Item
                                                            label='OI'
                                                            name='vlejanarxoi'
                                                            rules={[
                                                                {
                                                                    required: true,
                                                                    message: 'Por favor ingrese el valor OI'
                                                                }
                                                            ]}
                                                        >
                                                            <Input placeholder='OI' autoComplete='off'/>
                                                        </Form.Item>
                                                    </Space>

                                                    <h3>Sin RX</h3>
                                                    <Space>
                                                        <Form.Item
                                                            label='OD'
                                                            name='vlejanaod'
                                                            rules={[
                                                                {
                                                                    required: true,
                                                                    message: 'Por favor ingrese el valor OD'
                                                                }
                                                            ]}
                                                        >
                                                            <Input placeholder='OD' autoComplete='off'/>
                                                        </Form.Item>

                                                        <Form.Item
                                                            label='OI'
                                                            name='vlejanaoi'
                                                            rules={[
                                                                {
                                                                    required: true,
                                                                    message: 'Por favor ingrese el valor OI'
                                                                }
                                                            ]}
                                                        >
                                                            <Input placeholder='OI' autoComplete='off'/>
                                                        </Form.Item>
                                                    </Space>
                                                    
                                                    <Form.Item
                                                        label='Distancia pupilar'
                                                        name="distanciapupilar"
                                                        rules={[
                                                        {
                                                            required: true,
                                                            message: 'Por favor ingrese la distancia pupilar del paciente!',
                                                        }]}
                                                    >
                                                        <Input placeholder='Distancia pupilar' autoComplete='off'/>
                                                    </Form.Item>

                                                    <Form.Item
                                                        label='Examen externo'
                                                        name="externo"
                                                        rules={[
                                                        {
                                                            required: true,
                                                            message: 'Por favor ingrese los datos del examen externo!',
                                                        }]}
                                                    >
                                                        <Input placeholder='Examen externo' autoComplete='off'/>
                                                    </Form.Item>
                                                </>
                                        },
                                        {
                                            key: 5,
                                            label: 'Visión próxima',
                                            children:
                                                <>
                                                    <h3>Con RX</h3>
                                                    <Space>
                                                        <Form.Item
                                                            label='OD'
                                                            name='vproximarxod'
                                                            rules={[
                                                                {
                                                                    required: true,
                                                                    message: 'Por favor ingrese el valor OD'
                                                                }
                                                            ]}
                                                        >
                                                            <Input placeholder='OD' autoComplete='off'/>
                                                        </Form.Item>

                                                        <Form.Item
                                                            label='OI'
                                                            name='vproximarxoi'
                                                            rules={[
                                                                {
                                                                    required: true,
                                                                    message: 'Por favor ingrese el valor OI'
                                                                }
                                                            ]}
                                                        >
                                                            <Input placeholder='OI' autoComplete='off'/>
                                                        </Form.Item>
                                                    </Space>

                                                    <h3>Sin RX</h3>
                                                    <Space>
                                                        <Form.Item
                                                            label='OD'
                                                            name='vproximaod'
                                                            rules={[
                                                                {
                                                                    required: true,
                                                                    message: 'Por favor ingrese el valor OD'
                                                                }
                                                            ]}
                                                        >
                                                            <Input placeholder='OD' autoComplete='off'/>
                                                        </Form.Item>

                                                        <Form.Item
                                                            label='OI'
                                                            name='vproximaoi'
                                                            rules={[
                                                                {
                                                                    required: true,
                                                                    message: 'Por favor ingrese el valor OI'
                                                                }
                                                            ]}
                                                        >
                                                            <Input placeholder='OI' autoComplete='off'/>
                                                        </Form.Item>
                                                    </Space>
                                                </>
                                        },
                                        {
                                            key: 6,
                                            label: 'Motilidad',
                                            children:
                                                <>
                                                    <Form.Item
                                                        label='Ducciones'
                                                        name="ducciones"
                                                        rules={[
                                                        {
                                                            required: true,
                                                            message: 'Por favor ingrese las ducciones del paciente!',
                                                        }]}
                                                    >
                                                        <Input placeholder='Ducciones' autoComplete='off'/>
                                                    </Form.Item>

                                                    <Form.Item
                                                        label='Versiones'
                                                        name="versiones"
                                                        rules={[
                                                        {
                                                            required: true,
                                                            message: 'Por favor ingrese las versiones del paciente!',
                                                        }]}
                                                    >
                                                        <Input placeholder='Ducciones' autoComplete='off'/>
                                                    </Form.Item>

                                                    <Space>
                                                        <Form.Item
                                                            label='PPC'
                                                            name="ppc"
                                                            rules={[
                                                            {
                                                                required: true,
                                                                message: 'Por favor ingrese el PPC!',
                                                            }]}
                                                        >
                                                            <Input placeholder='PPC' autoComplete='off'/>
                                                        </Form.Item>

                                                        <Form.Item
                                                            label='CT6m'
                                                            name="ct6m"
                                                            rules={[
                                                            {
                                                                required: true,
                                                                message: 'Por favor ingrese el CT6m!',
                                                            }]}
                                                        >
                                                            <Input placeholder='ct6m' autoComplete='off'/>
                                                        </Form.Item>

                                                        <Form.Item
                                                            label='33cm'
                                                            name="cm"
                                                            rules={[
                                                            {
                                                                required: true,
                                                                message: 'Por favor ingrese el 33cm!',
                                                            }]}
                                                        >
                                                            <Input placeholder='33cm' autoComplete='off'/>
                                                        </Form.Item>
                                                    </Space>

                                                    <Space>
                                                        <Form.Item
                                                            label='Ojo dominante'
                                                            name="ojodominante"
                                                            rules={[
                                                            {
                                                                required: true,
                                                                message: 'Por favor seleccione el ojo dominante!',
                                                            }]}
                                                        >
                                                            <Select size={'large'} defaultValue="Seleccione el ojo dominante" options={selectOjoDominante} />
                                                        </Form.Item>

                                                        <Form.Item
                                                            label='Mano dominante'
                                                            name="manodominante"
                                                            rules={[
                                                            {
                                                                required: true,
                                                                message: 'Por favor seleccione la mano dominante!',
                                                            }]}
                                                        >
                                                            <Select size={'large'} defaultValue="Seleccione la mano dominante" options={selectManoDominante} />
                                                        </Form.Item>
                                                    </Space>
                                                </>
                                        },
                                        {
                                            key: 7,
                                            label: 'Oftalmoscopia',
                                            children:
                                                <>
                                                    <Space>
                                                        <Form.Item
                                                            label='OD'
                                                            name="oftalmoscopiaod"
                                                            rules={[
                                                            {
                                                                required: true,
                                                                message: 'Por favor digite el valor del ojo derecho!',
                                                            }]}
                                                        >
                                                            <Input placeholder='OD' autoComplete='off'/>
                                                        </Form.Item>

                                                        <Form.Item
                                                            label='OI'
                                                            name="oftalmoscopiaoi"
                                                            rules={[
                                                            {
                                                                required: true,
                                                                message: 'Por favor digite el valor del ojo izquierdo!',
                                                            }]}
                                                        >
                                                            <Input placeholder='OI' autoComplete='off'/>
                                                        </Form.Item>
                                                    </Space>
                                                </>
                                        },
                                        {
                                            key: 8,
                                            label: 'Queratometría',
                                            children:
                                                <>
                                                    <Space>
                                                        <Form.Item
                                                            label='OD'
                                                            name="queratomeriaod"
                                                            rules={[
                                                            {
                                                                required: true,
                                                                message: 'Por favor digite el valor del ojo derecho!',
                                                            }]}
                                                        >
                                                            <Input placeholder='OD' autoComplete='off'/>
                                                        </Form.Item>

                                                        <Form.Item
                                                            label='OI'
                                                            name="queratometriaoi"
                                                            rules={[
                                                            {
                                                                required: true,
                                                                message: 'Por favor digite el valor del ojo izquierdo!',
                                                            }]}
                                                        >
                                                            <Input placeholder='OI' autoComplete='off'/>
                                                        </Form.Item>
                                                    </Space>
                                                </>
                                        },
                                        {
                                            key: 9,
                                            label: 'Retinoscopia',
                                            children:
                                                <>
                                                    <Space>
                                                        <Form.Item
                                                            label='OD'
                                                            name="retinoscopiaod"
                                                            rules={[
                                                            {
                                                                required: true,
                                                                message: 'Por favor digite el valor del ojo derecho!',
                                                            }]}
                                                        >
                                                            <Input placeholder='OD' autoComplete='off'/>
                                                        </Form.Item>

                                                        <Form.Item
                                                            label='OI'
                                                            name="retinoscopiaoi"
                                                            rules={[
                                                            {
                                                                required: true,
                                                                message: 'Por favor digite el valor del ojo izquierdo!',
                                                            }]}
                                                        >
                                                            <Input placeholder='OI' autoComplete='off'/>
                                                        </Form.Item>
                                                    </Space>
                                                </>
                                        },
                                        {
                                            key: 10,
                                            label: 'Rx Final',
                                            children:
                                                <>
                                                    <Space>
                                                        <Form.Item
                                                            label='OD'
                                                            name="rxfinalod"
                                                            rules={[
                                                            {
                                                                required: true,
                                                                message: 'Por favor digite el valor del ojo derecho!',
                                                            }]}
                                                        >
                                                            <Input placeholder='OD' autoComplete='off'/>
                                                        </Form.Item>

                                                        <Form.Item
                                                            label='OI'
                                                            name="rxfinaloi"
                                                            rules={[
                                                            {
                                                                required: true,
                                                                message: 'Por favor digite el valor del ojo izquierdo!',
                                                            }]}
                                                        >
                                                            <Input placeholder='OI' autoComplete='off'/>
                                                        </Form.Item>

                                                        <Form.Item
                                                            label='AVL'
                                                            name="avl"
                                                            rules={[
                                                            {
                                                                required: true,
                                                                message: 'Por favor digite el valor de AVL!',
                                                            }]}
                                                        >
                                                            <Input placeholder='AVL' autoComplete='off'/>
                                                        </Form.Item>

                                                        <Form.Item
                                                            label='AVP'
                                                            name="avp"
                                                            rules={[
                                                            {
                                                                required: true,
                                                                message: 'Por favor digite el valor de AVP!',
                                                            }]}
                                                        >
                                                            <Input placeholder='AVP' autoComplete='off'/>
                                                        </Form.Item>
                                                    </Space>

                                                    <Space>
                                                        <Form.Item
                                                            label='Color'
                                                            name="color"
                                                            rules={[
                                                            {
                                                                required: true,
                                                                message: 'Por favor digite el color!',
                                                            }]}
                                                        >
                                                            <Input placeholder='Color' autoComplete='off'/>
                                                        </Form.Item>

                                                        <Form.Item
                                                            label='ADD+'
                                                            name="rxfinaladd"
                                                            rules={[
                                                            {
                                                                required: true,
                                                                message: 'Por favor digite el valor de ADD+!',
                                                            }]}
                                                        >
                                                            <Input placeholder='ADD+' autoComplete='off'/>
                                                        </Form.Item>

                                                        <Form.Item
                                                            label='BIF'
                                                            name="bif"
                                                            rules={[
                                                            {
                                                                required: true,
                                                                message: 'Por favor digite el valor de BIF!',
                                                            }]}
                                                        >
                                                            <Input placeholder='BIF' autoComplete='off'/>
                                                        </Form.Item>
                                                    </Space>

                                                    <Form.Item
                                                        label='Uso'
                                                        name="uso"
                                                        rules={[
                                                        {
                                                            required: true,
                                                            message: 'Por favor digite el uso.',
                                                        }]}
                                                    >
                                                        <Input placeholder='Uso' autoComplete='off'/>
                                                    </Form.Item>

                                                    <Form.Item
                                                        label='Diagnostico'
                                                        name="diagnostico"
                                                        rules={[
                                                        {
                                                            required: true,
                                                            message: 'Por favor digite el diagnostico.',
                                                        }]}
                                                    >
                                                        <Input placeholder='Diagnostico' autoComplete='off'/>
                                                    </Form.Item>

                                                    <Form.Item
                                                        label='Conducta'
                                                        name="conducta"
                                                        rules={[
                                                        {
                                                            required: true,
                                                            message: 'Por favor digite la conducta.',
                                                        }]}
                                                    >
                                                        <Input placeholder='conducta' autoComplete='off'/>
                                                    </Form.Item>

                                                    <Form.Item
                                                        label='Examinador'
                                                    >
                                                        <Typography>
                                                            <pre>{optometrist}</pre>
                                                        </Typography>
                                                    </Form.Item>

                                                    <Form.Item
                                                        label='Control'
                                                        name='control'
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message: 'Por favor digite el tiempo para control.',
                                                            }]}
                                                    >
                                                        <Input placeholder='Control' autoComplete='off'/>
                                                    </Form.Item>
                                                </>
                                        }
                                    ]}      
                                />

                                <Form.Item 
                                    shouldUpdate
                                    wrapperCol={{ offset: 5, span: 16 }}    
                                >
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        className="login-form-button"
                                        disabled={!isMedicalRecordFormComplete}
                                    >
                                        CONFIRMAR REGISTRO
                                    </Button>
                                </Form.Item>
                            </Form>
                        </div>
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
                                key: appointment.idcita
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