import { useEffect, useRef, useState } from 'react';
import { addDays, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, addMonths, format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Button, Modal  } from 'antd';
import { saveAs } from 'file-saver';
import download from 'downloadjs';


import './cancel-work-day.css';

import { cancelWorkDay } from '../../../../services/calendarService';

export default function CancelWorkDay() {

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
        const currentDate = new Date();
        return (
            format(date, 'yyyy-MM-dd') === format(currentDate, 'yyyy-MM-dd') &&
            format(date, 'MM-yyyy') === format(currentDate, 'MM-yyyy')
        );
    };

    // TO DETERMINE WHAT DAYS DON'T BELONG TO THE CURRENT MONTH
    const isCurrentMonth = (date) => {
        return format(date, 'MM-yyyy') === format(currentDate, 'MM-yyyy');
    };

    // TO DETERMINE IF THE DAY IS SUNDAY
    const isSunday = (date) => {
        return format(date, 'EEEE') === 'Sunday'
    }

    const isDisabledDate = (date) => {
        const allowedDate = addDays(new Date(), 2)
        const formattedDate = format(date, 'yyyy-MM-dd');
        const formattedCurrentDate = format(allowedDate, 'yyyy-MM-dd');
        return (!isCurrentMonth(date) || formattedDate < formattedCurrentDate) || isSunday(date);
    };






    // TO HANDLE DAY CANCELATION MODAL ***********************************************************
    const [isCancelationModalOpen, setIsCancelationModalOpen] = useState(false);
    const [selectedDay, setSelectedDay] = useState(null);


    const showCancelationModal = (day) => {
        setSelectedDay(format(day, 'dd/MM/yyyy'))
        setTimeout(() => {
            console.log('day: ', selectedDay)
            setIsCancelationModalOpen(true);
        }, 50)
        
    };  
    
    //const [pdf, setPDF] = useState(null)
    // {format(selectedDay, 'dd/MM/yyyy')}
    const cancelDay = async () => {
        console.log(selectedDay)
        setLoading(true);
        try {
            const response = await cancelWorkDay(selectedDay); // Call the create function from userService.js
            console.log('Response:', response);
            if (response.headers['content-type'] === 'application/pdf') {

                const blob = new Blob([response.data], { type: 'application/pdf' });
                saveAs(blob, 'document.pdf');

            } else {
                // Handle non-PDF response
                console.error('Response is not a PDF:', response);
                // Handle error if needed
            }
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
                <span>{format(currentDate, 'MMMM yyyy', {locale: es})}</span>
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
                                    {format(day, 'dd')}
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            <Modal title="Cancelar dia laboral" centered open={isCancelationModalOpen} onCancel={statusCancelationModalCancel} footer=
                {<>
                    <Button key="cancel" onClick={statusCancelationModalCancel}>
                        Cancelar
                    </Button>
                    <Button key="action" type="primary" danger loading={loading} onClick={cancelDay}>
                        Cancelar agenda
                    </Button>
                </>}
            >
                <p className='confirmation'>¿Está seguro que desea cancelar la agenda del día {selectedDay}?</p>
            </Modal>
        </div>
    )
}