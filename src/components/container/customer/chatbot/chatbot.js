import {useEffect, useRef, useState} from 'react';

import { Button } from 'antd';

import './chatbot.css';

export default function Chatbot() {

    const ref = useRef(null);

    const [height, setHeight] = useState(0);
    const [width, setWidth] = useState(0);

    useEffect(() => {
        setHeight(ref.current.offsetHeight);
        setWidth(ref.current.offsetWidth);
        setMessages([
            'Bienvenido al Palacio de las Gafas. ¿En qué podemos ayudarle?',
            '1. Preguntas frecuentes\n2. Citas de optometría'
        ]);
        /*if(localStorage.getItem("user_id") === null)
            navigation("/login")*/
    }, [])

    const [messages, setMessages] = useState([]);

    const handleSendMessage = (option) => {
        // Handle sending message based on selected option
        switch (option) {
            case '1':
                // Handle FAQs option
                setMessages(prevMessages => [...prevMessages, 'Display list of FAQs']);
                break;
            case '2':
                // Handle Appointments option
                setMessages(prevMessages => [...prevMessages, 'Ask for appointment details']);
                break;
            default:
                setMessages(prevMessages => [...prevMessages, 'Invalid option. Please try again.']);
                break;
        }
    };

    return (
        <div className='chat-container' ref={ref}>
            <div className='chat'>
                <div className='chat-header'>
                    <h2>Chat</h2>
                </div>
                <div className='message-box'>
                    {/* Display chat messages */}
                    {messages.map((message, index) => (
                        <div key={index} className='bot-message'>{message}</div>
                    ))}
                </div>
                
                <div className='text-box'>
                    <input type="text" id="option" name="option" placeholder='Clic aqui. Digite el número que corresponda con la opción dada.'/>
                    <Button onClick={() => {
                        const option = document.getElementById('option').value.trim();
                        handleSendMessage(option);
                        document.getElementById('option').value = '';
                    }}>Enviar</Button>
                    
                </div>
            </div>
        </div>
    );
}