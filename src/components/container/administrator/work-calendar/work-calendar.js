import { useEffect, useRef, useState } from 'react';
import { Button, Form, Input, InputNumber, Modal, Select, Space, Table, Transfer } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, LockOutlined, IdcardOutlined } from '@ant-design/icons';

import axios from "axios";
import { CREATE_USER } from '../../../../constants/constants';
import { Link, useNavigate } from "react-router-dom";

import './work-calendar.css';

import { data } from '../optometrist-management/data';
import { durations, days } from '../../../../constants/constants';


const initialTargetDays = days.filter((item) => Number(item.key) > 5).map((item) => item.key);

export default function WorkCalendar() {

    // TO DEFINE THE SIZE OF THE COMPONENT ***********************************************************
    const ref = useRef(null);
    const [height, setHeight] = useState(0);
    const [width, setWidth] = useState(0);

    useEffect(() => {
        setHeight(ref.current.offsetHeight);
        setWidth(ref.current.offsetWidth);
    }, [])




    

    /* Controls for Select menu */
    const handleChangeOptometrist = (selection) => {
        console.log("Seleccionado: ", selection)
    };

    const selectOptometristOptions = data.map((optometra) => ({
        label: optometra.nombre + " " + optometra.apellido,
        value: optometra.key,
    }));

    /* Controls for Transfer menu */

    const [targetDays, setTargetDays] = useState(initialTargetDays);
    const [selectedDays, setSelectedDays] = useState([]);
    const onChange = (nextTargetDays, direction, moveDays) => {
        console.log('targetKeys:', nextTargetDays);
        console.log('direction:', direction);
        console.log('moveKeys:', moveDays);
        setTargetDays(nextTargetDays);
    };
  
    const onSelectChange = (sourceSelectedDays, targetSelectedDays) => {
        console.log('sourceSelectedKeys:', sourceSelectedDays);
        console.log('targetSelectedKeys:', targetSelectedDays);
        setSelectedDays([...sourceSelectedDays, ...targetSelectedDays]);
    };

    useEffect(() => {
        console.log('Selected days: ', selectedDays);
    }, [selectedDays]);

    

    /* Controls for Select menu */
    const handleChangeDuration = (selection) => {
        console.log("Seleccionado: ", selection)
    };

    const selectDurationOptions = durations.map((duration) => ({
        label: duration.duration,
        value: duration.key,
    }));

    /* Save calendar */
    const CreateCalendar = () => {

    }

    return (
        <div className='work-calendar' ref={ref}>
            <h3>Seleccione un optómetra</h3>
            <div className='optometrist-selection'>
                <Select size={'large'} defaultValue="Seleccione un optómetra" onChange={handleChangeOptometrist} options={selectOptometristOptions} />
            </div>

            <div className='day-selection'>
                <Transfer
                    dataSource={days}
                    titles={['Días disponibles', 'Días seleccionados']}
                    targetKeys={targetDays}
                    selectedKeys={selectedDays}
                    onChange={onChange}
                    onSelectChange={onSelectChange}
                    operations={['Agregar', 'Quitar']}
                    /*onScroll={onScroll}*/
                    render={(item) => item.day}
                />
            </div>

            <div className='duration-selection'>
                <Select size={'large'} defaultValue="Seleccione una duración" onChange={handleChangeDuration} options={selectDurationOptions} />
            </div>
            <div className='calendar-button'>
                <Button type="primary" onClick={() => CreateCalendar()} htmlType='submit'>
                    Crear calendario
                </Button>
            </div>
        </div>
    )
}