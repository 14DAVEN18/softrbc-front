import { useEffect, useRef, useState } from 'react';
import { Button, Modal, Space, Table, } from 'antd';
import { useNavigate } from "react-router-dom";

import JSONPretty from 'react-json-pretty';

import './changelog.css';
import { getChangelog } from '../../../../services/changelogService';
//import 'react-json-pretty/themes/monikai.css';

export default function Changelog() {

    const ref = useRef(null);
    const [height, setHeight] = useState(0);
    const [width, setWidth] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        setHeight(ref.current.offsetHeight);
        setWidth(ref.current.offsetWidth);
        if(!localStorage.getItem('token')) {
            navigate("/inicio-empleados")
        } else {
            fetchChangelog();
        }
    }, [navigate])


    // TO FETCH CHANGELOG DATA WHEN COMPONENT IS LOADED FOR THE FIRST TIME ***********************************************************
    const [changelogData, setChangelogData] = useState(null);
    const fetchChangelog = async () => {
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
            console.log("changelog: ", changeRecord)
        } catch (error) {
            console.error('Error en la solicitud:', error);
        }
    }






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