import {useEffect, useRef, useState, useContext} from 'react';

import { BookOutlined, CalendarOutlined, CaretDownOutlined, HistoryOutlined, MinusCircleOutlined, QuestionOutlined, SolutionOutlined } from '@ant-design/icons';
import { Button, Menu } from 'antd';
import { Link, Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../auth/context/AuthContext";
import FeedbackMessage from '../common/feedback-message/feedback-message';

import './admin-container.css';

function getItem(label, key, icon, children, type) {
    return {
      key,
      icon,
      children,
      label,
      type,
    };
}

const items = [
    getItem(<Link to="/administrador/gestion-optometras">Gestión de optómetras</Link>, '1', <SolutionOutlined style={{ fontsize: '50px'}}/>),
    {
        type: 'divider'
    },
    getItem(<Link to="/administrador/calendario-laboral">Gestionar calendarios laborales</Link>, '2', <CalendarOutlined />),
    {
        type: 'divider'
    },
    getItem(<Link to="/administrador/cancelar-dia">Cancelar dia laboral</Link>, '3', <MinusCircleOutlined />),
    {
        type: 'divider'
    },
    getItem(<Link to="/administrador/gestion-preguntas">Gestionar preguntas frecuentes</Link>, '4', <QuestionOutlined/>),
    {
        type: 'divider'
    },
    getItem(<Link to="/administrador/reportes">Reportes</Link>, '5', <BookOutlined />),
    {
        type: 'divider'
    },
    getItem(<Link to="/administrador/cambios">Registro de cambios</Link>, '6', <HistoryOutlined />)
];

export default function Admin() {

    const ref = useRef(null);

    const [height, setHeight] = useState(0);
    const [width, setWidth] = useState(0);
    const [openMenu, setOpenMenu] = useState(false)
    const [message, setMessage] = useState({
        visible: false,
        type: '',
        text: ''
    })

    const { handlerLogout } = useContext(AuthContext);

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

    const [user, setUser] = useState(undefined);

    useEffect(() => {
        setHeight(ref.current.offsetHeight);
        setWidth(ref.current.offsetWidth);
        setUser(JSON.parse(localStorage.getItem('user')));
        if(!localStorage.getItem('token')) {
            navigate("/inicio-empleados")
        }
    }, [navigate])

    const logout = () => {
        try {
            handlerLogout()
            if (!localStorage.getItem('token')) {
                setOpenMenu(false)
                navigate('/inicio-empleados')
            }
                
        } catch (error) {
            showMessage(
                'error',
                `Ocurrió un error al intentar cerrar sesión. ${error}.`
            )
        }
    }


    return (
        <div id="administrator" className="administrator" ref={ref}>
            <FeedbackMessage visible={message?.visible} type={message?.type} text={message?.text} onClose={() => hideMessage()}>
            </FeedbackMessage>
            <div className='header'>
                <div className='employee-data'>
                    <div>{user?.name} {user?.surname}</div>
                    <div className='menu-container'>
                        <Button icon={<CaretDownOutlined />} size={'medium'} onClick={() => setOpenMenu(!openMenu)}/>
                        {openMenu &&
                            <div className='collapse-menu'>
                                <div onClick={() => logout()}>
                                    Cerrar sesión
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
            <div className='content-admin'>
                <div className='menu'>
                    <div>
                        <Menu
                            defaultSelectedKeys={'1'}
                            mode="inline"
                            theme="light"
                            items={items}
                        />
                    </div>
                </div>
                <div className='selection'>
                    <Outlet/>
                </div>
            </div>
            
        </div>
    );

}