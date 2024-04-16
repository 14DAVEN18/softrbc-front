import { useRef, useState } from 'react';
import { Button, Form, Input, Modal, Space, Table, Typography } from 'antd';
import { UserOutlined, SearchOutlined } from '@ant-design/icons';

import './find-patient.css';
import { getAllMedicalRecordsById } from '../../../../services/medicalRecordService';
import { recordHistorias } from './records';


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
    const [patient, setPatient] = useState(null)
    const [medicalRecords, setMedicalRecords] = useState([])
    const [activeTab, setActiveTab] = useState(1);
    const [isMedicalRecordModalOpen, setIsMedicalRecordModalOpen] = useState(false)
    const [currentMedicalRecord, setCurrentMedicalRecord] = useState(null)
    const [loading, setLoading] = useState(false);

    
    const [searchForm] = Form.useForm();
    const searchPatient = async () => {
        try {
            const value = await searchForm.validateFields();
            //const response = await getAllMedicalRecordsById(value.cedula);
            console.log(recordHistorias)
            
            // Initialize an empty array to store the grouped data
            const data = [];

            // Get the keys (properties) from historiaClinicaDTOS
            const keys = Object.keys(recordHistorias.historiaClinicaDTOS);

            // Extract unique ids and their corresponding id keys from all arrays
            const idMap = {};

            keys.forEach(key => {
                recordHistorias.historiaClinicaDTOS[key].forEach(entry => {
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

            console.log(data);
            setMedicalRecords(data)
            setPatient(recordHistorias.pacienteDTO)
        } catch (error) {
            console.error('Error en la solicitud:', error);
        } finally {
            setLoading(false);
        }
        console.log(patient)
    }





    // TO DEFINE TABLES FOR COLUMNS
    const columns = [
        {
            title: 'Fecha',
            key: 'fecha',
            render: (_, record) => (
                record.anamnesis.fecha
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
        console.log("medicalRecord: ", medicalRecord)
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
            <div className='search-form'>
                <Form name="search" layout="inline" form={searchForm} >
                    <Form.Item name="cedula">
                        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Documento de identidad"/>
                    </Form.Item>
                    <Button type="primary" shape="circle" icon={<SearchOutlined />} onClick={searchPatient}/>
                </Form>
            </div>

            <div className='patient-info'>
                <div className='tab-header'>
                    <div className={`tab ${activeTab === 1 ? 'active' : ''}`} onClick={() => setActiveTab(1)}>Datos Personales</div>
                    <div className={`tab ${activeTab === 2 ? 'active' : ''}`} onClick={() => setActiveTab(2)}>Historía clínica</div>
                    <div className={`tab ${activeTab === 3 ? 'active' : ''}`} onClick={() => setActiveTab(3)}>Formula Clínica</div>
                </div>
                
                {(activeTab === 1 || activeTab === 2 || activeTab === 3) && !(!!patient) &&
                    <div className='tab-content'>
                        <h1>No ha buscado pacientes</h1>
                    </div>
                }




                {activeTab === 1 && !!patient &&
                    <div className='tab-content'>
                        <Form {...layout} className='creation-form' initialValues={{ remember: false }} name="patientUpdate" >                                 
                            <Form.Item label='Nombres' name="nombre" >
                                <Typography><pre>{patient?.nombre}</pre></Typography>
                            </Form.Item>
                                
                            <Form.Item label='Apellidos' name="apellido" >
                                <Typography><pre>{patient?.apellido}</pre></Typography>
                            </Form.Item>

                            <Form.Item label='Correo electrónico' name="correo" >
                                <Typography><pre>{patient?.correo}</pre></Typography>
                            </Form.Item>
                            
                            <Form.Item label='Dirección' name="direccion" >
                                <Typography><pre>{patient?.direccion}</pre></Typography>
                            </Form.Item>

                            <Form.Item label='Número telefónico' name="telefono" >
                                <Typography><pre>{patient?.telefono}</pre></Typography>
                            </Form.Item>

                            <Form.Item label='Documento de identidad' name="cedula" >
                                <Typography><pre>{patient?.cedula}</pre></Typography>
                            </Form.Item>
            
                            <Form.Item label='Ocupación' name="ocupacion" >
                                <Typography><pre>{patient?.ocupacion}</pre></Typography>
                            </Form.Item>

                            <Form.Item label='Fecha de nacimiento' name="fechanacimiento" >
                                <Typography><pre>{patient?.fechanacimiento}</pre></Typography>
                            </Form.Item>

                            <Form.Item label='Género' name="genero" >
                                <Typography><pre>{patient?.genero}</pre></Typography>
                            </Form.Item>
                        </Form>
                    </div>
                }





                {activeTab === 2 && !!patient &&
                    <div className='tab-content2'>
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
                        <Modal title="Historía clínica" centered open={isMedicalRecordModalOpen} onCancel={accept} width={'90%'} footer=
                            {<>
                                <Button key="action" type="primary" onClick={accept}>
                                    Aceptar
                                </Button>
                            </>}
                        >
                            <Form {...layout} className='medical-record-form' initialValues={{ remember: false }} name="medicalRecord" >
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

                                <h2>retinoscopia</h2>
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
                                    <p>RX final lejos</p><p>{medicalRecords?.rxfinalod}</p>
                                </div>
                                <div className='table-line'>
                                    <p>Agudeza visual lejos</p><p>{medicalRecords?.avl}</p>
                                </div>
                                <div className='table-line'>
                                    <p>RX final cerca</p><p>{medicalRecords?.rxfinalod} + {medicalRecords?.rxfinaladd}</p>
                                </div>
                                <div className='table-line'>
                                    <p>Agudeza visual cerca</p><p>{medicalRecords?.avp}</p>
                                </div>
                                <div className='table-line'>
                                    <p>ADD</p><p>{medicalRecords?.rxfinaladd}</p>
                                </div>
                                <div className='table-line'>
                                    <p>DNP</p><p>?</p>
                                </div>
                            </div>
                            <div className='left-eye'>
                                <h2>Ojo izquierdo</h2>
                                <div className='table-line'>
                                    <p>RX final lejos</p><p>{medicalRecords?.rxfinaloi}</p>
                                </div>
                                <div className='table-line'>
                                    <p>Agudeza visual lejos</p><p>{medicalRecords?.avl}</p>
                                </div>
                                <div className='table-line'>
                                    <p>RX final cerca</p><p>{medicalRecords?.rxfinaloi} + {medicalRecords?.rxfinaladd}</p>
                                </div>
                                <div className='table-line'>
                                    <p>Agudeza visual cerca</p><p>{medicalRecords?.avp}</p>
                                </div>
                                <div className='table-line'>
                                    <p>ADD</p><p>{medicalRecords?.rxfinaladd}</p>
                                </div>
                                <div className='table-line'>
                                    <p>DNP</p><p>?</p>
                                </div>
                            </div>
                        </div>
                        <div className='additional-info'>
                            <h2>Información adicional de la fórmula</h2>
                            <div className='table-line'>
                                <div className='table-line'>
                                    <p>Uso</p><p>{medicalRecords?.uso}</p>
                                </div>
                                <div className='table-line'>
                                    <p>Bifocal</p><p>{medicalRecords?.bif}</p>
                                </div>
                            </div>
                            <div className='table-line'>
                                <p>Control</p><p>{medicalRecords?.control}</p>
                            </div>
                            <div className='table-line'>
                                <p>Diagnóstico</p><p>{medicalRecords?.diagnostico}</p>
                            </div>
                            <div className='table-line'>
                                <p>Observaciones fórmula</p><p>{medicalRecords?.observaciones}</p>
                            </div>
                        </div>
                        <Button type="primary" htmlType="submit" className="login-form-button appointment-end" disabled={!medicalRecords}>
                            <span>TERMINAR CONSULTA</span>
                        </Button>
                    </div>
                }
            </div>
        </div>
    );
}