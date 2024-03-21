import { useEffect, useRef, useState } from 'react';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, addMonths, format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Button, Modal  } from 'antd';
import { getAppointmentsDuration, createAppointment } from '../../../../services/appointmentService';

import './appointment-management.css';

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






    // TO HANDLE DAY SELECTION MODAL ***********************************************************
    const [isDaySelectionModalOpen, setIsDaySelectionModalOpen] = useState(false);
    const [selectedDay, setSelectedDay] = useState(null);
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        if (selectedDay !== null) {
            setIsDaySelectionModalOpen(true);
        }
    }, [selectedDay]);

    const showAppointmentModal = async (day) =>  {
        
        const selectedDayFormatted = {
            date: format(day, 'dd/MM/yyyy'),
            dayOfWeek: format(day, 'iiii', { locale: es })
        };
    
        const normalizedDayOfWeek = selectedDayFormatted.dayOfWeek.normalize('NFD').replace(/[\u0300-\u036f]/g, '');


        setSelectedDay({
            ...selectedDayFormatted,
            dayOfWeek: normalizedDayOfWeek
        });
    
        // Assuming getAppointmentsDuration is an asynchronous function, await its result
        getAppointmentsDuration(normalizedDayOfWeek)
            .then(duration => {
                setAppointments(generateAppointments("9:00", duration.data, (600/duration.data)-1))
            })
            .catch(error => {
                console.error('Error while getting appointments duration:', error);
                // Handle error if needed
            })
            
    }; 
    
    const statusDaySelectionModalCancel = () => {
        setIsDaySelectionModalOpen(false);
    };






    // TO CONFIRM DATE AND TIME
    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
    const [selectedTime, setSelectedTime] = useState(null);

    useEffect(() => {
        if (selectedTime !== null) {
            setIsConfirmationModalOpen(true);
        }
    }, [selectedTime]);

    const showConfirmationModal = async (time) =>  {
        setSelectedTime(time)
        console.log("selectedTime: ", selectedTime)
    };  
    






    // TO SCHEDULE APPOINTMENT ON GIVE DATE AND TIME
    const scheduleAppointment = async (date, time) => {
        const cita = {
            fecha: date,
            hora: time,
            idpaciente: localStorage.getItem('user').idpaciente,
            nombre: JSON.parse(localStorage.getItem('user')).nombre + ' ' + JSON.parse(localStorage.getItem('user')).surname,
            telefono: localStorage.getItem('user').telefono
        }
        console.log('cita: ', cita)
        setLoading(true);
        try {
            // console.log("date: ", date)
            // console.log("time: ", time)
            const response = await createAppointment(cita); // Call the create function from userService.js
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
            setIsDaySelectionModalOpen(false);
            setIsConfirmationModalOpen(false);
        }, 2000);
    };
    
    const statusConfirmationModalCancel = () => {
        setIsConfirmationModalOpen(false);
    };







    // TO ADD "duration" TO THE START TIME
    const addMinutesToTime = (timeString, minutesToAdd) => {
        const [hours, minutes] = timeString.split(':');
        let time = new Date();
        time.setHours(parseInt(hours));
        time.setMinutes(parseInt(minutes) + minutesToAdd);
        
        const newHours = time.getHours();
        const newMinutes = time.getMinutes();
      
        return `${newHours < 10 ? '0' + newHours : newHours}:${newMinutes < 10 ? '0' + newMinutes : newMinutes}`;
    }

    const  generateAppointments = (startTime, duration, numberOfAppointments) => {
        const appointments = [startTime];
        let currentAppointment = startTime;
        for (let i = 0; i < numberOfAppointments; i++) {
          currentAppointment = addMinutesToTime(currentAppointment, duration);
          appointments.push(currentAppointment);
        }
        return appointments;
    }







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
                                onClick={() => showAppointmentModal(day)}
                            >
                                    <div>{format(day, 'dd')}</div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            <Modal width={'100%'} title={`Agendar cita de optometría. (${selectedDay?.dayOfWeek} - ${selectedDay?.date})`} centered open={isDaySelectionModalOpen} onCancel={statusDaySelectionModalCancel} footer=
                {<>
                    <Button key="cancel" onClick={statusDaySelectionModalCancel}>
                        Cancelar
                    </Button>
                </>}
            >
                <p className='confirmation'>Elija la hora de su cita.</p>
                <div className='time-table'>
                    {appointments.map((appointment, index) => (
                        <div key={index} className='time' onClick={() => showConfirmationModal(appointment)}>
                            <div>{appointment}</div>
                        </div>
                    ))}
                </div>
            </Modal>





            <Modal width={'50%'} title={`Confirmar cita`} centered open={isConfirmationModalOpen   } onCancel={statusConfirmationModalCancel} footer=
                {<>
                    <Button key="cancel" onClick={statusConfirmationModalCancel}>
                        Cancelar
                    </Button>
                    <Button key="schedule" type="primary"  onClick={() => scheduleAppointment(selectedDay?.date, selectedTime)}>
                        Confirmar
                    </Button>
                </>}
            >
                <p className='confirmation'>¿Está seguro que desea agendar su cita de optometria?</p>
                <p>Fecha: {selectedDay?.dayOfWeek} {selectedDay?.date}</p>
                <p>Hora: {selectedTime}</p>
            </Modal>
        </div>
    )
}