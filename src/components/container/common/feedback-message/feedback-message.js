// React imports
import React from 'react';

// External components / libraries
import { Divider } from 'antd';

// Styles
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