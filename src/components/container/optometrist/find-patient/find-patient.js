import { useEffect, useRef, useState } from 'react';
import { Button, Collapse, DatePicker, Form, Input, InputNumber, Modal, Progress, Select, Space, Table, Typography } from 'antd';
import { UserOutlined, SearchOutlined } from '@ant-design/icons';
import { format } from 'date-fns';
import dayjs from "dayjs";

import './find-patient.css';
import { getPatientById } from '../../../../services/patientService';
import { getAllMedicalRecordsById } from '../../../../services/medicalRecordService';



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
    const [medicalRecords, setmedicalRecords] = useState([])
    const [activeTab, setActiveTab] = useState(1);
    const [isMedicalRecordModalOpen, setIsMedicalRecordModalOpen] = useState(false)
    const [currentMedicalRecord, setCurrentMedicalRecord] = useState(null)

    
    
    const searchPatient = async () => {
        try {
            const response = await getAllMedicalRecordsById(idpaciente); 
            setPatient(response)
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
                record.fecha
            )
        },
        {
            title: 'Examinador',
            key: 'nombre',
            render: (_, record) => (
                record.examinador
            )
        },
        {
            title: 'Acciones',
            key: 'action',
            render: (_, record) => (
            <Space size="middle">
                <Button type="primary" onClick={() => viewMedicalRecord(record.idhistoriaclinica)} htmlType='submit'>
                    Ver
                </Button>
            </Space>
            ),
        },
    ];






    // TO SHOW A MEDICAL RECORD
    const viewMedicalRecord = (fecha) => {
        const filteredMedicalRecords = Array.isArray(medicalRecords)
            ? medicalRecords.filter(medicaRecord =>
                medicaRecord.fecha === fecha
                )
            : [];
        setCurrentMedicalRecord(filteredMedicalRecords)
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
                <Form name="search" layout="inline" onFinish={searchPatient}>
                    <Form.Item name="search-input">
                        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Documento de identidad"/>
                    </Form.Item>
                    <Button type="primary" shape="circle" icon={<SearchOutlined />} />
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
                                <Typography><pre>{currentPatient?.nombre}</pre></Typography>
                            </Form.Item>
                                
                            <Form.Item label='Apellidos' name="apellido" >
                                <Typography><pre>{currentPatient?.apellido}</pre></Typography>
                            </Form.Item>

                            <Form.Item label='Correo electrónico' name="correo" >
                                <Typography><pre>{currentPatient?.correo}</pre></Typography>
                            </Form.Item>
                            
                            <Form.Item label='Dirección' name="direccion" >
                                <Typography><pre>{currentPatient?.direccion}</pre></Typography>
                            </Form.Item>

                            <Form.Item label='Número telefónico' name="telefono" >
                                <Typography><pre>{currentPatient?.telefono}</pre></Typography>
                            </Form.Item>

                            <Form.Item label='Documento de identidad' name="cedula" >
                                <Typography><pre>{currentPatient?.cedula}</pre></Typography>
                            </Form.Item>
            
                            <Form.Item label='Ocupación' name="ocupacion" >
                                <Typography><pre>{currentPatient?.ocupacion}</pre></Typography>
                            </Form.Item>

                            <Form.Item label='Fecha de nacimiento' name="fechanacimiento" >
                                <Typography><pre>{currentPatient?.fechanacimiento}</pre></Typography>
                            </Form.Item>

                            <Form.Item label='Género' name="genero" >
                                <Typography><pre>{currentPatient?.genero}</pre></Typography>
                            </Form.Item>
                        </Form>
                    </div>
                }





                {activeTab === 2 && !!patient &&
                    <div className='tab-content2'>
                        <div className='appointment-table'>
                            <Table columns={columns} dataSource={medicalRecords} scroll={{y: 600}} pagination={false} />
                        </div>
                        <Modal title="Cancelar dia laboral" centered open={isMedicalRecordFormOpen} onCancel={accept} footer=
                            {<>
                                <Button key="action" type="primary" onClick={accept}>
                                    Aceptar
                                </Button>
                            </>}
                        >
                            <h2>patient</h2>
                            <Form {...layout} className='medical-record-form' initialValues={{ remember: false }} name="medicalRecord" >
                                <Form.Item label='Anamnesis' name="anamnesis" >
                                    <Typography><pre>{currentMedicalRecord?.anamnesis}</pre></Typography>
                                </Form.Item>

                                <Form.Item label='Antecedentes familiares' name="antecedentesFamiliares" >
                                    <Typography><pre>{currentMedicalRecord}</pre></Typography>
                                </Form.Item>

                                <Form.Item label='Antecedentes oculares' name="antecedentesOculares" >
                                    <Typography><pre>{currentMedicalRecord}</pre></Typography>
                                </Form.Item>

                                <Form.Item label='Antecedentes generales' name="antecedentesGenerales">
                                    <Typography><pre>{currentMedicalRecord}</pre></Typography>
                                </Form.Item>

                                <Space>
                                    <Form.Item label='OD' name='rxusood' >
                                        <Typography><pre>{currentMedicalRecord}</pre></Typography>
                                    </Form.Item>

                                    <Form.Item label='OI' name='rxusooi' >
                                        <Typography><pre>{currentMedicalRecord}</pre></Typography>
                                    </Form.Item>

                                    <Form.Item label='ADD+' name='rxusoadd' >
                                        <Typography><pre>{currentMedicalRecord}</pre></Typography>
                                    </Form.Item>
                                </Space>

                                <h3>Con RX</h3>
                                <Space>
                                    <Form.Item label='OD' name='vlejanarxod' >
                                        <Typography><pre>{currentMedicalRecord}</pre></Typography>
                                    </Form.Item>

                                    <Form.Item label='OI' name='vlejanarxoi' >
                                        <Typography><pre>{currentMedicalRecord}</pre></Typography>
                                    </Form.Item>
                                </Space>

                                <h3>Sin RX</h3>
                                <Space>
                                    <Form.Item label='OD' name='vlejanaod' >
                                        <Typography><pre>{currentMedicalRecord}</pre></Typography>
                                    </Form.Item>

                                    <Form.Item label='OI' name='vlejanaoi'>
                                        <Typography><pre>{currentMedicalRecord}</pre></Typography>
                                    </Form.Item>
                                </Space>
                                
                                <Form.Item label='Distancia pupilar' name="distanciapupilar" >
                                    <Typography><pre>{currentMedicalRecord}</pre></Typography>
                                </Form.Item>

                                <Form.Item label='Examen externo' name="externo">
                                    <Typography><pre>{currentMedicalRecord}</pre></Typography>
                                </Form.Item>

                                <h3>Con RX</h3>
                                <Space>
                                    <Form.Item label='OD' name='vproximarxod' >
                                        <Typography><pre>{currentMedicalRecord}</pre></Typography>
                                    </Form.Item>

                                    <Form.Item label='OI' name='vproximarxoi' >
                                        <Typography><pre>{currentMedicalRecord}</pre></Typography>
                                    </Form.Item>
                                </Space>

                                <h3>Sin RX</h3>
                                <Space>
                                    <Form.Item label='OD' name='vproximaod' >
                                        <Typography><pre>{currentMedicalRecord}</pre></Typography>
                                    </Form.Item>

                                    <Form.Item label='OI' name='vproximaoi' >
                                        <Typography><pre>{currentMedicalRecord}</pre></Typography>
                                    </Form.Item>
                                </Space>
                                <Form.Item label='Ducciones' name="ducciones" >
                                    <Typography><pre>{currentMedicalRecord}</pre></Typography>
                                </Form.Item>

                                <Form.Item label='Versiones' name="versiones" >
                                    <Typography><pre>{currentMedicalRecord}</pre></Typography>
                                </Form.Item>

                                <Space>
                                    <Form.Item label='PPC' name="ppc" >
                                        <Typography><pre>{currentMedicalRecord}</pre></Typography>
                                    </Form.Item>

                                    <Form.Item label='CT6m' name="ct6m" >
                                        <Typography><pre>{currentMedicalRecord}</pre></Typography>
                                    </Form.Item>

                                    <Form.Item label='33cm' name="cm">
                                        <Typography><pre>{currentMedicalRecord}</pre></Typography>
                                    </Form.Item>
                                </Space>

                                <Space>
                                    <Form.Item label='Ojo dominante' name="ojodominante" >
                                        <Typography><pre>{currentMedicalRecord}</pre></Typography>
                                    </Form.Item>

                                    <Form.Item label='Mano dominante' name="manodominante" >
                                        <Typography><pre>{currentMedicalRecord}</pre></Typography>
                                    </Form.Item>
                                </Space>

                                <Space>
                                    <Form.Item label='OD' name="oftalmoscopiaod" >
                                        <Typography><pre>{currentMedicalRecord}</pre></Typography>
                                    </Form.Item>

                                    <Form.Item label='OI' name="oftalmoscopiaoi" >
                                        <Typography><pre>{currentMedicalRecord}</pre></Typography>
                                    </Form.Item>
                                </Space>

                                <Space>
                                    <Form.Item label='OD' name="queratometriaod" >
                                        <Typography><pre>{currentMedicalRecord}</pre></Typography>
                                    </Form.Item>

                                    <Form.Item label='OI' name="queratometriaoi" >
                                        <Typography><pre>{currentMedicalRecord}</pre></Typography>
                                    </Form.Item>
                                </Space>

                                <Space>
                                    <Form.Item label='OD' name="retinoscopiaod">
                                        <Typography><pre>{currentMedicalRecord}</pre></Typography>
                                    </Form.Item>

                                    <Form.Item label='OI' name="retinoscopiaoi">
                                        <Typography><pre>{currentMedicalRecord}</pre></Typography>
                                    </Form.Item>
                                </Space>

                                <Space>
                                    <Form.Item label='OD'name="rxfinalod">
                                        <Typography><pre>{currentMedicalRecord}</pre></Typography>
                                    </Form.Item>

                                    <Form.Item label='OI' name="rxfinaloi">
                                        <Typography><pre>{currentMedicalRecord}</pre></Typography>
                                    </Form.Item>

                                    <Form.Item label='AVL' name="avl">
                                        <Typography><pre>{currentMedicalRecord}</pre></Typography>
                                    </Form.Item>

                                    <Form.Item label='AVP' name="avp">
                                        <Typography><pre>{currentMedicalRecord}</pre></Typography>
                                    </Form.Item>
                                </Space>

                                <Space>
                                    <Form.Item label='Color' name="color" >
                                        <Typography><pre>{currentMedicalRecord}</pre></Typography>
                                    </Form.Item>

                                    <Form.Item label='ADD+' name="rxfinaladd" >
                                        <Typography><pre>{currentMedicalRecord}</pre></Typography>
                                    </Form.Item>

                                    <Form.Item label='BIF' name="bif" >
                                        <Typography><pre>{currentMedicalRecord}</pre></Typography>
                                    </Form.Item>
                                </Space>

                                <Form.Item label='Uso' name="uso" >
                                    <Typography><pre>{currentMedicalRecord}</pre></Typography>
                                </Form.Item>

                                <Form.Item label='Diagnostico' name="diagnostico">
                                    <Typography><pre>{currentMedicalRecord}</pre></Typography>
                                </Form.Item>

                                <Form.Item label='Conducta' name="conducta" >
                                    <Typography><pre>{currentMedicalRecord}</pre></Typography>
                                </Form.Item>

                                <Form.Item label='Examinador' >
                                    <Typography><pre>{currentMedicalRecord}</pre></Typography>
                                </Form.Item>

                                <Form.Item label='Observaciones' name='observaciones'>
                                    <Typography><pre>{currentMedicalRecord}</pre></Typography>
                                </Form.Item>

                                <Form.Item label='Control' name='control' >
                                    <Typography><pre>{currentMedicalRecord}</pre></Typography>
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