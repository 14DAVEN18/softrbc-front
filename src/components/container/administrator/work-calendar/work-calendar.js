import { useEffect, useRef, useState } from 'react';
import { Button, Form, Modal, Select, Space, Table, Transfer, Typography } from 'antd';


import './work-calendar.css';

import { durations, days } from '../../../../constants/constants';
import { getOptometrists } from '../../../../services/optometristService';
import { getCalendars, createCalendar, updateCalendar, deleteCalendar } from '../../../../services/calendarService';


const initialTargetDays = [];

export default function WorkCalendar() {

    // TO DEFINE THE SIZE OF THE COMPONENT ***********************************************************
    const ref = useRef(null);
    const [height, setHeight] = useState(0);
    const [width, setWidth] = useState(0);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setHeight(ref.current.offsetHeight);
        setWidth(ref.current.offsetWidth);
        fetchOptometrists();
        fetchCalendars();
    }, [])






    // TO FETCH OPTOMETRIST DATA WHEN COMPONENT IS LOADED FOR THE FIRST TIME ***********************************************************
    const [optometristsData, setOptometristsData] = useState(null);
    const [filteredData, setFilteredData] = useState([]);
    const fetchOptometrists = async () => {
        try {
            const response = await getOptometrists(); // Call the create function from admin Service.js
            setOptometristsData(response.data)
        } catch (error) {
            console.error('Error en la solicitud:', error);
            
        } finally {
            setLoading(false);
            
        }
    }

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
    const fetchCalendars = async () => {
        try {
            const response = await getCalendars();
            setCalendarsData(response.data)
        } catch (error) {
            console.error('Error en la solicitud', error)
        } finally {
            setLoading(false)
        }
    }




    

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
    const onChange = (nextTargetDays, direction, moveDays) => {
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
            const response = await createCalendar(selectedOptometrist, diasatencion, selectedDuration);
            setLoading(true);
        } catch (error) {
            console.error('Error en la solicitud:', error);
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
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isUpdateFormComplete, setIsUpdateFormComplete] = useState(false);
    const [updateForm] = Form.useForm();


    const onUpdateValuesChange = (_, allValues) => {
        const isComplete = Object.values(allValues).every(value => !!value);
        setIsUpdateFormComplete(isComplete);
    };
    
    const showUpdateModal = async (calendar) => {
        setSelectedCalendar(calendar);
        updateForm.setFieldsValue(calendar);
        setIsUpdateModalOpen(true);
        setIsUpdateFormComplete(false);
    }

    const handleUpdateQuestion = async () => {
        if (updateForm != null) {
            try {
                setLoading(true);
                const values = await updateForm.validateFields();
                const response = await updateCalendar(
                    {
                        idcalendario: selectedCalendar.idcalendario,
                        pregunta: values.pregunta,
                        respuesta: values.respuesta
                    }
    
                );
                setLoading(true);
            } catch (error) {
                console.error('Error en la solicitud:', error);
            } finally {
                fetchCalendars();
                setIsUpdateModalOpen(false);
                setIsUpdateFormComplete(false);
                setLoading(false);
                setSelectedCalendar(null);
            }
        }
        setLoading(true)
    };
    
    const handleUpdateModalCancel = () => {
        setIsUpdateModalOpen(false);
        setIsUpdateFormComplete(false);
        setSelectedCalendar(null);
    };







    // TO HANDLE DELETION CONFIRMATION MODAL ***********************************************************
    const [isDeletionModalOpen, setDeletionModalOpen] = useState(false);
    const [selectedCalendar, setSelectedCalendar] = useState(null);


    const showDeletionModal = (calendar) => {
        setSelectedCalendar(calendar)
        setDeletionModalOpen(true);
    };  
    
    const removeCalendar = async () => {
        setLoading(true);
        try {
            const response = await deleteCalendar(selectedCalendar.idpregunta); // Call the create function from userService.js
            // Handle success if needed
        } catch (error) {
            console.error('Error en la solicitud:', error);
            // Handle error if needed
        } finally {
            fetchCalendars();
            setLoading(false);
        }
        
        setTimeout(() => {
            setLoading(false);
            setDeletionModalOpen(false);
        }, 2000);
    };
    
    const DeletionModalCancel = () => {
        setDeletionModalOpen(false);
    };






    // TO DEFINE TABLES FOR COLUMNS
    const columns = [
        {
            title: 'Dias de trabajo',
            key: 'diasatencion',
            render: (_, record) => (
                record.diasatencion
            )
        },
        {
            title: 'Acciones',
            key: 'action',
            render: (_, record) => (
            <Space size="middle">
                <Button type="primary" danger onClick={() => showDeletionModal(record)} htmlType='submit'>
                    Borrar
                </Button>
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
                                disabled={filteredData.length===0}/>
                        </Form.Item>
                    </Form>
                </Modal>


                



                <Modal title="Modificar calendario" centered open={isUpdateModalOpen} onCancel={handleUpdateModalCancel} width={'50%'} footer=
                    {<>
                        <Button key="cancel" onClick={handleUpdateModalCancel}>
                            Salir
                        </Button>
                        <Button key="update" type="primary" loading={loading} onClick={handleUpdateQuestion} disabled={!isUpdateFormComplete}>
                            Modificar
                        </Button>
                    </>}
                >

                    <p className='confirmation'>Por favor llene los siguientes campos:</p>
                    <Form
                        className='update-form'
                        form={updateForm}
                        name="question-update"
                        onFinish={handleUpdateQuestion}
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







                <Modal title="Eliminar calendario" centered open={isDeletionModalOpen} onCancel={DeletionModalCancel} footer=
                    {<>
                        <Button key="salir" onClick={DeletionModalCancel}>
                            Salir
                        </Button>,
                        <Button key="action" type="primary" danger loading={loading} onClick={removeCalendar}>
                            Eliminar
                        </Button>
                    </>}>
                    <p className='confirmation'>¿Está seguro que desea eliminar el calendario?</p>

                    <Typography>
                        <pre>{selectedCalendar?.diasatencion}</pre>
                    </Typography>

                    <Typography>
                        <pre>{selectedCalendar?.duracioncita} minutos</pre>
                    </Typography>
                </Modal>
            </div>

            <div className='question-table'>
                <Table columns={columns} dataSource={calendarsData} scroll={{y: 600}} pagination={false}/>
            </div>
        </div>
    )
}