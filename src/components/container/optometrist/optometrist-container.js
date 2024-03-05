import {useEffect, useRef, useState} from 'react';

import { BookOutlined, CalendarOutlined, SolutionOutlined } from '@ant-design/icons';
import { Avatar, Menu } from 'antd';
import { Link, Outlet, useNavigate } from "react-router-dom";

import './optometrist-container.css';

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
    getItem(<Link to="/optometra/agenda">Agenda</Link>, '1', <BookOutlined />),
    {
        type: 'divider',
    },
    getItem(<Link to="/optometra/consultar-paciente">Consultar</Link>, '2', <SolutionOutlined style={{ fontsize: '50px'}}/>),
    {
        type: 'divider',
    }
];

const dropdownOptions = [
    {
        key: '1',
        label: 'Cerrar sesión'
    },
];

export default function Optometrist() {

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
            id="optometrist" 
            className="optometrist" 
            ref={ref}
        >
            <div className='opt-header'>
                <div className='profile-pic'>
                    <Avatar size={64} src={image} />
                    
                </div>
                <div className='employee-data'>
                    <div>{user?.name} {user?.surname}</div>
                </div>
            </div>
            <div className='content-optometrist'>
                <div className='menu'>
                    <div>
                        <Menu
                            defaultSelectedKeys={['1']}
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

/*
<Dropdown menu={{dropdownOptions}}>
                        <Space>
                            
                        </Space>
                    </Dropdown>
*/