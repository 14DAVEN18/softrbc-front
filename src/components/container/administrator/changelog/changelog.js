// React imports
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";

// External components / libraries
import { Button, Modal, Space, Table, } from 'antd';
import JSONPretty from 'react-json-pretty';

// Self created components
import FeedbackMessage from '../../common/feedback-message/feedback-message';

// Self created services
import { getChangelog } from '../../../../services/changelogService';

// Styles
import './changelog.css';

export default function Changelog() {

    const ref = useRef(null);
    const [height, setHeight] = useState(0);
    const [width, setWidth] = useState(0);
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

    


    // TO FETCH CHANGELOG DATA WHEN COMPONENT IS LOADED FOR THE FIRST TIME ***********************************************************
    const [changelogData, setChangelogData] = useState(null);
    const fetchChangelog = useCallback(async () => {
        try {
            const response = await getChangelog();

            const changeRecord = response.data.map((log) => {
                const JsonObject = JSON.parse(log.informacion);
                const formattedDate = log.fecha.replace(/_/g, ' ');
    
                return {
                    ...log,
                    fecha: formattedDate,
                    informacion: JsonObject
                };
            });

            changeRecord.sort((a, b) => {
                const dateA = new Date(a.fecha);
                const dateB = new Date(b.fecha);
                return dateB - dateA; // Compare dates to determine sorting order
            });


            setChangelogData(changeRecord)
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
                    `Ocurrió un error al cargar el registro de cambios. ${error.message}`
                )
            }
        }
    }, [navigate])

    useEffect(() => {
        setHeight(ref.current.offsetHeight);
        setWidth(ref.current.offsetWidth);
        if(!localStorage.getItem('token')) {
            navigate("/inicio-empleados")
        } else {
            fetchChangelog();
        }
    }, [navigate, fetchChangelog])






    // TO HANDLE VISUALIZATION OF SELECTED CHANGELOG
    const [isLogModalOpen, setIsLogModalOpen] = useState(false);
    const [selectedLog, setSelectedLog] = useState(null);

    const showChangelog = (record) => {
        setSelectedLog(record)
        setIsLogModalOpen(true);
    }

    const logModalCancel = () => {
        setIsLogModalOpen(false);
        setSelectedLog(null);
    };






    // TO HANDLE COLUMNS OF CHANGELOG TABLE
    const columns = [
        {
            dataIndex: 'fecha',
            title: 'Fecha',
            key: 'fecha'
        },
        {
            dataIndex: 'idusuario',
            title: 'ID Usuario',
            key: 'idusuario'
        },
        {
            dataIndex: 'accion',
            title: 'Acción realizada',
            key: 'accion'
        },
        {
            title: 'Acciones',
            key: 'action',
            render: (record) => (
            <Space size="middle">
                <Button type="primary" onClick={() => showChangelog(record)} htmlType='submit'>
                    Ver detalle
                </Button>
            </Space>
            ),
        },
    ];

    return (
        <div className='changelog' ref={ref}>
            <FeedbackMessage visible={message?.visible} type={message?.type} text={message?.text} onClose={() => hideMessage()}>
            </FeedbackMessage>
            <h1>Registro de cambios</h1>
            <div className='changelog-table'>
                <Table
                    columns={columns}
                    dataSource={changelogData?.map((changelog) => ({
                        ...changelog,
                        key: changelog.idauditoria
                }))} 
                pagination={{ position: ['bottomRight']}}/>
            </div>

            <Modal title={<h1>Log # {selectedLog?.idauditoria}</h1>} centered open={isLogModalOpen} onCancel={logModalCancel} width={'90%'} footer=
                {<>
                    <Button key="action" type="primary" danger onClick={logModalCancel}>
                        Salir
                    </Button>
            </>}>
                <div className='log-modal-content'>
                    <p><span>Acción:</span> {selectedLog?.accion}</p>
                    <p><span>Fecha:</span> {selectedLog?.fecha}</p>
                    <p><span>ID del usuario:</span> {selectedLog?.idusuario}</p>
                    <div className='json-view'>
                        {selectedLog?.informacion.hasOwnProperty('actualizada') &&
                            <>
                                <h2>Datos anteriores</h2>
                                <div className='json-container'>
                                    <JSONPretty id="json-pretty" data={selectedLog?.informacion.anterior}></JSONPretty>
                                </div>
                                
                                <h2>Datos actualizados</h2>
                                <div className='json-container'>
                                    <JSONPretty id="json-pretty" data={selectedLog?.informacion.actualizada}></JSONPretty>
                                </div>
                            </>
                        }

                        {!selectedLog?.informacion.hasOwnProperty('actualizada') &&
                            <>
                                <h2>Datos registrados</h2>
                                <div className='json-container'>
                                    <JSONPretty id="json-pretty" data={selectedLog?.informacion}></JSONPretty>
                                </div>
                            </>
                        }
                    </div>
                </div>
            </Modal>
        </div>
    )
}