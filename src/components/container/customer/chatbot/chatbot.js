import { useEffect, useRef, useState} from 'react';
import { useNavigate } from "react-router-dom";

import { Button } from 'antd';

import './chatbot.css';

import Login from '../login/login';
import { getQuestions } from '../../../../services/faqService';

export default function Chatbot()  {

    const navigate = useNavigate();

    const ref = useRef(null);
    const messageBoxRef = useRef(null);

    const [height, setHeight] = useState(0);
    const [width, setWidth] = useState(0);
    const [messages, setMessages] = useState([
        { text: 'Bienvenido al Palacio de las Gafas. Digite el número de opción que corresponda para navegar.', sender: 'bot' },
        { text: 'Puede digitar 0 en cualquier momento si desea retornar al menú principal.', sender: 'bot' },
        { text: '¿En qué podemos ayudarle?', sender: 'bot' },
        { text: '1. Preguntas frecuentes', sender: 'bot' },
        { text: '2. Citas de optometría', sender: 'bot' }
    ]);
    const [displayLogin, setDisplayLogin] = useState(false);

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
    const [decisionTree, setDecisionTree] = useState(null)
    

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
                                action: () => {
                                    console.log('text: ', 'Verificar detalles de cita')
                                }
                            },
                            '3': {
                                authRequired: true,
                                text: 'Cancelar cita',
                                action: () => {
                                    console.log('text: ', 'Cancelar cita')
                                }
                            }
                        }
                    }
                };

                
                // Set questionsData and decisionTree state
                setCurrentLevel(initialDecisionTree);
                setDecisionTree(initialDecisionTree)
            } catch (error) {
                console.error('Error en la solicitud:', error);
            }
        };

        // Call fetchDataAndConstructTree when component mounts
        fetchDataAndConstructTree();
    }, []);






    const [currentLevel, setCurrentLevel] = useState(decisionTree);
    

    const handleLogin = () => {
        const user = JSON.parse(localStorage.getItem('user'))
        console.log(localStorage.getItem('user'))
        setDisplayLogin(false);
        setMessages(prevMessages => [...prevMessages, { text: `Ha iniciado sesión correctamente. En breve será redirigido a la página de agendamiento.`, sender: 'bot' }]);
        setTimeout(() => {
            navigate('/cliente/agendamiento')
        }, 5000)
    };







    const handleUserInput = async (option) => {
        if (option === '0') {
            setCurrentLevel(decisionTree)
            setMessages([
                { text: 'Bienvenido al Palacio de las Gafas. Digite el número de opción que corresponda para navegar.', sender: 'bot' },
                { text: 'Puede digitar 0 en cualquier momento si desea retornar al menú principal.', sender: 'bot' },
                { text: '¿En qué podemos ayudarle?', sender: 'bot' },
                { text: '1. Preguntas frecuentes', sender: 'bot' },
                { text: '2. Citas de optometría', sender: 'bot' }
            ]);
        } else {
            console.log("initial currentLevel: ", currentLevel);
            const userMessage = `${option}`;
            
            
            setMessages(prevMessages => [...prevMessages, { text: userMessage, sender: 'user' }]);
            if (currentLevel.hasOwnProperty(option)) {
                const selectedOption = currentLevel[option];
                
                
                if(selectedOption.hasOwnProperty('pregunta')) {

                    setMessages(prevMessages => [...prevMessages, { text: selectedOption.pregunta, sender: 'bot' }])
                    setMessages(prevMessages => [...prevMessages, { text: selectedOption.respuesta, sender: 'bot' }])
                    setMessages(prevMessages => [...prevMessages, { text: '0. Menpu principal '}])

                } else
                    setMessages(prevMessages => [...prevMessages, { text: selectedOption.text, sender: 'bot' }])
        
                // Check if the selected option requires authentication
                if (selectedOption.authRequired && !localStorage.getItem("token")) {
                    setMessages(prevMessages => [...prevMessages, { text: 'Para gestionar citas de optometría debe primero iniciar sesión.', sender: 'bot' }]);
                    setMessages(prevMessages => [...prevMessages, { text: 'En unos segundos el sistema le pedirá sus credenciales de inicio de sesión.', sender: 'bot' }]);
                    
                    setTimeout(() => {
                        // No hace nada
                    }, 5000)

                    let countDown = 4;
                    const countDownInterval = setInterval(() => {
                        if (countDown === 1) {
                            clearInterval(countDownInterval)
                            setDisplayLogin(true)
                        } else {
                            setMessages(prevMessages => [...prevMessages, { text: `${countDown} segundo(s)`, sender: 'bot' }]);
                            countDown--;
                        }
                    }, 1000)

                } else if (selectedOption.hasOwnProperty('options')) {

                    if (selectedOption.options) {

                        const optionsTexts = Object.keys(selectedOption.options).map(key => {
                            if(selectedOption.options[key].hasOwnProperty('pregunta'))
                                return { text: `${key}. ${selectedOption.options[key].pregunta}`, sender: 'bot' }
                            else 
                                return { text: `${key}. ${selectedOption.options[key].text}`, sender: 'bot' }
                        });

                        setMessages(prevMessages => [...prevMessages, ...optionsTexts]);
                        setCurrentLevel(selectedOption.options);

                    } else
                        console.error('selectedOption.options is not available');

                } else if (selectedOption.hasOwnProperty('action'))
                    selectedOption.action();
            } else
                setMessages(prevMessages => [...prevMessages, { text: 'Opción inválida. Por favor intente de nuevo.', sender: 'bot' }]);
        }
    };
    





    return (
        <div className='chat-container' ref={ref}>
            <div className='chat'>
                <div className='chat-header'>
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
                    <input disabled={displayLogin} type="text" id="option" name="option" autoComplete='off' placeholder='Clic aqui. Digite el número que corresponda con la opción dada.'/>
                    <Button disabled={displayLogin} onClick={() => {
                        const option = document.getElementById('option').value.trim();
                        handleUserInput(option);
                        document.getElementById('option').value = '';
                    }}>Enviar</Button>
                </div>
            </div>
        </div>
    );
}