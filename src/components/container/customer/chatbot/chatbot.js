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
                // Fetch questions data
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
                                                addMessage({ text: 'Estimado usuario. los detalles son los siguientes:'})
                                                addMessage({ text: `Fecha: ${response.data.fecha}`, sender: 'bot' })
                                                addMessage({ text: `Hora : ${response.data.hora}`, sender: 'bot' })
                                                addMessage({ text: '0. Menú principal '})
                                            }
                                            setNewInput(null)
                                            setCurrentLevel(decisionTree)
                                        } catch (error) {
                                            addMessage({ text: error.response.data , sender: 'bot'})
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
                                            addMessage({ text: response.data, sender: 'bot'})
                                            addMessage({ text: '0. Menú principal '})
                                            setNewInput(null)
                                            setCurrentLevel(decisionTree)
                                        } catch (error) {
                                            addMessage({ text: `Ocurrió un error cancelando la cita ${userMessage}. Por favor revise el número en intentelo de nuevo`, sender: 'bot'})
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
                showMessage(
                    'error',
                    `Ocurrió un error al cargar las preguntas frecuentes. ${error.message}`
                )
            }
        };

        // Call fetchDataAndConstructTree when component mounts
        fetchDataAndConstructTree();
    }, [addMessage, decisionTree, navigate, setCurrentLevel, setDecisionTree, setNewInput]);



    

    const handleLogin = () => {
        setDisplayLogin(false);

        if(input === '1') {
            addMessage({ text: `Ha iniciado sesión correctamente. En breve será redirigido a la página de agendamiento.`, sender: 'bot' });
            setNewInput(null)
            setCurrentLevel(decisionTree)
            setTimeout(() => {
                resetMessage()
                navigate('/cliente/agendamiento')
            })
        } else if(input === '2') {
            addMessage({ text: `Ha iniciado sesión correctamente.`, sender: 'bot' });
            addMessage({ text: `Por favor digite el número de cita que quiere verificar.`, sender: 'bot' });
            setCurrentLevel(currentLevel[input].options)
        } else {
            addMessage({ text: `Ha iniciado sesión correctamente.`, sender: 'bot' });
            addMessage({ text: `Por favor digite el número de cita que quiere cancelar.`, sender: 'bot' });
            setCurrentLevel(currentLevel[input].options)
        }
        setNewInput(null)
    };






    const handleUserInput = async (option) => {
        addMessage({ text: option, sender: 'user'})
        if (option === '0') {
            setCurrentLevel(decisionTree);
            resetMessage();
        } else {
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
                            selectedOption.action()
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
                            } else {
                                addMessage({ text: `${countDown} segundo(s)`, sender: 'bot' });
                                countDown--;
                            }
                        }, 1000)
                    }
                } else {
                    // this option doesn't require Auth, now check if the option has 'options' property
                    if (currentLevel[option].hasOwnProperty('options')) {
                        // The provided option has the 'options' property
                        const selectedOption = currentLevel[option].options
                        addMessage({ text: currentLevel[option].text, sender: 'bot'})
                        const optionsTexts = Object.keys(selectedOption).map(key => {
                            if(selectedOption[key].hasOwnProperty('pregunta'))
                                return { text: `${key}. ${selectedOption[key].pregunta}`, sender: 'bot' }
                            else if (selectedOption[key].hasOwnProperty('text'))
                                return { text: `${key}. ${selectedOption[key].text}`, sender: 'bot' }
                        });
                        optionsTexts.forEach(message => {
                            addMessage(message)
                        })
                        setCurrentLevel(selectedOption)
                    } else {
                        // The provided option doesn't have the 'options' property
                        addMessage({text: currentLevel[option].pregunta, sender: 'bot'})
                        addMessage({text: currentLevel[option].respuesta, sender: 'bot'})
                    }
                }
            } else if (regex.test(option)) {
                if (currentLevel.hasOwnProperty('code'))
                    currentLevel.code(option)
            } else
                addMessage({ text: 'Opción inválida. Por favor escriba una de las opcines dadas.', sender: 'bot'});
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