import { useEffect, useRef, useState } from 'react';
import { Button, Collapse, DatePicker, Form, Input, InputNumber, Modal, Progress, Select, Space, Table, Typography } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, IdcardOutlined } from '@ant-design/icons';
import { format } from 'date-fns';
import { saveAs } from 'file-saver';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

import './optometrist-schedule.css';

import { getPatientById, updatePatient } from '../../../../services/patientService';
import { getAppointments } from '../../../../services/appointmentService';
import { addMedicalRecord, createMedicalRecord, generatePdfFormula } from '../../../../services/medicalRecordService';
import FeedbackMessage from '../../common/feedback-message/feedback-message';


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
    const [optometrist, setOptometrist] = useState('')
    const [message, setMessage] = useState({
        visible: false,
        type: '',
        text: ''
    })
    const dateFormat = "YYYY/MM/DD";
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

    useEffect(() => {
        setHeight(ref.current.offsetHeight);
        setWidth(ref.current.offsetWidth);
        if (localStorage.getItem('user')){
            setOptometrist(JSON.parse(localStorage.getItem('user')).name + ' ' + JSON.parse(localStorage.getItem('user')).surname)
        }
    }, [ref])

    const [activeTab, setActiveTab] = useState(1);





    
    // TO LOAD TODAY'S APPOINTMENTS
    const [appointments, setAppointments] = useState([])

    
    
    useEffect(() => {
        const fetchAppointments = async (date) => {
            try {
                const response = await getAppointments(date)
                setAppointments(response.data)
                if (response.status === 200) {
                    showMessage(
                        'success',
                        `Las citas de hoy fueron cargadas correctamente.`
                    )
                }
            } catch (error) {
                if(error.response.data.error.toLowerCase().includes('expired')){
                    showMessage(
                        'error',
                        `Su sesión expiró. En breve será redirigido a la página de inicio de sesión.`
                    )
                    setTimeout(() => {
                        localStorage.clear()
                        navigate('/inicio-empleados')
                    }, 5000)
                } else {
                    showMessage(
                        'error',
                        `Ocurrió un error al cargar la agenda del dia. ${error.message}`
                    )
                }
            }
        }

        if(!localStorage.getItem('token')) {
            navigate("/inicio-empleados")
        } else {
            const today = new Date(2024, 3, 12)
            const selectedDayFormatted = format(today, 'dd/MM/yyyy');
            fetchAppointments(selectedDayFormatted)
        }
    }, [navigate]);





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
        const filterAndSortAppointments = () => {
            const filteredAppointments = Array.isArray(appointments)
                ? appointments.filter(appointment =>
                      appointment.nombre.toLowerCase().includes(searchText.toLowerCase())
                  )
                : [];

            // Sort filtered appointments by time
            filteredAppointments.sort((a, b) => {
                const timeA = parseTime(a.hora);
                const timeB = parseTime(b.hora);
                return compareTimes(timeA, timeB);
            });

            setFilteredData(filteredAppointments);
        };

        // Use a timeout to debounce the filtering and sorting
        const timeoutId = setTimeout(filterAndSortAppointments, 500);

        return () => clearTimeout(timeoutId);
    }, [searchText, appointments]);

    // Function to parse time string like '9:00' into a sortable value
    const parseTime = (timeString) => {
        const [hours, minutes] = timeString.split(':').map(part => parseInt(part, 10));
        return hours * 60 + minutes; // Convert time to minutes since midnight
    };

    // Function to compare two time values
    const compareTimes = (timeA, timeB) => {
        return timeA - timeB; // Compare time values
    };




    // TO MANAGE PATIENT'S INFO
    const [patient, setPatient] = useState(null)
    const [currentAppointment, setCurrentAppointment] = useState(null)

    const getPatientInfo = async (idpaciente, idcita) => {
        setCurrentAppointment(appointments.find(appointment => {
            return appointment.idcita === idcita
        }))
        try {
            const response = await getPatientById(idpaciente); 
            const dateOfBirthMoment = dayjs(response.data[0].paciente.fechanacimiento, 'YYYY/MM/DD');
            const updatedPatientData = {
                ...response.data[0],
                fechanacimiento: dateOfBirthMoment,
            };
            setPatient(updatedPatientData)
            if (response.status === 200) {
                showMessage(
                    'success',
                    `Los datos del usuario ${patient?.usuario.nombre} ${patient?.usuario.apellido} fueron cargados exitosamente.`
                )
            }
        } catch (error) {
            if(error.response.data.error.toLowerCase().includes('expired')){
                showMessage(
                    'error',
                    `Su sesión expiró. En breve será redirigido a la página de inicio de sesión.`
                )
                setTimeout(() => {
                    navigate('/inicio-empleados')
                }, 5000)
            } else {
                showMessage(
                    'error',
                    `Ocurrió un error al cargar los datos del usuario. ${error.data}`
                )
            }
        } finally {
            setLoading(false);
        }
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
                <Button type="primary" onClick={() => getPatientInfo(record.idpaciente, record.idcita)} htmlType='submit'>
                    Iniciar consulta
                </Button>
            </Space>
            ),
        },
    ];






    // TO UPDATE PATIENT'S INFO
    const [isConfirmationFormComplete, setIsConfirmationFormComplete] = useState(false);

    const onUpdateValuesChange = (_, allValues) => {
        const isComplete = Object.values(allValues).every(value => !!value);
        setIsConfirmationFormComplete(isComplete);
    };

    const handleUpdatePatient = async () => {
        setLoading(true);
        if (updateForm != null) {
            try {
                const values = await updateForm.validateFields();
                const response = await updatePatient({
                    usuario: {
                        idusuario: patient?.usuario.idusuario,
                        nombre: values.nombre,
                        apellido: values.apellido,
                        correo: values.correo,
                        direccion: values.direccion,
                        telefono: values.telefono,
                        cedula: values.cedula
                    },
                    paciente: {
                        idpaciente: patient?.paciente.idpaciente,
                        ocupacion: values.ocupacion,
                        fechanacimiento: values.fechanacimiento,
                        genero: values.genero
                    },
                    idoptometra: JSON.parse(localStorage.getItem('user')).idoptometra
                });
                if (response.status === 200) {
                    showMessage(
                        'success',
                        `Los datos personales del usuario ${patient?.usuario.nombre} ${patient?.usuario.apellido} fueron actualizados correctamente`
                    )
                }
            } catch (error) {
                if(error.response.data.error.toLowerCase().includes('expired')){
                    showMessage(
                        'error',
                        `Su sesión expiró. En breve será redirigido a la página de inicio de sesión.`
                    )
                    setTimeout(() => {
                        navigate('/inicio-empleados')
                    }, 5000)
                } else {
                    showMessage(
                        'error',
                        `Ocurrió un error al registrar los datos del paciente: ${error.data}.`
                    )
                }
            } finally {
                setLoading(false);
                setTimeout(() => {
                    setLoading(false);
                }, 2000);
            }
        }
        setLoading(true)
    };






    // TO CREATE PATIENT'S MEDICAL RECORD
    const handleMedicalRecord = async () => {
        try {
            const response = await createMedicalRecord();
            setTimeout(() => {
                setPatient(prevPatient => ({
                    ...prevPatient,
                    paciente: {
                        ...prevPatient.paciente,
                        idhistoriaclinica: response.data.idhistoriaclinica
                    }
                }))
            }, 1000)
            if (response.status === 200) {
                showMessage(
                    'success',
                    `La historia clínica para ${patient?.usuario.nombre} ${patient?.usuario.apellido} fue creada exitosamente`
                )
            }
        } catch (error ){
            if(error.response.data.error.toLowerCase().includes('expired')){
                showMessage(
                    'error',
                    `Su sesión expiró. En breve será redirigido a la página de inicio de sesión.`
                )
                setTimeout(() => {
                    navigate('/inicio-empleados')
                }, 5000)
            } else {
                showMessage(
                    'error',
                    `Ocurrió un error al crear la historia médica del paciente. ${error.data}.`
                )
            }
        }
    }








    // TO ADD PATIENT'S MEDICAL RECORD
    const [isMedicalRecordFormComplete, setIsMedicalRecordFormComplete] = useState(false);
    const [progress, setProgress] = useState(0)
    const [medicalRecord, setMedicalRecord] = useState(null)

    const onMedicalRecordValuesChange = (_, allValues) => {
        const requiredFields = [
            'anamnesis',
            'antecedentesFamiliares', 'antecedentesOculares', 'antecedentesGenerales',
            'rxusood', 'rxusooi', 'rxusoadd', 'vlejanarxod', 'vlejanarxoi', 'vlejanaod', 'vlejanaoi', 'distanciapupilar', 'externo',
            'vproximarxod', 'vproximarxoi', 'vproximaod', 'vproximaoi',
            'ducciones', 'versiones', 'ppc', 'ct6m', 'cm', 'ojodominante', 'manodominante',
            'oftalmoscopiaod', 'oftalmoscopiaoi', 
            'queratometriaod', 'queratometriaoi',
            'retinoscopiaod', 'retinoscopiaoi',
            'rxfinalod', 'rxfinaloi', 'avl', 'avp', 'color', 'rxfinaladd', 'bif', 'uso', 'diagnostico', 'conducta', 'control' 
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
    
    
    const handleAddMedicalRecord = async () => {
        if (medicalRecordForm != null) {
            try {
                setLoading(true);
                const values = await medicalRecordForm.validateFields();
                setMedicalRecord(values)
                const response = await addMedicalRecord(
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
                            queratometriaod: values.queratometriaod,
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
                            observaciones: values.observaciones,
                            control: values.control 
                        },
                        paciente: {
                            idpaciente: patient.paciente.idpaciente,
                            idoptometra: JSON.parse(localStorage.getItem('user')).idoptometra
                        },
                        idhistoriaclinica: patient.paciente.idhistoriaclinica
                    }
                );
                if (response.status === 200) {
                    showMessage(
                        'success',
                        `El registro de la consulta fue agregado a la historia clínica del paciente de manera exitosa.`
                    )
                }
            } catch (error) {
                if(error.response.data.error.toLowerCase().includes('expired')){
                    showMessage(
                        'error',
                        `Su sesión expiró. En breve será redirigido a la página de inicio de sesión.`
                    )
                    setTimeout(() => {
                        navigate('/inicio-empleados')
                    }, 5000)
                } else {
                    showMessage(
                        'error',
                        `Ocurrió un error en el registro de la consulta. ${error.data}.`
                    )
                }
            } finally {
                setLoading(false);
                setIsMedicalRecordFormComplete(false);
            }
        }
    };






    // TO HANDLE END CONSULTATION
    const endConsultation = async () => {
        if (medicalRecord != null) {
            try {
                setLoading(true);
                const response = await generatePdfFormula(
                    {
                        rxfinalod: medicalRecord.rxfinalod,
                        rxfinaloi: medicalRecord.rxfinaloi,
                        avl: medicalRecord.avl,
                        avp: medicalRecord.avp,
                        add: medicalRecord.rxfinaladd,
                        bif: medicalRecord.bif,
                        uso: medicalRecord.uso,
                        diagnostico: medicalRecord.diagnostico,
                        observaciones: medicalRecord.observaciones,
                        idcita: currentAppointment.idcita
                    }
                );
                const blob = new Blob([response.data], { type: 'application/json' });
                saveAs(blob, `formula.pdf`); 
                if (response.status === 200) {
                    showMessage(
                        'success',
                        `El registro de la consulta fue agregado a la historia clínica del paciente de manera exitosa. Un PDF con la formula será descargado.`
                    )
                }
            } catch (error) {
                if(error.response.data.error.toLowerCase().includes('expired')){
                    showMessage(
                        'error',
                        `Su sesión expiró. En breve será redirigido a la página de inicio de sesión.`
                    )
                    setTimeout(() => {
                        navigate('/inicio-empleados')
                    }, 5000)
                } else {
                    showMessage(
                        'error',
                        `Ocurrió un error al anexar los datos de la consulta a la historia clínica del paciente. ${error.data}.`
                    )
                }
            } finally {
                setLoading(false);
                setIsMedicalRecordFormComplete(false);
            }
        }
    }
    





    return (
        /* div optometrist-schedule contains the whole screen in which thd component is displayed */
        <div className="optometrist-schedule" ref={ref}>
            <FeedbackMessage visible={message?.visible} type={message?.type} text={message?.text} onClose={() => hideMessage()}>
            </FeedbackMessage>
            {
                !patient &&
                <div className='search-form'>
                    <Form name="search" layout="inline">
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
                            <Form {...layout} className='creation-form' initialValues={patient} form={updateForm} name="patientUpdate" onFinish={handleUpdatePatient} onValuesChange={onUpdateValuesChange} >                                 
                                <Form.Item label='Nombres' name="nombre" 
                                    rules={[{
                                        required: true,
                                        message: 'Por favor ingrese el nombre del paciente sin apellidos!',
                                    }]}
                                    initialValue={patient?.usuario.nombre}
                                >
                                    <Input prefix={<UserOutlined/>} placeholder='Nombres'/>
                                </Form.Item>
                                    
                                <Form.Item label='Apellidos' name="apellido" 
                                    rules={[{
                                        required: true,
                                        message: 'Por favor ingrese el apellido del paciente sin nombres!',
                                    }]}
                                    initialValue={patient?.usuario.apellido}
                                >
                                    <Input prefix={<UserOutlined/>} placeholder='Apellidos'/>
                                </Form.Item>

                                <Form.Item label='Correo electrónico' name="correo"
                                    rules={[{
                                        type: 'email',
                                        message: 'El correo ingresado no es válido',
                                    },
                                    {
                                        required: true,
                                        message: 'Por favor ingrese el correo eléctronico del paciente!',
                                    },
                                    ]}
                                    initialValue={patient?.usuario.correo}
                                >
                                    <Input prefix={<MailOutlined/>} placeholder='Correo eléctronico'/>
                                </Form.Item>
                                
                                <Form.Item label='Dirección' name="direccion"
                                    rules={[{
                                        required: true,
                                        message: 'Por favor ingrese la dirección física del paciente!',
                                    }]}
                                    initialValue={patient?.usuario.direccion}
                                >
                                    <Input prefix={<UserOutlined/>} placeholder='Dirección'/>
                                </Form.Item>

                                <Form.Item label='Número telefónico' name="telefono"
                                    rules={[{
                                        type: 'number',
                                        message: 'El número ingresado no es válido!'
                                    },{
                                        required: true,
                                        message: 'Por favor ingrese el número telefónico del paciente!'
                                    }]}
                                    initialValue={patient?.usuario.telefono}
                                >
                                    <InputNumber prefix={<PhoneOutlined/>} placeholder='Número telefónico'/>
                                </Form.Item>

                                <Form.Item label='Documento de identidad' name="cedula" 
                                    rules={[{
                                            type: 'number',
                                            message: 'El número ingresado no es válido!'
                                    },{
                                            required: true,
                                            message: 'Por favor ingrese el número de identificación del paciente!'
                                    }]}
                                    initialValue={patient?.usuario.cedula}
                                >
                                    <InputNumber prefix={<IdcardOutlined/>} placeholder='Ingrese el número de cédula sin puntos'/>
                                </Form.Item>
                

                                <Form.Item label='Ocupación' name="ocupacion" 
                                    rules={[{
                                        required: true,
                                        message: 'Por favor ingrese su ocupación!',
                                    }]}
                                    initialValue={patient?.paciente.ocupacion}
                                >
                                    <Input prefix={<UserOutlined/>} placeholder='Ocupación'/>
                                </Form.Item>

                                <Form.Item label='Fecha de nacimiento' name="fechanacimiento"
                                    rules={[{
                                        required: true,
                                        message: 'Por favor seleccione la fecha de nacimiento del paciente!'
                                    }]}
                                >
                                    <DatePicker size={'large'} format={dateFormat} defaultValue={patient?.paciente.fechanacimiento}></DatePicker>
                                </Form.Item>

                                <Form.Item label='Género' name="genero"
                                    rules={[{
                                        required: true,
                                        message: 'Por favor seleccione el sexo paciente'
                                    }]}
                                    initialValue={patient?.paciente.genero}
                                >
                                    <Select size={'large'} defaultValue="Seleccione un sexo" options={selectGenderOptions} />
                                </Form.Item>

                                <Form.Item shouldUpdate wrapperCol={{ offset: 8, span: 14 }} >
                                    <Button loading={loading}type="primary" htmlType="submit" className="login-form-button" disabled={!isConfirmationFormComplete} >
                                        CONFIRMAR INFORMACIÓN
                                    </Button>
                                </Form.Item>
                            </Form>
                        </div>
                    }






                    {activeTab === 2 && !(!!patient?.paciente.idhistoriaclinica) &&
                        <div className='tab-content'>
                            <Modal title="No se encontró una historia clínica" centered open={!(!!patient?.idhistoriaclinica)} footer=
                                {<>
                                    <Button key="action" type="primary" loading={loading} onClick={handleMedicalRecord}>
                                        Crear historia clínica
                                    </Button>
                                </>}
                            >
                                <p className='confirmation'>El paciente {patient?.usuario.nombre} no tiene una historia clínica asignada. Primero debe crear una historia clínica para proceder con la consulta</p>
                            </Modal>
                        </div>
                    }
                    {activeTab === 2 && (!!patient?.paciente.idhistoriaclinica) &&
                        <div className='tab-content-create'>
                            <div className='progress-bar'>
                                <Progress percent={progress} />
                            </div>
                            <Form {...layout} className='medical-record-form' initialValues={{ remember: false }} form={medicalRecordForm} name="medicalRecord" onFinish={handleAddMedicalRecord} onValuesChange={onMedicalRecordValuesChange} >
                                <Collapse
                                    items={[{ key: 1, label: 'Anamnesis', children:
                                                <Form.Item label='Anamnesis' name="anamnesis" rules={[{
                                                        required: true,
                                                        message: 'Por favor ingrese el diagnostico de anamensis del paciente!',
                                                    }]}
                                                >
                                                    <Input placeholder='Anamnesis' autoComplete='off'/>
                                                </Form.Item>
                                        },
                                        { key: 2, label: 'Antecedentes', children:
                                                <>
                                                    <Form.Item label='Antecedentes familiares' name="antecedentesFamiliares"
                                                        rules={[{
                                                            required: true,
                                                            message: 'Por favor ingrese los antecedentes familiares del paciente!',
                                                        }]}
                                                    >
                                                        <Input placeholder='Antecedentes familiares' autoComplete='off'/>
                                                    </Form.Item>
                    
                                                    <Form.Item label='Antecedentes oculares' name="antecedentesOculares"
                                                        rules={[{
                                                            required: true,
                                                            message: 'Por favor ingrese los antecedentes oculares del paciente!',
                                                        }]}
                                                    >
                                                        <Input placeholder='Antecedentes oculares' autoComplete='off'/>
                                                    </Form.Item>
                    
                                                    <Form.Item label='Antecedentes generales' name="antecedentesGenerales"
                                                        rules={[{
                                                            required: true,
                                                            message: 'Por favor ingrese los antecedentes generales del paciente!',
                                                        }]}
                                                    >
                                                        <Input placeholder='Antecedentes generales' autoComplete='off'/>
                                                    </Form.Item>
                                                </>
                                        },
                                        { key: 3, label: 'RX en uso', children:
                                            <Space>
                                                <Form.Item label='OD' name='rxusood'
                                                    rules={[{
                                                            required: true,
                                                            message: 'Por favor ingrese el valor para el ojo derecho!'
                                                    }]}
                                                >
                                                    <Input placeholder='OD' autoComplete='off'/>
                                                </Form.Item>
            
                                                <Form.Item label='OI' name='rxusooi'
                                                    rules={[{
                                                            required: true,
                                                            message: 'Por favor ingrese el valor para el ojo izquierdo'
                                                    }]}
                                                >
                                                    <Input placeholder='OI' autoComplete='off'/>
                                                </Form.Item>
            
                                                <Form.Item label='ADD+' name='rxusoadd'
                                                    rules={[{
                                                            required: true,
                                                            message: 'Por favor ingrese el valor add+'
                                                    }]}
                                                >
                                                    <Input placeholder='ADD+' autoComplete='off'/>
                                                </Form.Item>
                                            </Space>
                                        },
                                        { key: 4, label: 'Visión lejana', children:
                                                <>
                                                    <h3>Con RX</h3>
                                                    <Space>
                                                        <Form.Item label='OD' name='vlejanarxod'
                                                            rules={[{
                                                                    required: true,
                                                                    message: 'Por favor ingrese el valor OD'
                                                            }]}
                                                        >
                                                            <Input placeholder='OD' autoComplete='off'/>
                                                        </Form.Item>

                                                        <Form.Item label='OI' name='vlejanarxoi'
                                                            rules={[{
                                                                    required: true,
                                                                    message: 'Por favor ingrese el valor OI'
                                                            }]}
                                                        >
                                                            <Input placeholder='OI' autoComplete='off'/>
                                                        </Form.Item>
                                                    </Space>

                                                    <h3>Sin RX</h3>
                                                    <Space>
                                                        <Form.Item label='OD' name='vlejanaod'
                                                            rules={[{
                                                                    required: true,
                                                                    message: 'Por favor ingrese el valor OD'
                                                            }]}
                                                        >
                                                            <Input placeholder='OD' autoComplete='off'/>
                                                        </Form.Item>

                                                        <Form.Item label='OI' name='vlejanaoi'
                                                            rules={[{
                                                                    required: true,
                                                                    message: 'Por favor ingrese el valor OI'
                                                            }]}
                                                        >
                                                            <Input placeholder='OI' autoComplete='off'/>
                                                        </Form.Item>
                                                    </Space>
                                                    
                                                    <Form.Item label='Distancia pupilar' name="distanciapupilar"
                                                        rules={[{
                                                            required: true,
                                                            message: 'Por favor ingrese la distancia pupilar del paciente!',
                                                        }]}
                                                    >
                                                        <Input placeholder='Distancia pupilar' autoComplete='off'/>
                                                    </Form.Item>

                                                    <Form.Item label='Examen externo' name="externo"
                                                        rules={[{
                                                            required: true,
                                                            message: 'Por favor ingrese los datos del examen externo!',
                                                        }]}
                                                    >
                                                        <Input placeholder='Examen externo' autoComplete='off'/>
                                                    </Form.Item>
                                                </>
                                        },
                                        { key: 5, label: 'Visión próxima', children:
                                                <>
                                                    <h3>Con RX</h3>
                                                    <Space>
                                                        <Form.Item label='OD' name='vproximarxod'
                                                            rules={[{
                                                                    required: true,
                                                                    message: 'Por favor ingrese el valor OD'
                                                            }]}
                                                        >
                                                            <Input placeholder='OD' autoComplete='off'/>
                                                        </Form.Item>

                                                        <Form.Item label='OI' name='vproximarxoi'
                                                            rules={[{
                                                                    required: true,
                                                                    message: 'Por favor ingrese el valor OI'
                                                            }]}
                                                        >
                                                            <Input placeholder='OI' autoComplete='off'/>
                                                        </Form.Item>
                                                    </Space>

                                                    <h3>Sin RX</h3>
                                                    <Space>
                                                        <Form.Item label='OD' name='vproximaod'
                                                            rules={[{
                                                                    required: true,
                                                                    message: 'Por favor ingrese el valor OD'
                                                            }]}
                                                        >
                                                            <Input placeholder='OD' autoComplete='off'/>
                                                        </Form.Item>

                                                        <Form.Item label='OI' name='vproximaoi'
                                                            rules={[{
                                                                    required: true,
                                                                    message: 'Por favor ingrese el valor OI'
                                                            }]}
                                                        >
                                                            <Input placeholder='OI' autoComplete='off'/>
                                                        </Form.Item>
                                                    </Space>
                                                </>
                                        },
                                        { key: 6, label: 'Motilidad', children:
                                                <>
                                                    <Form.Item label='Ducciones' name="ducciones"
                                                        rules={[{
                                                            required: true,
                                                            message: 'Por favor ingrese las ducciones del paciente!',
                                                        }]}
                                                    >
                                                        <Input placeholder='Ducciones' autoComplete='off'/>
                                                    </Form.Item>

                                                    <Form.Item label='Versiones' name="versiones"
                                                        rules={[{
                                                            required: true,
                                                            message: 'Por favor ingrese las versiones del paciente!',
                                                        }]}
                                                    >
                                                        <Input placeholder='Ducciones' autoComplete='off'/>
                                                    </Form.Item>

                                                    <Space>
                                                        <Form.Item label='PPC' name="ppc"
                                                            rules={[{
                                                                required: true,
                                                                message: 'Por favor ingrese el PPC!',
                                                            }]}
                                                        >
                                                            <Input placeholder='PPC' autoComplete='off'/>
                                                        </Form.Item>

                                                        <Form.Item label='CT6m' name="ct6m"
                                                            rules={[{
                                                                required: true,
                                                                message: 'Por favor ingrese el CT6m!',
                                                            }]}
                                                        >
                                                            <Input placeholder='ct6m' autoComplete='off'/>
                                                        </Form.Item>

                                                        <Form.Item label='33cm' name="cm"
                                                            rules={[{
                                                                required: true,
                                                                message: 'Por favor ingrese el 33cm!',
                                                            }]}
                                                        >
                                                            <Input placeholder='33cm' autoComplete='off'/>
                                                        </Form.Item>
                                                    </Space>

                                                    <Space>
                                                        <Form.Item label='Ojo dominante' name="ojodominante"
                                                            rules={[{
                                                                required: true,
                                                                message: 'Por favor seleccione el ojo dominante!',
                                                            }]}
                                                        >
                                                            <Select size={'large'} defaultValue="Seleccione el ojo dominante" options={selectOjoDominante} />
                                                        </Form.Item>

                                                        <Form.Item label='Mano dominante' name="manodominante"
                                                            rules={[{
                                                                required: true,
                                                                message: 'Por favor seleccione la mano dominante!',
                                                            }]}
                                                        >
                                                            <Select size={'large'} defaultValue="Seleccione la mano dominante" options={selectManoDominante} />
                                                        </Form.Item>
                                                    </Space>
                                                </>
                                        },
                                        { key: 7, label: 'Oftalmoscopia', children:
                                                <>
                                                    <Space>
                                                        <Form.Item label='OD' name="oftalmoscopiaod"
                                                            rules={[{
                                                                required: true,
                                                                message: 'Por favor digite el valor del ojo derecho!',
                                                            }]}
                                                        >
                                                            <Input placeholder='OD' autoComplete='off'/>
                                                        </Form.Item>

                                                        <Form.Item label='OI' name="oftalmoscopiaoi"
                                                            rules={[{
                                                                required: true,
                                                                message: 'Por favor digite el valor del ojo izquierdo!',
                                                            }]}
                                                        >
                                                            <Input placeholder='OI' autoComplete='off'/>
                                                        </Form.Item>
                                                    </Space>
                                                </>
                                        },
                                        { key: 8, label: 'Queratometría', children:
                                                <>
                                                    <Space>
                                                        <Form.Item label='OD' name="queratometriaod"
                                                            rules={[{
                                                                required: true,
                                                                message: 'Por favor digite el valor del ojo derecho!',
                                                            }]}
                                                        >
                                                            <Input placeholder='OD' autoComplete='off'/>
                                                        </Form.Item>

                                                        <Form.Item label='OI' name="queratometriaoi"
                                                            rules={[{
                                                                required: true,
                                                                message: 'Por favor digite el valor del ojo izquierdo!',
                                                            }]}
                                                        >
                                                            <Input placeholder='OI' autoComplete='off'/>
                                                        </Form.Item>
                                                    </Space>
                                                </>
                                        },
                                        { key: 9, label: 'Retinoscopia', children:
                                                <>
                                                    <Space>
                                                        <Form.Item label='OD' name="retinoscopiaod"
                                                            rules={[{
                                                                required: true,
                                                                message: 'Por favor digite el valor del ojo derecho!',
                                                            }]}
                                                        >
                                                            <Input placeholder='OD' autoComplete='off'/>
                                                        </Form.Item>

                                                        <Form.Item label='OI' name="retinoscopiaoi"
                                                            rules={[{
                                                                required: true,
                                                                message: 'Por favor digite el valor del ojo izquierdo!',
                                                            }]}
                                                        >
                                                            <Input placeholder='OI' autoComplete='off'/>
                                                        </Form.Item>
                                                    </Space>
                                                </>
                                        },
                                        { key: 10, label: 'Rx Final', children:
                                                <>
                                                    <Space>
                                                        <Form.Item label='OD'name="rxfinalod"
                                                            rules={[{
                                                                required: true,
                                                                message: 'Por favor digite el valor del ojo derecho!',
                                                            }]}
                                                        >
                                                            <Input placeholder='OD' autoComplete='off'/>
                                                        </Form.Item>

                                                        <Form.Item label='OI' name="rxfinaloi"
                                                            rules={[{
                                                                required: true,
                                                                message: 'Por favor digite el valor del ojo izquierdo!',
                                                            }]}
                                                        >
                                                            <Input placeholder='OI' autoComplete='off'/>
                                                        </Form.Item>

                                                        <Form.Item label='AVL' name="avl"
                                                            rules={[{
                                                                required: true,
                                                                message: 'Por favor digite el valor de AVL!',
                                                            }]}
                                                        >
                                                            <Input placeholder='AVL' autoComplete='off'/>
                                                        </Form.Item>

                                                        <Form.Item label='AVP' name="avp"
                                                            rules={[{
                                                                required: true,
                                                                message: 'Por favor digite el valor de AVP!',
                                                            }]}
                                                        >
                                                            <Input placeholder='AVP' autoComplete='off'/>
                                                        </Form.Item>
                                                    </Space>

                                                    <Space>
                                                        <Form.Item label='Color' name="color"
                                                            rules={[{
                                                                required: true,
                                                                message: 'Por favor digite el color!',
                                                            }]}
                                                        >
                                                            <Input placeholder='Color' autoComplete='off'/>
                                                        </Form.Item>

                                                        <Form.Item label='ADD+' name="rxfinaladd"
                                                            rules={[{
                                                                required: true,
                                                                message: 'Por favor digite el valor de ADD+!',
                                                            }]}
                                                        >
                                                            <Input placeholder='ADD+' autoComplete='off'/>
                                                        </Form.Item>

                                                        <Form.Item label='BIF' name="bif"
                                                            rules={[{
                                                                required: true,
                                                                message: 'Por favor digite el valor de BIF!',
                                                            }]}
                                                        >
                                                            <Input placeholder='BIF' autoComplete='off'/>
                                                        </Form.Item>
                                                    </Space>

                                                    <Form.Item label='Uso' name="uso"
                                                        rules={[{
                                                            required: true,
                                                            message: 'Por favor digite el uso.',
                                                        }]}
                                                    >
                                                        <Input placeholder='Uso' autoComplete='off'/>
                                                    </Form.Item>

                                                    <Form.Item label='Diagnostico' name="diagnostico"
                                                        rules={[{
                                                            required: true,
                                                            message: 'Por favor digite el diagnostico.',
                                                        }]}
                                                    >
                                                        <Input placeholder='Diagnostico' autoComplete='off'/>
                                                    </Form.Item>

                                                    <Form.Item label='Conducta' name="conducta"
                                                        rules={[{
                                                            required: true,
                                                            message: 'Por favor digite la conducta.',
                                                        }]}
                                                    >
                                                        <Input placeholder='conducta' autoComplete='off'/>
                                                    </Form.Item>

                                                    <Form.Item
                                                        label='Examinador'
                                                    >
                                                        <Typography><pre>{optometrist}</pre></Typography>
                                                    </Form.Item>

                                                    <Form.Item label='Observaciones' name='observaciones'>
                                                        <Input placeholder='Observaciones' autoComplete='off'/>
                                                    </Form.Item>

                                                    <Form.Item label='Control' name='control'
                                                        rules={[{
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

                                <Form.Item shouldUpdate wrapperCol={{ offset: 5, span: 16 }} >
                                    <Button type="primary" htmlType="submit" className="login-form-button" disabled={!isMedicalRecordFormComplete} >
                                        CONFIRMAR REGISTRO
                                    </Button>
                                </Form.Item>
                            </Form>
                        </div>
                    }

                    {activeTab === 3 &&
                        <div className='tab-content3'>
                            <h2>Nombre del paciente: {patient?.usuario.nombre} {patient?.usuario.apellido}</h2>
                            <div className='table-rx'>
                                <div className='right-eye'>
                                    <h2>Ojo derecho</h2>
                                    <div className='table-line'>
                                        <p>RX final lejos</p><p>{medicalRecord?.rxfinalod}</p>
                                    </div>
                                    <div className='table-line'>
                                        <p>Agudeza visual lejos</p><p>{medicalRecord?.avl}</p>
                                    </div>
                                    <div className='table-line'>
                                        <p>RX final cerca</p><p>{medicalRecord?.rxfinalod} + {medicalRecord?.rxfinaladd}</p>
                                    </div>
                                    <div className='table-line'>
                                        <p>Agudeza visual cerca</p><p>{medicalRecord?.avp}</p>
                                    </div>
                                    <div className='table-line'>
                                        <p>ADD</p><p>{medicalRecord?.rxfinaladd}</p>
                                    </div>
                                </div>
                                <div className='left-eye'>
                                    <h2>Ojo izquierdo</h2>
                                    <div className='table-line'>
                                        <p>RX final lejos</p><p>{medicalRecord?.rxfinaloi}</p>
                                    </div>
                                    <div className='table-line'>
                                        <p>Agudeza visual lejos</p><p>{medicalRecord?.avl}</p>
                                    </div>
                                    <div className='table-line'>
                                        <p>RX final cerca</p><p>{medicalRecord?.rxfinaloi} + {medicalRecord?.rxfinaladd}</p>
                                    </div>
                                    <div className='table-line'>
                                        <p>Agudeza visual cerca</p><p>{medicalRecord?.avp}</p>
                                    </div>
                                    <div className='table-line'>
                                        <p>ADD</p><p>{medicalRecord?.rxfinaladd}</p>
                                    </div>
                                </div>
                            </div>
                            <div className='additional-info'>
                                <h2>Información adicional de la fórmula</h2>
                                <div className='table-line'>
                                    <div className='table-line'>
                                        <p>Uso</p><p>{medicalRecord?.uso}</p>
                                    </div>
                                    <div className='table-line'>
                                        <p>Bifocal</p><p>{medicalRecord?.bif}</p>
                                    </div>
                                </div>
                                <div className='table-line'>
                                    <p>Control</p><p>{medicalRecord?.control}</p>
                                </div>
                                <div className='table-line'>
                                    <p>Diagnóstico</p><p>{medicalRecord?.diagnostico}</p>
                                </div>
                                <div className='table-line'>
                                    <p>Observaciones fórmula</p><p>{medicalRecord?.observaciones}</p>
                                </div>
                            </div>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" disabled={!medicalRecord} onClick={endConsultation}>
                                    <span>TERMINAR CONSULTA</span>
                                </Button>
                            </Form.Item>
                        </div>
                    }
                </div>
            }
            {!patient &&
                <div className='appointment-table'>
                    <Table columns={columns} dataSource={
                            filteredData.map(appointment => ({
                                ...appointment,
                                key: appointment.idcita
                            }))
                        } scroll={{y: 600}} pagination={false} />
                </div>
            }
        </div>
    );
}