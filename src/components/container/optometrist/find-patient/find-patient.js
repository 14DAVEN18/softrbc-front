import { useRef, useState, useEffect } from 'react';
import { Button, Form, Input, Modal, Space, Table, Typography } from 'antd';
import { UserOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

import './find-patient.css';
import { getAllMedicalRecordsById } from '../../../../services/medicalRecordService';
import FeedbackMessage from '../../common/feedback-message/feedback-message';


const layout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 10,
    },
};

export default function FindPatient() {

    const ref = useRef(null);
    const [height, setHeight] = useState(0);
    const [width, setWidth] = useState(0);
    const [patient, setPatient] = useState({})
    const [medicalRecords, setMedicalRecords] = useState([])
    const [activeTab, setActiveTab] = useState(1);
    const [isMedicalRecordModalOpen, setIsMedicalRecordModalOpen] = useState(false)
    const [currentMedicalRecord, setCurrentMedicalRecord] = useState(null)
    const [latestRx, setLatestRx] = useState(null)
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({
        visible: false,
        type: '',
        text: ''
    })
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
        if(!localStorage.getItem('token')) {
            navigate("/inicio-empleados")
        }
    }, [navigate])


    useEffect(() => {
        if (medicalRecords.length > 0) {
            // Get the most recent record (first item in sorted array)
            const mostRecentRecord = medicalRecords[0];

            // Extract required data from the most recent record
            const extractedData = {
                rxfinalod: mostRecentRecord.rxFinal?.od || '',
                rxfinaloi: mostRecentRecord.rxFinal?.oi || '',
                avl: mostRecentRecord.rxFinal?.avl || '',
                avp: mostRecentRecord.rxFinal?.avp || '',
                rxfinaladd: mostRecentRecord.rxFinal?.addicion || '',
                uso: mostRecentRecord?.rxFinal.uso || '',
                bif: mostRecentRecord?.rxFinal.bif || '',
                control: mostRecentRecord?.rxFinal.control || '',
                diagnostico: mostRecentRecord?.rxFinal.diagnostico || '',
                observaciones: mostRecentRecord?.rxFinal.observaciones || '',
            };

            // Update latestRx state with extracted data
            setLatestRx(extractedData);
        }
    }, [medicalRecords, patient]);



    
    const [searchForm] = Form.useForm();
    const searchPatient = async () => {
        try {
            const value = await searchForm.validateFields();
            const response = await getAllMedicalRecordsById(value.cedula)
            
            // Initialize an empty array to store the grouped data
            const data = [];

            // Get the keys (properties) from historiaClinicaDTOS
            const keys = Object.keys(response.data.historiaClinicaDTOS);

            // Extract unique ids and their corresponding id keys from all arrays
            const idMap = {};

            keys.forEach(key => {
                response.data.historiaClinicaDTOS[key].forEach(entry => {
                    const idKey = Object.keys(entry).find(k => k.toLowerCase().startsWith('id'));
                    const idValue = entry[idKey];

                    if (!idMap[idValue]) {
                        idMap[idValue] = {};
                    }

                    idMap[idValue][key] = entry;
                });
            });

            // Convert idMap to data array
            Object.values(idMap).forEach(groupedObject => {
                data.push(groupedObject);
            });

            // Sort data by date (assuming 'fecha' is the date property)
            data.sort((a, b) => {
                const dateA = new Date(a.anamnesis.fecha);
                const dateB = new Date(b.anamnesis.fecha);
                return dateB - dateA; // Sort descending for most recent first
            });
            const {pacienteDTO, usuario} = response.data

            setMedicalRecords(data)
            setPatient({pacienteDTO, usuario})

            if (response.status === 200) {
                showMessage(
                    'success',
                    `Los datos del paciente fueron cargados correctamente.`
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
                    navigate('/cliente/preguntas')
                }, 5000)
            } else {
                showMessage(
                    'error',
                    `Ocurrió un error al cargar los datos del paciente solicitado.`
                )
            }
        } finally {
            setLoading(false);
        }
    }





    // TO DEFINE TABLES FOR COLUMNS
    const columns = [
        {
            title: 'Fecha',
            key: 'fecha',
            render: (_, record) => (
                record.anamnesis.fecha.slice(0, 10)
            )
        },
        {
            title: 'Examinador',
            key: 'nombre',
            render: (_, record) => (
                record.rxFinal.examinador
            )
        },
        {
            title: 'Acciones',
            key: 'action',
            render: (_, record) => (
            <Space size="middle">
                <Button type="primary" onClick={() => viewMedicalRecord(record)} htmlType='submit'>
                    Ver
                </Button>
            </Space>
            ),
        },
    ];






    // TO SHOW A MEDICAL RECORD
    const viewMedicalRecord = (medicalRecord) => {
        setCurrentMedicalRecord(medicalRecord)
        setIsMedicalRecordModalOpen(true)
    }







    // TO CLOSE THE CURRENT MEDICAL RECORD
    const accept = () => {
        setIsMedicalRecordModalOpen(false)
        setCurrentMedicalRecord(null)
    }




    return (
        <div className='find-patient' ref={ref}>
            <FeedbackMessage visible={message?.visible} type={message?.type} text={message?.text} onClose={() => hideMessage()}>
            </FeedbackMessage>
            <div className='search-form'>
                <Form name="search" layout="inline" form={searchForm} >
                    <Form.Item name="cedula">
                        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Documento de identidad"/>
                    </Form.Item>
                    <Button type="primary" shape="circle" icon={<SearchOutlined />} onClick={searchPatient} loading={loading}/>
                </Form>
            </div>

            <div className='patient-info'>
                <div className='tab-header'>
                    <div className={`tab ${activeTab === 1 ? 'active' : ''}`} onClick={() => setActiveTab(1)}>Datos Personales</div>
                    <div className={`tab ${activeTab === 2 ? 'active' : ''}`} onClick={() => setActiveTab(2)}>Historía clínica</div>
                    <div className={`tab ${activeTab === 3 ? 'active' : ''}`} onClick={() => setActiveTab(3)}>Formula Clínica</div>
                </div>
                
                {(activeTab === 1 || activeTab === 2 || activeTab === 3) && !(patient.usuario) &&
                    <div className='tab-content'>
                        <h1>No ha buscado pacientes</h1>
                    </div>
                }




                {activeTab === 1 && patient.usuario &&
                    <div className='tab-content'>
                        <Form {...layout} className='creation-form' initialValues={{ remember: false }} name="patientUpdate" >                                 
                            <Form.Item label='Nombres' name="nombre" >
                                <Typography><pre>{patient?.usuario.nombre}</pre></Typography>
                            </Form.Item>
                                
                            <Form.Item label='Apellidos' name="apellido" >
                                <Typography><pre>{patient?.usuario.apellido}</pre></Typography>
                            </Form.Item>

                            <Form.Item label='Correo electrónico' name="correo" >
                                <Typography><pre>{patient?.usuario.correo}</pre></Typography>
                            </Form.Item>
                            
                            <Form.Item label='Dirección' name="direccion" >
                                <Typography><pre>{patient?.usuario.direccion}</pre></Typography>
                            </Form.Item>

                            <Form.Item label='Número telefónico' name="telefono" >
                                <Typography><pre>{patient?.usuario.telefono}</pre></Typography>
                            </Form.Item>

                            <Form.Item label='Documento de identidad' name="cedula" >
                                <Typography><pre>{patient?.usuario.cedula}</pre></Typography>
                            </Form.Item>
            
                            <Form.Item label='Ocupación' name="ocupacion" >
                                <Typography><pre>{patient?.pacienteDTO.ocupacion}</pre></Typography>
                            </Form.Item>

                            <Form.Item label='Fecha de nacimiento' name="fechanacimiento" >
                                <Typography><pre>{patient?.pacienteDTO.fechanacimiento}</pre></Typography>
                            </Form.Item>

                            <Form.Item label='Género' name="genero" >
                                <Typography><pre>{patient?.pacienteDTO.genero}</pre></Typography>
                            </Form.Item>
                        </Form>
                    </div>
                }





                {activeTab === 2 && !!patient &&
                    <div className='tab-content-view'>
                        {medicalRecords.length > 0 ? (
                            <div className='appointment-table'>
                                <Table
                                    columns={columns} 
                                    dataSource={ medicalRecords.map(record => ({...record, key: record.id})) }
                                />
                            </div>
                        ) : (
                            <div className='no-records-message'>
                                <Typography.Text type="secondary">No se encontraron registros médicos.</Typography.Text>
                            </div>
                        )}
                        <Modal title="Historía clínica" open={isMedicalRecordModalOpen} onCancel={accept} width={'60%'} footer=
                            {
                                <Button key="action" type="primary" onClick={accept}>
                                    Aceptar
                                </Button>
                            }
                        >
                            <div className='modal-content'>
                                <Form {...layout} className='medical-record-view-form' initialValues={{ remember: false }} name="medicalRecord">
                                    <h2>Anamnesis</h2>
                                    <Form.Item label='Anamnesis' name="anamnesis" >
                                        <Typography><pre>{currentMedicalRecord?.anamnesis.anamnesis}</pre></Typography>
                                    </Form.Item>

                                    <h2>Antecedentes</h2>
                                    <Form.Item label='Antecedentes familiares' name="antecedentesFamiliares" >
                                        <Typography><pre>{currentMedicalRecord?.antecedentes.familiares}</pre></Typography>
                                    </Form.Item>

                                    <Form.Item label='Antecedentes oculares' name="antecedentesOculares" >
                                        <Typography><pre>{currentMedicalRecord?.antecedentes.oculares}</pre></Typography>
                                    </Form.Item>

                                    <Form.Item label='Antecedentes generales' name="antecedentesGenerales">
                                        <Typography><pre>{currentMedicalRecord?.antecedentes.generales}</pre></Typography>
                                    </Form.Item>

                                    <h2>RX en uso</h2>
                                    <Form.Item label='OD' name='rxusood' >
                                        <Typography><pre>{currentMedicalRecord?.rxUso.od}</pre></Typography>
                                    </Form.Item>

                                    <Form.Item label='OI' name='rxusooi' >
                                        <Typography><pre>{currentMedicalRecord?.rxUso.oi}</pre></Typography>
                                    </Form.Item>

                                    <Form.Item label='ADD+' name='rxusoadd' >
                                        <Typography><pre>{currentMedicalRecord?.rxUso.addicion}</pre></Typography>
                                    </Form.Item>

                                    <h2>Visión lejana</h2>
                                    <h3>Con RX</h3>
                                    <div>
                                        <Form.Item label='OD' name='vlejanarxod' >
                                            <Typography><pre>{currentMedicalRecord?.visionLejana.ojoDRX}</pre></Typography>
                                        </Form.Item>

                                        <Form.Item label='OI' name='vlejanarxoi' >
                                            <Typography><pre>{currentMedicalRecord?.visionLejana.ojoIRX}</pre></Typography>
                                        </Form.Item>
                                    </div>

                                    <h3>Sin RX</h3>
                                    <div>
                                        <Form.Item label='OD' name='vlejanaod' >
                                            <Typography><pre>{currentMedicalRecord?.visionLejana.od}</pre></Typography>
                                        </Form.Item>

                                        <Form.Item label='OI' name='vlejanaoi'>
                                            <Typography><pre>{currentMedicalRecord?.visionLejana.oi}</pre></Typography>
                                        </Form.Item>
                                    </div>
                                    
                                    
                                    <h2>Visión Próxima</h2>
                                    <h3>Con RX</h3>
                                    <div>
                                        <Form.Item label='OD' name='vproximarxod' >
                                            <Typography><pre>{currentMedicalRecord?.visionProxima.ojodrx}</pre></Typography>
                                        </Form.Item>

                                        <Form.Item label='OI' name='vproximarxoi' >
                                            <Typography><pre>{currentMedicalRecord?.visionProxima.ojooirx}</pre></Typography>
                                        </Form.Item>
                                    </div>

                                    <h3>Sin RX</h3>
                                    <div>
                                        <Form.Item label='OD' name='vproximaod' >
                                            <Typography><pre>{currentMedicalRecord?.visionProxima.od}</pre></Typography>
                                        </Form.Item>

                                        <Form.Item label='OI' name='vproximaoi' >
                                            <Typography><pre>{currentMedicalRecord?.visionProxima.oi}</pre></Typography>
                                        </Form.Item>
                                    </div>

                                    <Form.Item label='Distancia pupilar' name="distanciapupilar" >
                                        <Typography><pre>{currentMedicalRecord?.visionLejana.distanciapupilar}</pre></Typography>
                                    </Form.Item>

                                    <Form.Item label='Examen externo' name="externo">
                                        <Typography><pre>{currentMedicalRecord?.visionLejana.examenexterno}</pre></Typography>
                                    </Form.Item>

                                    <h2>Motilidad</h2>
                                    <Form.Item label='Ducciones' name="ducciones" >
                                        <Typography><pre>{currentMedicalRecord?.motilidad.ducciones}</pre></Typography>
                                    </Form.Item>

                                    <Form.Item label='Versiones' name="versiones" >
                                        <Typography><pre>{currentMedicalRecord?.motilidad.versiones}</pre></Typography>
                                    </Form.Item>

                                    <div>
                                        <Form.Item label='PPC' name="ppc" >
                                            <Typography><pre>{currentMedicalRecord?.motilidad.ppc}</pre></Typography>
                                        </Form.Item>

                                        <Form.Item label='CT6m' name="ct6m" >
                                            <Typography><pre>{currentMedicalRecord?.motilidad.ct6m}</pre></Typography>
                                        </Form.Item>

                                        <Form.Item label='33cm' name="cm">
                                            <Typography><pre>{currentMedicalRecord?.motilidad.cms}</pre></Typography>
                                        </Form.Item>
                                    </div>

                                    <div>
                                        <Form.Item label='Ojo dominante' name="ojodominante" >
                                            <Typography><pre>{currentMedicalRecord?.motilidad.ojodominante}</pre></Typography>
                                        </Form.Item>

                                        <Form.Item label='Mano dominante' name="manodominante" >
                                            <Typography><pre>{currentMedicalRecord?.motilidad.manodominante}</pre></Typography>
                                        </Form.Item>
                                    </div>

                                    <h2>Oftalmoscopia</h2>
                                    <div>
                                        <Form.Item label='OD' name="oftalmoscopiaod" >
                                            <Typography><pre>{currentMedicalRecord?.oftalmoscopia.od}</pre></Typography>
                                        </Form.Item>

                                        <Form.Item label='OI' name="oftalmoscopiaoi" >
                                            <Typography><pre>{currentMedicalRecord?.oftalmoscopia.oi}</pre></Typography>
                                        </Form.Item>
                                    </div>

                                    <h2>Queratometria</h2>
                                    <div>
                                        <Form.Item label='OD' name="queratometriaod" >
                                            <Typography><pre>{currentMedicalRecord?.queratometria.od}</pre></Typography>
                                        </Form.Item>

                                        <Form.Item label='OI' name="queratometriaoi" >
                                            <Typography><pre>{currentMedicalRecord?.queratometria.oi}</pre></Typography>
                                        </Form.Item>
                                    </div>

                                    <h2>Retinoscopia</h2>
                                    <div>
                                        <Form.Item label='OD' name="retinoscopiaod">
                                            <Typography><pre>{currentMedicalRecord?.retinoscopia.od}</pre></Typography>
                                        </Form.Item>

                                        <Form.Item label='OI' name="retinoscopiaoi">
                                            <Typography><pre>{currentMedicalRecord?.retinoscopia.oi}</pre></Typography>
                                        </Form.Item>
                                    </div>

                                    <h2>RX Final</h2>
                                    <div>
                                        <Form.Item label='OD'name="rxfinalod">
                                            <Typography><pre>{currentMedicalRecord?.rxFinal.od}</pre></Typography>
                                        </Form.Item>

                                        <Form.Item label='OI' name="rxfinaloi">
                                            <Typography><pre>{currentMedicalRecord?.rxFinal.oi}</pre></Typography>
                                        </Form.Item>

                                        <Form.Item label='AVL' name="avl">
                                            <Typography><pre>{currentMedicalRecord?.rxFinal.avl}</pre></Typography>
                                        </Form.Item>

                                        <Form.Item label='AVP' name="avp">
                                            <Typography><pre>{currentMedicalRecord?.rxFinal.avp}</pre></Typography>
                                        </Form.Item>
                                    </div>

                                    <div>
                                        <Form.Item label='Color' name="color" >
                                            <Typography><pre>{currentMedicalRecord?.rxFinal.color}</pre></Typography>
                                        </Form.Item>

                                        <Form.Item label='ADD+' name="rxfinaladd" >
                                            <Typography><pre>{currentMedicalRecord?.rxFinal.addicion}</pre></Typography>
                                        </Form.Item>

                                        <Form.Item label='BIF' name="bif" >
                                            <Typography><pre>{currentMedicalRecord?.rxFinal.bif}</pre></Typography>
                                        </Form.Item>
                                    </div>

                                    <Form.Item label='Uso' name="uso" >
                                        <Typography><pre>{currentMedicalRecord?.rxFinal.uso}</pre></Typography>
                                    </Form.Item>

                                    <Form.Item label='Diagnostico' name="diagnostico">
                                        <Typography><pre>{currentMedicalRecord?.rxFinal.diagnostico}</pre></Typography>
                                    </Form.Item>

                                    <Form.Item label='Conducta' name="conducta" >
                                        <Typography><pre>{currentMedicalRecord?.rxFinal.conducta}</pre></Typography>
                                    </Form.Item>

                                    <Form.Item label='Examinador' >
                                        <Typography><pre>{currentMedicalRecord?.rxFinal.examinador}</pre></Typography>
                                    </Form.Item>

                                    <Form.Item label='Observaciones' name='observaciones'>
                                        <Typography><pre>{currentMedicalRecord?.rxFinal.observaciones}</pre></Typography>
                                    </Form.Item>

                                    <Form.Item label='Control' name='control' >
                                        <Typography><pre>{currentMedicalRecord?.rxFinal.control}</pre></Typography>
                                    </Form.Item>
                                </Form>
                            </div>
                        </Modal>
                    </div>
                }

                {activeTab === 3 && !!patient &&
                    <div className='tab-content3'>
                        <h2>Nombre del paciente: {patient?.usuario.nombre} {patient?.usuario.apellido}</h2>
                        <div className='table-rx'>
                            <div className='right-eye'>
                                <h2>Ojo derecho</h2>
                                <div className='table-line'>
                                    <p>RX final lejos</p><p>{latestRx?.rxfinalod}</p>
                                </div>
                                <div className='table-line'>
                                    <p>Agudeza visual lejos</p><p>{latestRx?.avl}</p>
                                </div>
                                <div className='table-line'>
                                    <p>RX final cerca</p><p>{latestRx?.rxfinalod} + {latestRx?.rxfinaladd}</p>
                                </div>
                                <div className='table-line'>
                                    <p>Agudeza visual cerca</p><p>{latestRx?.avp}</p>
                                </div>
                                <div className='table-line'>
                                    <p>ADD</p><p>{latestRx?.rxfinaladd}</p>
                                </div>
                            </div>
                            <div className='left-eye'>
                                <h2>Ojo izquierdo</h2>
                                <div className='table-line'>
                                    <p>RX final lejos</p><p>{latestRx?.rxfinaloi}</p>
                                </div>
                                <div className='table-line'>
                                    <p>Agudeza visual lejos</p><p>{latestRx?.avl}</p>
                                </div>
                                <div className='table-line'>
                                    <p>RX final cerca</p><p>{latestRx?.rxfinaloi} + {latestRx?.rxfinaladd}</p>
                                </div>
                                <div className='table-line'>
                                    <p>Agudeza visual cerca</p><p>{latestRx?.avp}</p>
                                </div>
                                <div className='table-line'>
                                    <p>ADD</p><p>{latestRx?.rxfinaladd}</p>
                                </div>
                            </div>
                        </div>
                        <div className='additional-info'>
                            <h2>Información adicional de la fórmula</h2>
                            <div className='table-line'>
                                <div className='table-line'>
                                    <p>Uso</p><p>{latestRx?.uso}</p>
                                </div>
                                <div className='table-line'>
                                    <p>Bifocal</p><p>{latestRx?.bif}</p>
                                </div>
                            </div>
                            <div className='table-line'>
                                <p>Control</p><p>{latestRx?.control}</p>
                            </div>
                            <div className='table-line'>
                                <p>Diagnóstico</p><p>{latestRx?.diagnostico}</p>
                            </div>
                            <div className='table-line'>
                                <p>Observaciones fórmula</p><p>{latestRx?.observaciones}</p>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </div>
    );
}