// React imports
import { useEffect, useRef, useState} from 'react';
import { useNavigate } from "react-router-dom";

// External components / libraries
import { Button } from 'antd';
import { connect } from 'react-redux';

// Self created components
import Login from '../login/login';
import FeedbackMessage from '../../common/feedback-message/feedback-message';

// Self created services
import { getQuestions } from '../../../../services/faqService';
import { cancelAppointment, verifyAppointmentDetails } from '../../../../services/appointmentService';
import { addMessage, resetMessage, setDisplayLogin, setDecisionTree, setCurrentLevel, setNewInput } from './redux/chatbotActions';

// Styles
import './chatbot.css';

function Chatbot({
    messages,
    displayLogin,
    decisionTree,
    currentLevel,
    input,
    addMessage,
    resetMessage,
    setDisplayLogin,
    setDecisionTree,
    setCurrentLevel,
    setNewInput
})  {

    const logoUrl = `${process.env.PUBLIC_URL}/Logo.png`
    const navigate = useNavigate();

    const ref = useRef(null);
    const messageBoxRef = useRef(null);

    const regex = /^[Oo][Pp]\d+$/

    const [height, setHeight] = useState(0);
    const [width, setWidth] = useState(0);
    const [inputValue, setInputValue] = useState('');
    const [message, setMessage] = useState({
        visible: false,
        type: '',
        text: ''
    })

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
    }, [])




    
    useEffect(() => {
        // Scroll to the bottom of the message box whenever messages change
        if (messageBoxRef.current) {
            messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;
        }
    }, [messages]);


    // TO FETCH QUESTIONS DATA WHEN COMPONENT IS LOADED FOR THE FIRST TIME ***********************************************************
    

    // Fetch questions data and construct decision tree
    useEffect(() => {
        
        const fetchDataAndConstructTree = async () => {

            try {
                const response = await getQuestions();
                const questions = response.data;

                const optionsFor1 = {};
                questions.forEach((question, index) => {
                    optionsFor1[index + 1] = {
                        pregunta: question.pregunta,
                        respuesta: question.respuesta
                    };
                });

                
                // Construct decision tree with fetched questions data
                const initialDecisionTree = {
                    '1': {
                        text: 'Preguntas frecuentes',
                        options: optionsFor1
                    },
                    '2': {
                        text: 'Citas de optometría',
                        options: {
                            '1': {
                                authRequired: true,
                                text: 'Agendar cita',
                                action: () => {
                                    navigate('/cliente/agendamiento')
                                }
                            },
                            '2': {
                                authRequired: true,
                                text: 'Verificar detalles de cita',
                                options: {
                                    text: 'Por favor ingrese el código de la cita',
                                    code: async (userMessage) => {
                                        const query = {
                                            idpaciente: JSON.parse(localStorage.getItem('user')).idpaciente,
                                            codigo: userMessage
                                        }
                                        try {
                                            const response = await verifyAppointmentDetails(query)
                                            if(!response.data.estado) {
                                                addMessage({ text: `Estimado usuario. La cita asociada con el código ${query.codigo} ya fue cancelada previamente. Si aun desea tener su consulta de optometría por favor agende una nueva cita.`})
                                                addMessage({ text: '0. Menú principal '})
                                            } else {
                                                addMessage({ text: 'Estimado usuario. los detalles de su cita son los siguientes:'})
                                                addMessage({ text: `Fecha: ${response.data.fecha}`, sender: 'bot' })
                                                addMessage({ text: `Hora : ${response.data.hora}`, sender: 'bot' })
                                                addMessage({ text: '0. Menú principal.'})
                                            }
                                        } catch (error) {
                                            if(!error.hasOwnProperty('response')) {
                                                if(error.hasOwnProperty('message')) {
                                                    if(error.message.toLowerCase() === 'network error') {
                                                        addMessage({ text: 'No se puedo conectar al servidor. Por favor intente más tarde.', sender: 'bot'})
                                                    }
                                                }
                                            } else if (error.response.data.hasOwnProperty('error')) {
                                                if (error.response.data.error.toLowerCase().includes('expired')){
                                                    addMessage({ text: 'Estimado usuario. Su sesión expiró. En unos segundos el sistema le pedirá sus credenciales de inicio de sesión.', sender: 'bot'})
                                                    localStorage.clear()
                        
                                                    let countDown = 5;
                                                    const countDownInterval = setInterval(() => {
                                                        if (countDown === 0) {
                                                            clearInterval(countDownInterval)
                                                            setDisplayLogin(true)
                                                        } else {
                                                            addMessage({ text: `${countDown} segundo(s)`, sender: 'bot' });
                                                            countDown--;
                                                        }
                                                    }, 1000)
                                                } else if (error.response.data.error.toLowerCase().includes('does not match')) {
                                                    addMessage({ text: 'Estimado usuario. Su sesión actual no es válida. En unos segundos el sistema le pedirá sus credenciales de inicio de sesión.', sender: 'bot'})
                                                    localStorage.clear()

                                                    let countDown = 5;
                                                    const countDownInterval = setInterval(() => {
                                                        if (countDown === 0) {
                                                            clearInterval(countDownInterval)
                                                            setDisplayLogin(true)
                                                        } else {
                                                            addMessage({ text: `${countDown} segundo(s)`, sender: 'bot' });
                                                            countDown--;
                                                        }
                                                    }, 1000)
                                                }
                                            } else {
                                                addMessage({ text: `${error.response.data}`, sender: 'bot'})
                                                addMessage({ text: `Revise el código e inténtelo de nuevo.`, sender: 'bot'})
                                                addMessage({ text: `O ingrese 0 para volver al menú principal`, sender: 'bot'})
                                            }
                                        }
                                        
                                    }
                                }
                            },
                            '3': {
                                authRequired: true,
                                text: 'Cancelar cita',
                                options: {
                                    text: 'Por favor ingrese el código de la cita',
                                    code: async (userMessage) => {
                                        try {
                                            const response = await cancelAppointment(userMessage)
                                            if(!response.data.estado) {
                                                addMessage({ text: `Estimado usuario. La cita asociada con el código ${userMessage} fue cancelada.`})
                                                addMessage({ text: '0. Menú principal.'})
                                            }
                                        } catch (error) {
                                            if(!error.hasOwnProperty('response')) {
                                                if(error.hasOwnProperty('message')) {
                                                    if(error.message.toLowerCase() === 'network error') {
                                                        addMessage({ text: 'No se puedo conectar al servidor. Por favor intente más tarde.', sender: 'bot'})
                                                    }
                                                }
                                            } else if (error.response.data.hasOwnProperty('error')) {
                                                if (error.response.data.error.toLowerCase().includes('expired')){
                                                    addMessage({ text: 'Estimado usuario. Su sesión expiró. En unos segundos el sistema le pedirá sus credenciales de inicio de sesión.', sender: 'bot'})
                                                    localStorage.clear()
                        
                                                    let countDown = 5;
                                                    const countDownInterval = setInterval(() => {
                                                        if (countDown === 0) {
                                                            clearInterval(countDownInterval)
                                                            setDisplayLogin(true)
                                                        } else {
                                                            addMessage({ text: `${countDown} segundo(s)`, sender: 'bot' });
                                                            countDown--;
                                                        }
                                                    }, 1000)
                                                } else if (error.response.data.error.toLowerCase().includes('does not match')) {
                                                    addMessage({ text: 'Estimado usuario. Su sesión actual no es válida. En unos segundos el sistema le pedirá sus credenciales de inicio de sesión.', sender: 'bot'})
                                                    localStorage.clear()

                                                    let countDown = 5;
                                                    const countDownInterval = setInterval(() => {
                                                        if (countDown === 0) {
                                                            clearInterval(countDownInterval)
                                                            setDisplayLogin(true)
                                                        } else {
                                                            addMessage({ text: `${countDown} segundo(s)`, sender: 'bot' });
                                                            countDown--;
                                                        }
                                                    }, 1000)
                                                }
                                            }
                                            else {
                                                addMessage({ text: `${error.response.data}`, sender: 'bot'})
                                                addMessage({ text: `Revise el código e inténtelo de nuevo.`, sender: 'bot'})
                                                addMessage({ text: `O ingrese 0 para volver al menú principal`, sender: 'bot'})
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                };

                
                // Set questionsData and decisionTree state
                setCurrentLevel(initialDecisionTree)
                setDecisionTree(initialDecisionTree) 
            } catch (error) {
                if(error.hasOwnProperty('message')) {
                    if(error.message.toLowerCase() === 'network error') {
                        showMessage(
                            'error',
                            `No se puedo conectar al servidor. Por favor intente más tarde.`
                        )
                    }
                } else {
                    showMessage(
                        'error',
                        'Ocurrió un error al cargar las preguntas.'
                    )
                }
            }
        };

        // Call fetchDataAndConstructTree when component mounts
        fetchDataAndConstructTree();
    }, [addMessage, navigate, setCurrentLevel, setDecisionTree, setNewInput]);




    const handleLogin = () => {
        setDisplayLogin(false);

        if(input === '1') {
            setNewInput(null)
            setCurrentLevel(decisionTree)
            resetMessage()
            navigate('/cliente/agendamiento')
        } else if(input === '2') {
            addMessage({ text: `Ha iniciado sesión correctamente.`, sender: 'bot' });
            addMessage({ text: `Por favor digite el número de cita que quiere verificar.`, sender: 'bot' });
            if(currentLevel.hasOwnProperty(input))
                setCurrentLevel(currentLevel[input].options)
        } else {
            addMessage({ text: `Ha iniciado sesión correctamente.`, sender: 'bot' });
            addMessage({ text: `Por favor digite el número de cita que quiere cancelar.`, sender: 'bot' });
            if(currentLevel.hasOwnProperty(input))
                setCurrentLevel(currentLevel[input].options)
        }
        setNewInput(null)
    };






    const handleUserInput = async (option) => {
        if (option === '0') {
            setCurrentLevel(decisionTree);
            resetMessage();
        } else {
            addMessage({ text: option, sender: 'user'})
            // To check if the provided option exists in the currentLevel
            if (currentLevel.hasOwnProperty(option)) {
                // The provided option exists, now check if the option requires Auth
                if (currentLevel[option].hasOwnProperty('authRequired')) {
                    setNewInput(option)
                    addMessage({text: currentLevel[option].text, sender: 'bot'})
                    let selectedOption = currentLevel[option]
                    // This options required Auth, now check if the user is authenticated
                    if (localStorage.getItem('token')) {
                        // The user is authenticated, now check if the user wants to schedule an appointment or not.
                        if(selectedOption.hasOwnProperty('action')) {
                            // The user wants to schedule an appointment
                            resetMessage();
                            selectedOption.action();
                        } else {
                            // The user wants to verify or cancel an appointment
                            selectedOption = selectedOption.options
                            setCurrentLevel(selectedOption)
                            addMessage({ text: selectedOption.text, sender: 'bot'})
                        }
                    } else {
                        // The user is NOT authenticade, now check if the user wants to schedule an appointment or not.
                        addMessage({ text: 'Para gestionar citas de optometría debe primero iniciar sesión.', sender: 'bot' });
                        addMessage({ text: 'En unos segundos el sistema le pedirá sus credenciales de inicio de sesión.', sender: 'bot' });
                        
                        let countDown = 5;
                        const countDownInterval = setInterval(() => {
                            if (countDown === 0) {
                                clearInterval(countDownInterval)
                                setDisplayLogin(true)
                            } else if (countDown === 1) {
                                addMessage({ text: `${countDown} segundo`, sender: 'bot' });
                                countDown--;
                            } else {
                                addMessage({ text: `${countDown} segundos`, sender: 'bot' });
                                countDown--;
                            }
                        }, 1000)
                    }
                } else {
                    // this option doesn't require Auth, now check if the option has 'options' property
                    if (currentLevel[option].hasOwnProperty('options')) {
                        
                        // The provided option has the 'options' property
                        const selectedOption = currentLevel[option].options
                        if(Object.keys(selectedOption).length > 0) {
                            addMessage({ text: currentLevel[option].text, sender: 'bot'})
                            if(selectedOption[1].hasOwnProperty('pregunta')) {
                                const optionsTexts = Object.keys(selectedOption).map(key => {
                                    return { text: `${key}. ${selectedOption[key].pregunta}`, sender: 'bot' }
                                });
                                optionsTexts.forEach(message => {
                                    addMessage(message)
                                })
                                addMessage({ text: 'Si la pregunta que tiene no está listada, por favor comuníquese con la optica al +57 321 225 8819 o al correo electrónico elpalaciodelasgafascc@gmail.com', sender: 'bot'})
                                setCurrentLevel(selectedOption)
                            } else {
                                const optionsTexts = Object.keys(selectedOption).map(key => {
                                    return { text: `${key}. ${selectedOption[key].text}`, sender: 'bot' }
                                });
                                optionsTexts.forEach(message => {
                                    addMessage(message)
                                })
                                setCurrentLevel(selectedOption)
                            }
                        } else {
                            addMessage({ text: 'En el momento no hay preguntas establecidas, si tiene alguna duda específica, por favor comuníquese con la optica al +57 321 225 8819 o al correo electrónico elpalaciodelasgafascc@gmail.com', sender: 'bot' })
                        }   
                    } else {
                        // The provided option doesn't have the 'options' property
                        addMessage({text: currentLevel[option].pregunta, sender: 'bot'})
                        addMessage({text: currentLevel[option].respuesta, sender: 'bot'})
                        addMessage({text: 'Puede digitar el número de otra pregunta o digitar 0 para volver al menú principal', sender: 'bot'})
                    }
                }
            } else if (regex.test(option)) {
                if (currentLevel.hasOwnProperty('code')) {
                    await currentLevel.code(option)
                } else {
                    addMessage({ text: 'Opción inválida. Por favor escriba una de las opcines dadas o ingrese un código ', sender: 'bot'});
                }
            } else {
                addMessage({ text: 'Opción inválida. Por favor escriba una de las opcines dadas.', sender: 'bot'});
            }
        }
    }



    

    // TO HANDLE OTIONS SUBMISSION
    const handleSendMessage = () => {
        const option = inputValue.trim();
        if (option) {
            handleUserInput(option);
            setInputValue('');
        }
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleSendMessage();
        }
    }

    return (
        <div className='chat-container' ref={ref}>
            <FeedbackMessage visible={message?.visible} type={message?.type} text={message?.text} onClose={() => hideMessage()}>
            </FeedbackMessage>
            <div className='chat'>
                <div className='chat-header'>
                    <img src={logoUrl} alt='Logo de el palacio de las gafas'/>
                    <h2>Chat</h2>
                </div>

                <div className='message-box' ref={messageBoxRef}>
                    {!displayLogin ? (
                        <>
                            {messages.map((message, index) => (
                                <div key={index} className={message.sender === 'user' ? 'user-message' : 'bot-message'}>{message.text}</div>
                            ))}
                        </>
                        ) : (
                            <>
                                { displayLogin && <Login onLogin={() => handleLogin()} /> }
                            </>
                        )
                    }
                </div>
                
                
                <div className='text-box'>
                    <input 
                        disabled={displayLogin}
                        type="text"
                        id="option"
                        name="option"
                        autoComplete='off'
                        placeholder='Digite el número que corresponda con la opción dada.'
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <Button disabled={displayLogin || !inputValue.trim()}
                        onClick={handleSendMessage}>Enviar</Button>
                </div>
            </div>
        </div>
    );
}

const mapStateToProps = (state) => ({
    messages: state.messages,
    displayLogin: state.displayLogin,
    decisionTree: state.decisionTree,
    currentLevel: state.currentLevel,
    input: state.input
})

const mapDispatchToProps = (dispatch) => ({
    addMessage: (message) => dispatch(addMessage(message)),
    resetMessage: () => dispatch(resetMessage()),
    setDisplayLogin: (display) => dispatch(setDisplayLogin(display)),
    setDecisionTree: (tree) => dispatch(setDecisionTree(tree)),
    setCurrentLevel: (level) => dispatch(setCurrentLevel(level)),
    setNewInput: (input) => dispatch(setNewInput(input))
});

export default connect(mapStateToProps, mapDispatchToProps)(Chatbot)