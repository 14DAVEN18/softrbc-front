// React imports
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// External components / libraries
import { Button, Form, Modal, Select, Space, Table, Transfer } from 'antd';

// Self created components
import FeedbackMessage from '../../common/feedback-message/feedback-message';
import { durations, days } from '../../../../constants/constants';

// Self created services
import { getOptometrists } from '../../../../services/optometristService';
import { getCalendars, createCalendar, updateCalendar } from '../../../../services/calendarService';

// Styles
import './work-calendar.css';

const initialTargetDays = [];

export default function WorkCalendar() {

    // TO DEFINE THE SIZE OF THE COMPONENT ***********************************************************
    const ref = useRef(null);
    const [height, setHeight] = useState(0);
    const [width, setWidth] = useState(0);
    const [message, setMessage] = useState({
        visible: false,
        type: '',
        text: ''
    })
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

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
    const [filteredData, setFilteredData] = useState([]);
    const fetchOptometrists = useCallback(async () => {
        try {
            const response = await getOptometrists(); // Call the create function from admin Service.js
            setOptometristsData(response.data)
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
                    'Ocurrió un error al cargar la información de los optometras.'
                )
            }
        } finally {
            setLoading(false);
        }
    }, [navigate])

    useEffect(() => {
        setTimeout(() => {
            const filtered = optometristsData
            ? optometristsData.filter(optometrist =>
                optometrist.activo === true
            ): [];
            setFilteredData(filtered);
        },500)
    }, [optometristsData])
    
    
    
    
    
    // TO FETCH CALENDAR DATA WHEN COMPONENT IS LOADED FOR THE FIRST TIME **************************************************************
    const [calendarsData, setCalendarsData] = useState(null);
    const fetchCalendars = useCallback(async () => {
        try {
            const response = await getCalendars();

            const calendarFormatted = response.data.map((calendar) => {
                const diasAtencionFormatted = calendar.diasatencion.split('.').map(day => {
                    const foundDay = days.find(d => d.day.toLowerCase() === day.toLowerCase());
                    return foundDay ? { key: foundDay.key, day: foundDay.day } : null; // Return object with key and day if day is found, otherwise null
                });
    
                return {
                    ...calendar,
                    diasatencion: diasAtencionFormatted.filter(item => item !== null) // Filter out null values
                };
            });
            setCalendarsData(calendarFormatted);
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
                    `Ocurrió un error al cargar la información de los calendarios. ${error.message}`
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
            fetchCalendars();
        }
    }, [navigate, fetchCalendars, fetchOptometrists])




    

    // TO HANDLE THE OPTOMETRIST SELECTION FROM THE DROPDOWN LIST
    const [selectedOptometrist, setSelectedOptometrist] = useState(null)
    const handleChangeOptometrist = (selection) => {
        setSelectedOptometrist(selection)
    };

    const selectOptometristOptions = filteredData?.map((optometra) => ({
        label: optometra.usuario.nombre + " " + optometra.usuario.apellido,
        value: optometra.idoptometra
    }));







    // TO HANDLE THE TRANSFER MENU (DAYS) 
    const [targetDays, setTargetDays] = useState(initialTargetDays);
    const [selectedDays, setSelectedDays] = useState([]);
    const onChange = (nextTargetDays) => {
        setTargetDays(nextTargetDays);
    };
  
    const onSelectChange = (sourceSelectedDays, targetSelectedDays) => {
        setSelectedDays([...sourceSelectedDays, ...targetSelectedDays]);
    };

    




    /* TO HANDLE DURATION SELECTION */
    const [selectedDuration, setSelectedDuration] = useState(null);
    const handleChangeDuration = (selection) => {
        setSelectedDuration(selection)
    };

    const selectDurationOptions = durations.map((duration) => ({
        label: duration.duration,
        value: duration.key,
    }));





    // START OF HANDLING CREATION MODAL ***********************************************************
    const [isCreationModalOpen, setIsCreationModalOpen] = useState(false);
    const [isCreationFormComplete, setIsCreationFormComplete] = useState(false);
    const [creationForm] = Form.useForm();


    const onCreationValuesChange = (_, allValues) => {
        const isComplete = Object.values(allValues).every(value => !!value);
        setIsCreationFormComplete(isComplete);
    };
    
    const showCreationModal = () => {
        setIsCreationModalOpen(true);
    }

    const handleCreateCalendar = async () => {
        
        const diasatencion = days.filter(item => targetDays.includes(item.key))
            .map(item => item.day)
            .join(".")
        try {
            setLoading(true)
            const response = await createCalendar(
                JSON.parse(localStorage.getItem('user')).idadmin,
                selectedOptometrist,
                diasatencion,
                selectedDuration
            );
            if(response.status === 200) {
                showMessage(
                    'success',
                    'Ocurrió un error al creador optometras'
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
                    `Ocurrió un error al crear el calendario. ${error.data}`
                )
            }
        } finally {
            fetchOptometrists();
            fetchCalendars();
            setLoading(false);
            setIsCreationModalOpen(false);
            setIsCreationFormComplete(false);
            creationForm.setFieldsValue(null);
        }
    };
    
    const handleCreationModalCancel = () => {
        setIsCreationModalOpen(false);
        creationForm.setFieldsValue(null);
    };
    




    // START OF HANDLING UPDATE MODAL ***********************************************************
    const [selectedCalendar, setSelectedCalendar] = useState(null)
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isUpdateFormComplete, setIsUpdateFormComplete] = useState(false);
    const [updateForm] = Form.useForm();


    const onUpdateValuesChange = (_, allValues) => {
        const isComplete = Object.values(allValues).every(value => !!value);
        setIsUpdateFormComplete(isComplete);
    };
    
    const showUpdateModal = (calendar) => {
        setSelectedCalendar(calendar);
        updateForm.setFieldsValue(calendar);
        setTargetDays(calendar.diasatencion.map(day => day.key))
        setIsUpdateModalOpen(true);
        setIsUpdateFormComplete(false);
    }

    const handleUpdateCalendar = async () => {
        
        const diasatencion = days.filter(item => targetDays.includes(item.key))
            .map(item => item.day)
            .join(".")
            
        if (updateForm != null) {
            try {
                setLoading(true);
                const response = await updateCalendar(
                    {
                        idadmin: JSON.parse(localStorage.getItem('user')).idadmin,
                        idcalendario: selectedCalendar.idcalendario,
                        idoptometra: selectedCalendar.idoptometra,
                        nuevadiasatencion: diasatencion,
                        nuevaduracion: selectedCalendar.duracioncita
                    }
                );
                if(response.status === 200) {
                    showMessage(
                        'success',
                        'El calendario fue actualizado exitosamente'
                    )
                }
                setLoading(true);
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
                        `Ocurrió un error al actualizar el calendario. ${error.data}`
                    ) 
                }
            } finally {
                fetchCalendars();
                setIsUpdateModalOpen(false);
                setIsUpdateFormComplete(false);
                setTargetDays(initialTargetDays)
                setSelectedCalendar(null);
                setLoading(false);
            }
        }
        setLoading(true)
    };
    
    const handleUpdateModalCancel = () => {
        setIsUpdateModalOpen(false);
        setIsUpdateFormComplete(false);
        setSelectedCalendar(null);
    };







    // TO DEFINE TABLES FOR COLUMNS
    const columns = [
        {
            title: 'ID Calendario',
            key: 'idcalendario',
            render: (_, record) => (
                record.idcalendario
            )
        },
        {
            title: 'Dias de trabajo',
            key: 'diasatencion',
            render: (_, record) => (
                record.diasatencion.map(day => day.day).join(' ')
            )
        },
        {
            title: 'Acciones',
            key: 'action',
            render: (_, record) => (
            <Space size="middle">
                <Button type="primary" onClick={ () => showUpdateModal(record)} htmlType='submit'>
                    Modificar
                </Button>
            </Space>
            ),
        },
    ];




    // HTML TEMPLATE
    return (
        <div className='work-calendar' ref={ref}>
            <FeedbackMessage visible={message?.visible} type={message?.type} text={message?.text} onClose={() => hideMessage()}>
            </FeedbackMessage>
            
            <div className='form-container'>
                <div className='modal'>
                    <Button type="dashed" htmlType='submit' onClick={() => showCreationModal()}>
                        Crear calendario nuevo
                    </Button>
                </div>


                




                <Modal title="Crear calendario" centered open={isCreationModalOpen} onCancel={handleCreationModalCancel} width={'50%'} footer=
                    {<>
                        <Button key="cancel" onClick={handleCreationModalCancel}>
                            Salir
                        </Button>
                        <Button key="create" type="primary" loading={loading} onClick={handleCreateCalendar} disabled={!isCreationFormComplete}>
                            Crear
                        </Button>
                    </>}
                >
                    {filteredData.length === 0 &&
                        <div className='alert'>No hay optometras activos en este momento. Por favor registre un optometra o habilite alguno existente</div>
                    }
                    <p className='confirmation'>Por favor llene los siguientes campos:</p>
                    <Form
                        className='creation-form'
                        initialValues={{ remember: false }}
                        form={creationForm}
                        name="calendar-creation"
                        onValuesChange={onCreationValuesChange}
                    >
                        <Form.Item 
                            name="idoptometra"
                            rules={[
                                {
                                    required: true,
                                    message: 'Por favor seleccione un optometra'
                                }
                                ]}
                        >
                            <Select 
                                size={'large'}
                                defaultValue="Seleccione un optómetra"
                                onChange={handleChangeOptometrist}
                                options={selectOptometristOptions}
                                disabled={filteredData.length===0}
                            />
                        </Form.Item>

                        <Form.Item
                            name="diasatencion"
                            rules={[
                                {
                                    required: true,
                                    message: 'Por favor escoja al menos un dia de la lista'
                                }
                            ]}
                        >
                            <Transfer
                                dataSource={days}
                                titles={['Días disponibles', 'Días a trabajar']}
                                targetKeys={targetDays}
                                selectedKeys={selectedDays}
                                onChange={onChange}
                                onSelectChange={onSelectChange}
                                operations={['Agregar', 'Quitar']}
                                render={(item) => item.day}
                                disabled={filteredData.length===0}
                            />
                        </Form.Item>
                        

                        <Form.Item 
                            name="duracioncita"
                            rules={[
                                {
                                    required: true,
                                    message: 'Por favor seleccione la duración de las citas'
                                }
                                ]}
                        >
                            <Select 
                                size={'large'}
                                defaultValue="Seleccione una duración"
                                onChange={handleChangeDuration}
                                options={selectDurationOptions} 
                                disabled={filteredData.length===0}
                            />
                        </Form.Item>
                    </Form>
                </Modal>


                



                <Modal title="Modificar calendario" centered open={isUpdateModalOpen} onCancel={handleUpdateModalCancel} width={'50%'} footer=
                    {<>
                        <Button key="cancel" onClick={handleUpdateModalCancel}>
                            Salir
                        </Button>
                        <Button key="update" type="primary" loading={loading} onClick={handleUpdateCalendar} disabled={!isUpdateFormComplete}>
                            Modificar
                        </Button>
                    </>}
                >

                    <p className='confirmation'>Por favor llene los siguientes campos:</p>
                    <Form
                        className='update-form'
                        form={updateForm}
                        name="question-update"
                        onFinish={handleUpdateCalendar}
                        onValuesChange={onUpdateValuesChange}
                    >

                        <Form.Item 
                            name="idoptometra"
                            rules={[
                                {
                                    required: true,
                                    message: 'Por favor seleccione un optometra'
                                }
                            ]}
                            initialValue={selectedCalendar?.idoptometra}
                        >
                            <Select 
                                size={'large'}
                                defaultValue="Seleccione un optómetra"
                                onChange={handleChangeOptometrist}
                                options={selectOptometristOptions}
                            />
                        </Form.Item>

                        <h4>Dias actuales:</h4>
                        
                        <Form.Item
                            name="diasatencion"
                            rules={[
                                {
                                    required: true,
                                    message: 'Por favor escoja al menos un dia de la lista'
                                }
                            ]}
                            initialValue={selectedCalendar?.diasatencion}
                        >
                            <Transfer
                                dataSource={days}
                                titles={['Días disponibles', 'Días a trabajar']}
                                targetKeys={targetDays}
                                selectedKeys={selectedDays}
                                onChange={onChange}
                                onSelectChange={onSelectChange}
                                operations={['Agregar', 'Quitar']}
                                render={(item) => item.day}
                            />
                        </Form.Item>
                        

                        <Form.Item 
                            name="duracioncita"
                            rules={[
                                {
                                    required: true,
                                    message: 'Por favor seleccione la duración de las citas'
                                }
                                ]}
                                initialValue={selectedCalendar?.duracioncita}
                        >
                            <Select 
                                size={'large'}
                                defaultValue="Seleccione una duración"
                                onChange={handleChangeDuration}
                                options={selectDurationOptions} />
                        </Form.Item>
                    </Form>
                </Modal>
            </div>

            <div className='question-table'>
                <Table
                    columns={columns}
                    dataSource={calendarsData?.map((calendar) => ({
                        ...calendar,
                        key: calendar.idcalendario
                }))} 
                scroll={{y: 600}}
                pagination={false}/>
            </div>
        </div>
    )
}