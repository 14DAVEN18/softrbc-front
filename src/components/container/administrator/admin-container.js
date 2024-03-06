import {useEffect, useRef, useState} from 'react';

import { BookOutlined, CalendarOutlined, HistoryOutlined, MinusCircleOutlined, QuestionOutlined, SolutionOutlined } from '@ant-design/icons';
import { Avatar, Menu } from 'antd';
import { Link, Outlet, useNavigate } from "react-router-dom";

import './admin-container.css';

import image from '../../../profile_photos/Watermark.png';

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

const dropdownOptions = [
    {
        key: '1',
        label: 'Cerrar sesión'
    },
];

export default function Admin() {

    const ref = useRef(null);

    const [height, setHeight] = useState(0);
    const [width, setWidth] = useState(0);

    //const navigation = useNavigate();

    const [user, setUser] = useState(undefined);

    useEffect(() => {
        setHeight(ref.current.offsetHeight);
        setWidth(ref.current.offsetWidth);
        setUser(JSON.parse(localStorage.getItem('user')));
        /*if(localStorage.getItem("user_id") === null)
            navigation("/login")*/
    }, [])


    return (
        <div 
            id="administrator" 
            className="administrator" 
            ref={ref}
        >
            <div className='header'>
                <div className='profile-pic'>
                    <Avatar size={64} src={image} />
                    
                </div>
                <div className='employee-data'>
                    <div>{user?.name} {user?.surname}</div>
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