import { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Form, Input, Modal, Space, Table, Typography } from 'antd';
import { CheckOutlined, QuestionOutlined,  } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";


import './faq-management.css';

import { createQuestion, deleteQuestion, getQuestions, updateQuestion } from '../../../../services/faqService';
import FeedbackMessage from '../../common/feedback-message/feedback-message';

export default function FAQManagement() {

    // TO DEFINE THE SIZE OF THE COMPONENT ***********************************************************
    const ref = useRef(null);
    const [height, setHeight] = useState(0);
    const [width, setWidth] = useState(0);
    const [message, setMessage] = useState({
        visible: false,
        type: '',
        text: ''
    })


    const [loading, setLoading] = useState(false);
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






    // TO FETCH QUESTIONS DATA WHEN COMPONENT IS LOADED FOR THE FIRST TIME ***********************************************************
    const [questionsData, setQuestionsData] = useState(null);
    const fetchQuestions = useCallback(async () => {
        try {
            const response = await getQuestions();
            setQuestionsData(response.data)
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
                    `Ocurrió un error al cargar las preguntas. ${error.message}`
                )
            }
        } finally {
            setLoading(false);
        }
    },[navigate])

    useEffect(() => {
        setHeight(ref.current.offsetHeight);
        setWidth(ref.current.offsetWidth);
        if(!localStorage.getItem('token')) {
            navigate("/inicio-empleados")
        } else {
            fetchQuestions();
        }
    }, [navigate, fetchQuestions])







    // TO FILTER QUESTIONS IN THE TABLE ***********************************************************
    const [searchText, setSearchText] = useState('');
    const [filteredData, setFilteredData] = useState([]);

    useEffect(() => {
        setTimeout(() => {
            const filtered = questionsData
            ? questionsData.filter(question =>
                question.pregunta.toLowerCase().includes(searchText.toLowerCase())
            ): [];
            setFilteredData(filtered);
        },500)
    }, [searchText, questionsData])







    // TO DEFINE FORM CONSTANTS ***********************************************************
    const [creationForm] = Form.useForm();
    const [updateForm] = Form.useForm();





    

    // TO HANDLE DELETION CONFIRMATION MODAL ***********************************************************
    const [isDeletionModalOpen, setDeletionModalOpen] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState(null);


    const showDeletionModal = (question) => {
        setSelectedQuestion(question)
        setDeletionModalOpen(true);
    };  
    
    const removeQuestion = async () => {
        setLoading(true);
        try {
            const response = await deleteQuestion(
                selectedQuestion.idpregunta,
                JSON.parse(localStorage.getItem('user')).idadmin
            );
            if (response.status === 200) {
                showMessage(
                    'success',
                    `La pregunta se eliminó exitosamente.`
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
                    `Ocurrió un error al eliminar la pregunta. ${error.message}`
                )
            }
        } finally {
            fetchQuestions();
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
    






    // START OF HANDLING CREATION MODAL ***********************************************************
    const [isCreationModalOpen, setIsCreationModalOpen] = useState(false);
    const [isCreationFormComplete, setIsCreationFormComplete] = useState(false);


    const onCreationValuesChange = (_, allValues) => {
        const isComplete = Object.values(allValues).every(value => !!value);
        setIsCreationFormComplete(isComplete);
    };
    
    const showCreationModal = (question) => {
        setSelectedQuestion(question);
        setIsCreationModalOpen(true);
    }

    const handleCreateQuestion = async () => {
        setLoading(true);
        if (creationForm != null) {
            try {
                const values = await creationForm.validateFields();
                const response = await createQuestion(
                    {
                        idadmin: JSON.parse(localStorage.getItem('user')).idadmin,
                        pregunta: values.pregunta,
                        respuesta: values.respuesta
                    }
                );
                setLoading(true);
                if (response.status === 200) {
                    showMessage(
                        'success',
                        `La pregunta se creó exitosamente.`
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
                        `Ocurrió un error al crear la pregunta. ${error.message}`
                    )
                }
            } finally {
                fetchQuestions();
                setLoading(false);
                setIsCreationModalOpen(false);
                setIsCreationFormComplete(false);
            }
        }
    };
    
    const handleCreationModalCancel = () => {
        setIsCreationModalOpen(false);
    };
    


    
    

    // START OF HANDLING UPDATE MODAL ***********************************************************
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isUpdateFormComplete, setIsUpdateFormComplete] = useState(false);


    const onUpdateValuesChange = (_, allValues) => {
        const isComplete = Object.values(allValues).every(value => !!value);
        setIsUpdateFormComplete(isComplete);
    };
    
    const showUpdateModal = async (question) => {
        setSelectedQuestion(question);
        updateForm.setFieldsValue(question);
        setIsUpdateModalOpen(true);
        setIsUpdateFormComplete(false);
    }

    const handleUpdateQuestion = async () => {
        if (updateForm != null) {
            try {
                setLoading(true);
                const values = await updateForm.validateFields();
                const response = await updateQuestion(
                    {
                        idadmin: JSON.parse(localStorage.getItem('user')).idadmin,
                        id: selectedQuestion.idpregunta,
                        pregunta: values.pregunta,
                        respuesta: values.respuesta
                    }
    
                );
                setLoading(true);
                if (response.status === 200) {
                    showMessage(
                        'success',
                        `La pregunta se actualizó exitosamente.`
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
                        `Ocurrió un error al actualizar la pregunta. ${error.message}`
                    )
                }
            } finally {
                fetchQuestions();
                setIsUpdateModalOpen(false);
                setIsUpdateFormComplete(false);
                setSelectedQuestion(null);
                setLoading(false);
            }
        }
        setLoading(true)
    };
    
    const handleUpdateModalCancel = () => {
        setIsUpdateModalOpen(false);
        setIsUpdateFormComplete(false);
        setSelectedQuestion(null);
    };






    // TO DEFINE TABLES FOR COLUMNS
    const columns = [
        {
            title: 'ID Pregunta',
            key: 'idpregutna',
            render: (_, record) => (
                record.idpregunta
            )
        },
        {
            title: 'Pregunta',
            key: 'pregunta',
            render: (_, record) => (
                record.pregunta
            )
        },
        {
            title: 'Respuesta',
            key: 'respuesta',
            render: (_, record) => (
                record.respuesta
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
                <Button type="primary" danger onClick={() => showDeletionModal(record)} htmlType='submit'>
                    Eliminar
                </Button>
            </Space>
            ),
        },
    ];





    // HTML TEMPLATE
    return (
        /* div optometrist-management contains the whole screen in which thd component is displayed */
        <div className="question-management" ref={ref}>
            <FeedbackMessage visible={message?.visible} type={message?.type} text={message?.text} onClose={() => hideMessage()}>
            </FeedbackMessage>
            <div className='search-form'>
                <Form name="search" layout="inline">
                    <Form.Item name="search-input">
                        <Input prefix={<CheckOutlined className="site-form-item-icon" />} placeholder="Palabra clave de la pregunta" onChange={e => setSearchText(e.target.value)}/>
                    </Form.Item>
                </Form>
                





                <Modal title="Eliminar pregunta" centered open={isDeletionModalOpen} onCancel={DeletionModalCancel} footer=
                    {<>
                        <Button key="cancel" onClick={DeletionModalCancel}>
                            Salir
                        </Button>,
                        <Button key="action" type="primary" danger loading={loading} onClick={removeQuestion}>
                            Eliminar
                        </Button>
                    </>}>
                    <p className='confirmation'>¿Está seguro que desea eliminar la pregunta?</p>

                    <Typography>
                        <pre>{selectedQuestion?.pregunta}</pre>
                    </Typography>

                    <Typography>
                        <pre>{selectedQuestion?.respuesta}</pre>
                    </Typography>
                </Modal>
            </div>
            




            <div className='modal'>
                <Button type="dashed" htmlType='submit' onClick={() => showCreationModal(null)}>
                    Crear pregunta nueva
                </Button>
            </div>

            <Modal title="Crear pregunta" centered open={isCreationModalOpen} onCancel={handleCreationModalCancel} width={'50%'} footer=
                {<>
                    <Button key="cancel" onClick={handleCreationModalCancel}>
                        Salir
                    </Button>
                    <Button key="create" type="primary" loading={loading} onClick={handleCreateQuestion} disabled={!isCreationFormComplete}>
                        Crear
                    </Button>
                </>}
            >

                <p className='confirmation'>Por favor llene los siguientes campos:</p>
                <Form
                    className='creation-form'
                    initialValues={{ remember: false }}
                    form={creationForm}
                    name="question-creation"
                    onFinish={handleCreateQuestion}
                    onValuesChange={onCreationValuesChange}
                >
                        
                    <Form.Item
                        name="pregunta"
                        rules={[
                        {
                            required: true,
                            message: 'Por favor ingrese una pregunta!',
                        }]}
                    >
                        <Input prefix={<QuestionOutlined/>} placeholder='Pregunta'/>
                    </Form.Item>
                        
                        
                    <Form.Item
                        name="respuesta"
                        rules={[
                        {
                            required: true,
                            message: 'Por favor ingrese la respuesta de la pregunta!',
                        }]}
                    >
                        <Input prefix={<CheckOutlined/>} placeholder='Respuesta'/>
                    </Form.Item>
                </Form>
            </Modal>






            <Modal title="Modificar pregunta" centered open={isUpdateModalOpen} onCancel={handleUpdateModalCancel} width={'50%'} footer=
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
                    onValuesChange={onUpdateValuesChange}
                >

                    <Form.Item
                        name="pregunta"
                        rules={[
                        {
                            required: true,
                            message: 'Por favor ingrese la pregunta!',
                        }]}
                        initialValue={selectedQuestion?.pregunta}
                    >
                        <Input prefix={<QuestionOutlined/>} placeholder='Pregunta'/>
                    </Form.Item>

                    <Form.Item
                        name="respuesta"
                        rules={[
                        {
                            required: true,
                            message: 'Por favor ingrese la respuesta de la pregunta!',
                        },
                        ]}
                        initialValue={selectedQuestion?.respuesta}
                    >
                        <Input prefix={<CheckOutlined/>} placeholder='Respuesta'/>
                    </Form.Item>
                </Form>
            </Modal>






            <div className='question-table'>
                <Table columns={columns} dataSource={filteredData.map((item, index) => ({ ...item, key: index }))} scroll={{y: 600}} pagination={false}/>
            </div>
        </div>
    );
}