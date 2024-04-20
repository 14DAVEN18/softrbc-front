import React from 'react';
import { Divider } from 'antd';

import './feedback-message.css'

const FeedbackMessage = ({ visible, type, text, onClose }) => {

    const handleContainerClick = () => {
        onClose();
    };

    return (
        <>
        {visible &&
            <div className={`message-container ${type} `} onClick={handleContainerClick}>
                <p>{text}</p>
                <Divider/>
                <span>Click en el mensaje para cerrar</span>
            </div>
        } 
        </> 
    );
};

export default FeedbackMessage;