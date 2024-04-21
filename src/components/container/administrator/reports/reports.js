// React imports
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";

// External components / libraries
import { Button, Modal, Space, Table } from 'antd';

// Self created components
import FeedbackMessage from '../../common/feedback-message/feedback-message';

// Self created services
import { getCanceledAppointments } from '../../../../services/appointmentService';

// Styles
import './reports.css';

export default function Reports() {

    const ref = useRef(null);
    const [height, setHeight] = useState(0);
    const [width, setWidth] = useState(0);
    const [canceledAppointments, setCanceledAppointments] = useState([])
    const [currentReport, setCurrentReport] = useState([])
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




    // TO FETCH CANCELED APPOINTMENTS TO TABLE
    const fetchCanceledAppointments = useCallback(async () => {
        try {
            const response = await getCanceledAppointments();
            const citasByFecha = {};
            // Group citas by fecha
            response.data.forEach((cita) => {
                const { fecha } = cita;
                if (!citasByFecha[fecha]) {
                citasByFecha[fecha] = [];
                }
                citasByFecha[fecha].push(cita);
            });

            // Convert citasByFecha object to an array of arrays sorted by fecha
            const sortedCitasByFecha = Object.entries(citasByFecha)
                .sort((a, b) => new Date(a[0]) - new Date(b[0])) // Sort by fecha
                .map(([fecha, citas]) => citas); // Extract the arrays of citas

            setCanceledAppointments(sortedCitasByFecha)
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
                    `Ocurrió un error al cargar los datos de citas canceladas. ${error.message}`
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
            fetchCanceledAppointments()
        }
    }, [navigate, fetchCanceledAppointments])

    




    // TO SHOW REPORT MODAL
    // START OF HANDLING UPDATE MODAL ***********************************************************
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    
    const showReportModal = async (report) => {
        setCurrentReport(report);
        setIsReportModalOpen(true);
    }
    
    const handleReportModalCancel = () => {
        setIsReportModalOpen(false);
        setCurrentReport(null);
    };





    // TO DEFINE COLUMN TABLES
    const columns = [
        {
            title: 'Fecha',
            key: 'date',
            render: (record) => (
                <Space size="middle">
                    {record[0].fecha}
                </Space>
            )
        },
        {
            title: 'Acciones',
            key: 'action',
            render: (record) => (
            <Space size="middle">
                <Button type="primary" onClick={() => showReportModal(record)} htmlType='submit'>
                    Ver
                </Button>
            </Space>
            ),
        },
    ];

    const columnsReportTable = [
        {
            dataIndex: 'idcita',
            title: 'ID Cita',
            key: 'idcita'
        },
        {
            dataIndex: 'codigo',
            title: 'Código',
            key: 'codigo'
        },
        {
            dataIndex: 'fecha',
            title: 'Fecha',
            key: 'fecha'
        },
        {
            dataIndex: 'nombre',
            title: 'Paciente',
            key: 'nombre'
        },
        {
            dataIndex: 'telefono',
            title: 'Teléfono',
            key: 'telefono'
        }
    ];






    return (
        <div className='reports' ref={ref}>
            <FeedbackMessage visible={message?.visible} type={message?.type} text={message?.text} onClose={() => hideMessage()}>
            </FeedbackMessage>
            <h1 id="report-title">Citas canceladas</h1>
            <div className='report-table'>
                <Table columns={columns} dataSource={canceledAppointments} />
            </div>

            <Modal title="Citas canceladas" open={isReportModalOpen} onCancel={handleReportModalCancel} width={'80%'} footer=
                {
                    <Button key="action" type="primary" onClick={handleReportModalCancel}>
                        Aceptar
                    </Button>
                }
            >
                <div className='modal-content'>
                    <Table columns={columnsReportTable} dataSource={currentReport} />
                </div>
            </Modal>
        </div>
    )
}