import {useEffect, useRef, useState} from 'react';

import { Button } from 'antd';

import './chatbot.css';

import { preguntas } from './chatbot-data';

export default function Chatbot()  {

    const ref = useRef(null);

    const [height, setHeight] = useState(0);
    const [width, setWidth] = useState(0);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        setHeight(ref.current.offsetHeight);
        setWidth(ref.current.offsetWidth);
        
        /*if(localStorage.getItem("user_id") === null)
            navigation("/login")*/
    }, [])


    useEffect(() => {
        setMessages([
            'Bienvenido al Palacio de las Gafas. ¿En qué podemos ayudarle?',
            '1. Preguntas frecuentes',
            '2. Citas de optometría'
        ]);
    }, [])

    

    const decisionTree = {
        '1': {
            text: 'Preguntas frecuentes',
            options: {}
        },
        '2': {
            text: 'Citas de optometría',
            options: {
                '1': {
                    text: 'Agendar cita',
                    action: () => {
                        console.log('text: ', 'Agendar cita')
                    }
                },
                '2': {
                    text: 'Verificar detalles de cita',
                    action: () => {
                        console.log('text: ', 'Verificar detalles de cita')
                    }
                },
                '3': {
                    text: 'Cancelar cita',
                    action: () => {
                        console.log('text: ', 'Cancelar cita')
                    }
                },
                '4': {
                    text: 'Menú principal',
                    action: () => {
                        console.log('text: ', 'Menú principal')
                    }
                }
            }
        }
    }



    const handleUserInput = (option) => {
        const userMessage = `${option}`;
        setMessages(prevMessages => [...prevMessages, { text: userMessage, type: 'user' }]);

        const selectedOption = decisionTree[option];
        if (selectedOption) {
            setMessages(prevMessages => [...prevMessages, selectedOption.text]);
            if (selectedOption.options) {
                const subMenuOptions = Object.keys(selectedOption.options).map(key => {
                    const subOption = selectedOption.options[key];
                    return `${key}. ${subOption.text}`;
                });
                setMessages(prevMessages => [...prevMessages, ...subMenuOptions]);
            } else if (selectedOption.action) {
                selectedOption.action();
            }
        } else {
            setMessages(prevMessages => [...prevMessages, 'Opción inválida. Por favor, intente de nuevo.']);
        }
    };


    return (
        <div className='chat-container' ref={ref}>
            <div className='chat'>
                <div className='chat-header'>
                    <h2>Chat</h2>
                </div>
                <div className='message-box'>
                    {messages.map((message, index) => (
                        <div key={index} className='bot-message'>{message}</div>
                    ))}
                </div>
                
                <div className='text-box'>
                    <input type="text" id="option" name="option" placeholder='Clic aqui. Digite el número que corresponda con la opción dada.'/>
                    <Button onClick={() => {
                        const option = document.getElementById('option').value.trim();
                        handleUserInput(option);
                        document.getElementById('option').value = '';
                    }}>Enviar</Button>
                    
                </div>
            </div>
        </div>
    );
}