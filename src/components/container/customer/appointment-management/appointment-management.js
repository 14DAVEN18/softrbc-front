import { useEffect, useRef, useState } from 'react';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, addMonths, format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Button, Modal  } from 'antd';
import { getAppointmentsDuration } from '../../../../services/appointmentService';

import './appointment-management.css';

import { cancelWorkDay } from '../../../../services/calendarService';

import { appointments } from './appointment-data';

export default function AppointmentManagement() {

    const ref = useRef(null);
    const [height, setHeight] = useState(0);
    const [width, setWidth] = useState(0);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setHeight(ref.current.offsetHeight);
        setWidth(ref.current.offsetWidth);
    }, [])

    // HEADER OF THE CALENDAR ***********************************************************
    const weekDays = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];





    // LOGIC TO GET DAYS OF THE MONTH TO FILL THE CALENDAR GRID *****************************************************
    const [currentDate, setCurrentDate] = useState(new Date());

    const getDaysInMonth = (date) => {
        const start = startOfWeek(startOfMonth(date), { weekStartsOn: 1 });
        const end = endOfWeek(endOfMonth(date), { weekStartsOn: 1 });
        return eachDayOfInterval({ start, end });
    };

    const handlePrevMonth = () => {
        setCurrentDate(prevDate => addMonths(prevDate, -1));
    };

    const handleNextMonth = () => {
        setCurrentDate(prevDate => addMonths(prevDate, 1));
    };

    const daysInMonth = getDaysInMonth(currentDate);





    // ARRAY TO POPULATE THE CALENDAR IN ROWS
    const daysInMonthRows = [];
    for (let i = 0; i < daysInMonth.length; i += 7) {
        daysInMonthRows.push(daysInMonth.slice(i, i + 7));
    }






    // TO DETERMINE WHICH DAY IS THE CURRENT DAY
    const isCurrentDate = (date) => {
        return format(date, 'yyyy-MM-dd') === format(currentDate, 'yyyy-MM-dd');
    };







    // TO DETERMINE WHAT DAYS DON'T BELONG TO THE CURRENT MONTH
    const isCurrentMonth = (date) => {
        return format(date, 'MM-yyyy') === format(currentDate, 'MM-yyyy');
    };

    const isDisabledDate = (date) => {
        return !isCurrentMonth(date);
    };






    // TO HANDLE DAY CANCELATION MODAL ***********************************************************
    const [isCancelationModalOpen, setIsCancelationModalOpen] = useState(false);
    const [selectedDay, setSelectedDay] = useState(null);

    useEffect(() => {
        if (selectedDay !== null) {
            console.log("selectedDay: ", selectedDay)
            setIsCancelationModalOpen(true);
        }
    }, [selectedDay]);

    const showCancelationModal = async (day) =>  {
        
        const selectedDayFormatted = {
            date: format(day, 'dd/MM/yyyy'),
            dayOfWeek: format(day, 'iiii', { locale: es })
        };
    
        setSelectedDay(selectedDayFormatted);
        console.log(selectedDayFormatted.dayOfWeek); // Logging the day of the week immediately after setting it
    
        // Assuming getAppointmentsDuration is an asynchronous function, await its result
        getAppointmentsDuration(selectedDayFormatted.dayOfWeek)
            .then(duration => {
                // Handle the duration if needed
            })
            .catch(error => {
                console.error('Error while getting appointments duration:', error);
                // Handle error if needed
            });
    };  
    
    // {format(selectedDay, 'dd/MM/yyyy')}
    const cancelDay = async () => {
        setLoading(true);
        try {
            const response = await cancelWorkDay(selectedDay); // Call the create function from userService.js
            //console.log('Response:', response.data);
            // Handle success if needed
        } catch (error) {
            console.error('Error en la solicitud:', error);
            // Handle error if needed
        } finally {
            setLoading(false);
            // Handle modal state changes here if needed
        }
        
        setTimeout(() => {
            setLoading(false);
            setIsCancelationModalOpen(false);
        }, 2000);
    };
    
    const statusCancelationModalCancel = () => {
        setIsCancelationModalOpen(false);
    };







    // HTML TEMPLATE
    return (
        <div className='cancel-day' ref={ref}>
            <div className='calendar-action'>
                <Button onClick={handlePrevMonth} size='large'>Mes anterior</Button>
                <span>{format(currentDate, 'MMMM yyyy')}</span>
                <Button onClick={handleNextMonth} size='large'>Mes siguiente</Button>
            </div>
            <div className='calendar'>
                <div className= 'calendar-header-row'>
                    {weekDays.map((day, index) => (
                        <div key={index} className='day-header'>{day}</div>
                    ))}
                </div>
                
                {daysInMonthRows.map((row, rowIndex) => (
                    <div key={rowIndex} className='calendar-row'>
                        {row.map((day, dayIndex) => (
                            <div 
                                key={dayIndex}
                                className={
                                    `day ${isCurrentDate(day) ? 'current-date' : ''}
                                    ${isDisabledDate(day) ? 'disabled-date' : ''}`
                                }
                                onClick={() => showCancelationModal(day)}
                            >
                                    <div>{format(day, 'dd')}</div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            <Modal width={'100%'} title="Cancelar dia laboral" centered open={isCancelationModalOpen} onCancel={statusCancelationModalCancel} footer=
                {<>
                    <Button key="cancel" onClick={statusCancelationModalCancel}>
                        Cancelar
                    </Button>
                    <Button key="action" type="primary" danger loading={loading} onClick={cancelDay}>
                        Cancelar agenda
                    </Button>
                </>}
            >
                <p className='confirmation'>Elija la hora de su cita.</p>

            </Modal>
        </div>
    )
}