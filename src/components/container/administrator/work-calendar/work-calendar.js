import { useEffect, useRef, useState } from 'react';
import { Button, Select, Transfer } from 'antd';


import './work-calendar.css';

import { durations, days } from '../../../../constants/constants';
import { getOptometrists } from '../../../../services/optometristService';


const initialTargetDays = days.filter((item) => Number(item.key) > 5).map((item) => item.key);

export default function WorkCalendar() {

    // TO DEFINE THE SIZE OF THE COMPONENT ***********************************************************
    const ref = useRef(null);
    const [height, setHeight] = useState(0);
    const [width, setWidth] = useState(0);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setHeight(ref.current.offsetHeight);
        setWidth(ref.current.offsetWidth);
        fetchOptometrists();
    }, [])





    // TO FETCH OPTOMETRIST DATA WHEN COMPONENT IS LOADED FOR THE FIRST TIME ***********************************************************
    const [optometristsData, setOptometristsData] = useState(null);
    const fetchOptometrists = async () => {
        try {
            const response = await getOptometrists(); // Call the create function from admin Service.js
            setOptometristsData(response.data)
            //console.log('optometrists:', optometristsData);

        } catch (error) {
            console.error('Error en la solicitud:', error);
            
        } finally {
            setLoading(false);
            
        }
    }




    

    /* Controls for Select menu */
    const handleChangeOptometrist = (selection) => {
        console.log("Seleccionado: ", selection)
    };

    const selectOptometristOptions = optometristsData?.map((optometra) => ({
        label: optometra.usuario.nombre + " " + optometra.usuario.apellido,
        value: optometra.usuario.idusuario,
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