import { useEffect, useRef, useState } from 'react';
import { Button, Form, Select, Transfer } from 'antd';


import './work-calendar.css';

import { durations, days } from '../../../../constants/constants';
import { getOptometrists } from '../../../../services/optometristService';
import { createCalendar } from '../../../../services/calendarService';


const initialTargetDays = [];

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
            console.log(response.data)
            //console.log('optometrists:', optometristsData);

        } catch (error) {
            console.error('Error en la solicitud:', error);
            
        } finally {
            setLoading(false);
            
        }
    }




    

    // TO HANDLE THE OPTOMETRIST SELECTION FROM THE DROPDOWN LIST
    const [selectedOptometrist, setSelectedOptometrist] = useState(null)
    const handleChangeOptometrist = (selection) => {
        setSelectedOptometrist(selection)
        console.log("Seleccionado: ", selection)
    };

    const selectOptometristOptions = optometristsData?.map((optometra) => ({
        label: optometra.usuario.nombre + " " + optometra.usuario.apellido,
        value: optometra.usuario.idusuario
    }));







    // TO HANDLE THE TRANSFER MENU (DAYS) 

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

    




    /* TO HANDLE DURATION SELECTION */
    const [selectedDuration, setSelectedDuration] = useState(null);
    const handleChangeDuration = (selection) => {
        setSelectedDuration(selection)
    };

    const selectDurationOptions = durations.map((duration) => ({
        label: duration.duration,
        value: duration.key,
    }));





    // TO HANDLE FORM CHANGES
    const [isCreationFormComplete, setIsCreationFormComplete] = useState(false);
    const onCreationValuesChange = (_, allValues) => {
        const isComplete = Object.values(allValues).every(value => !!value);
        setIsCreationFormComplete(isComplete);
    };

    // TO CREATE A CALENDAR
    const [creationForm] = Form.useForm();
    const CreateCalendar = async () => {
        const diasatencion = days.filter(item => targetDays.includes(item.key))
            .map(item => item.day)
            .join(".")


        try {
            const response = await createCalendar(selectedOptometrist, diasatencion, selectedDuration);
            setLoading(true);
        } catch (error) {
            console.error('Error en la solicitud:', error);
        } finally {
            fetchOptometrists();
            setLoading(true);
            setTimeout(() => {
                setLoading(false);
            }, 2000);
        }
    }







    // HTML TEMPLATE
    return (
        <div className='work-calendar' ref={ref}>
            <h3>Seleccione un optómetra</h3>
            <Form
                    className='creation-form'
                    initialValues={{ remember: false }}
                    form={creationForm}
                    name="calendar-creation"
                    onFinish={CreateCalendar}
                    onValuesChange={onCreationValuesChange}
            >
                <Select size={'large'} defaultValue="Seleccione un optómetra" onChange={handleChangeOptometrist} options={selectOptometristOptions} />

                <Transfer
                        dataSource={days}
                        titles={['Días disponibles', 'Días a trabajar']}
                        targetKeys={targetDays}
                        selectedKeys={selectedDays}
                        onChange={onChange}
                        onSelectChange={onSelectChange}
                        operations={['Agregar', 'Quitar']}
                        /*onScroll={onScroll}*/
                        render={(item) => item.day}
                    />

                <Select size={'large'} defaultValue="Seleccione una duración" onChange={handleChangeDuration} options={selectDurationOptions} />

                <Button type="primary" onClick={() => CreateCalendar()} disabled={!isCreationFormComplete} htmlType='submit'>
                    Crear calendario
                </Button>

            </Form>
        </div>
    )
}