// React imports
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// External components / libraries
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, addMonths, format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Button, Modal  } from 'antd';

// Self created components
import FeedbackMessage from '../../common/feedback-message/feedback-message';

// Self created services
import { getAppointmentsDuration, getAppointments, createAppointment } from '../../../../services/appointmentService';
import { getDaysOptometrist } from '../../../../services/calendarService';

// Styles
import './appointment-management.css';

export default function AppointmentManagement() {

    const ref = useRef(null);
    const [height, setHeight] = useState(0);
    const [width, setWidth] = useState(0);

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()
    const [message, setMessage] = useState({
        visible: false,
        type: '',
        text: ''
    })
    const [workDays, setWorkDays] = useState([])

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

    

    useEffect(() => {

        const fecthWorkdays = async ()  => {
            try {
                const response = await getDaysOptometrist()
                const newWorkDays = response.data
                    .flatMap(calendar => calendar.split('.'));
                    setWorkDays(prevWorkDays => [
                        ...prevWorkDays,
                        ...newWorkDays
                    ])
            } catch (error) {
                if (error.response.data.hasOwnProperty('error')) {
                    if (error.response.data.error.toLowerCase().includes('expired')){
                        showMessage(
                            'error',
                            `Su sesión expiró. En breve será redirigido a la página de inicio de sesión.`
                        )
                        setTimeout(() => {
                            localStorage.clear()
                            navigate('/cliente/preguntas')
                        }, 5000)
                    } else if (error.response.data.error.toLowerCase().includes('does not match')) {
                        showMessage(
                            'error',
                            `Su sesión actual no es válida. Debe iniciar sesión de nuevo. En breve será redirigido a la página de inicio de sesión.`
                        )
                        setTimeout(() => {
                            localStorage.clear()
                            navigate('/cliente/preguntas')
                        }, 5000)
                    }
                } else{
                    showMessage(
                        'error',
                        `Ocurrió un error al cargar los días disponibles. ${error.message}`
                    )
                }
            }
        }

        setHeight(ref.current.offsetHeight);
        setWidth(ref.current.offsetWidth);
        if(!localStorage.getItem('token')) {
            navigate("/cliente/preguntas")
        } else {
            fecthWorkdays();   
        }
    }, [navigate])





    // HEADER OF THE CALENDAR ***********************************************************
    const weekDays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];





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
        const currentDate = new Date();
        const formattedDate = format(date, 'yyyy-MM-dd');
        const formattedCurrentDate = format(currentDate, 'yyyy-MM-dd');
        return (!isCurrentMonth(date) || 
                formattedDate < formattedCurrentDate) ||
                isSunday(date) ||
                !workDays.includes(format(date, 'EEEE', { locale: es }).toLowerCase());
    };










    // TO DETERMINE IF A TIME IS EARLIER THAN CURRENT TIME
    const isDisabledTime = (time) => {
        const currentTime = new Date();
        const currentDate = currentTime.getDate();
        const currentHours = currentTime.getHours();
        const currentMinutes = currentTime.getMinutes();
    
        // Parse hours and minutes from the time string
        const [appointmentHours, appointmentMinutes] = time.split(':');
    
        // Extract day, month, and year from selectedDate
        const [day, month, year] = selectedDay.date.split('/');
    
        // Create a new Date object for the appointment time
        const appointmentDateTime = new Date(year, parseInt(month) - 1, parseInt(day), appointmentHours, appointmentMinutes);
    
        // Compare the appointment time with the current time
        if (appointmentDateTime < currentTime || isOccupiedTime(time)) {
            return true; // Appointment time is earlier than current time or is occupied
        } else if (appointmentDateTime.getDate() === currentDate && appointmentDateTime.getHours() === currentHours && appointmentDateTime.getMinutes() < currentMinutes) {
            return true; // Appointment hour is the same as current hour but minutes are earlier
        } else {
            return false; // Appointment time is not earlier than current time and is available
        }
    };






    // TO DETERMINE IF THE TIME BLOCK IS OCCUPIED
    const isOccupiedTime = (time) => {
        if(appointmentTimes.some(appointment => appointment.hora === time))
            return true
        else
            return false
    };






    // TO HANDLE DAY SELECTION MODAL ***********************************************************
    const [isDaySelectionModalOpen, setIsDaySelectionModalOpen] = useState(false);
    const [selectedDay, setSelectedDay] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [appointmentTimes, setAppointmentTimes] = useState([])

    useEffect(() => {
        if (selectedDay !== null) {
            setIsDaySelectionModalOpen(true);
        }
    }, [selectedDay]);

    const fetchAppointments = async (day) => {
        try {
            const response = await getAppointments(day);
            setAppointmentTimes(response.data)
        } catch (error) {
            if (error.response.data.hasOwnProperty('error')) {
                if (error.response.data.error.toLowerCase().includes('expired')){
                    showMessage(
                        'error',
                        `Su sesión expiró. En breve será redirigido a la página de inicio de sesión.`
                    )
                    setTimeout(() => {
                        localStorage.clear()
                        navigate('/cliente/preguntas')
                    }, 5000)
                } else if (error.response.data.error.toLowerCase().includes('does not match')) {
                    showMessage(
                        'error',
                        `Su sesión actual no es válida. Debe iniciar sesión de nuevo. En breve será redirigido a la página de inicio de sesión.`
                    )
                    setTimeout(() => {
                        localStorage.clear()
                        navigate('/cliente/preguntas')
                    }, 5000)
                }
            } else{
                showMessage(
                    'error',
                    `Ocurrió un error al cargar las citas disponibles. ${error.response.data}`
                )
            }
        } finally {
            setLoading(false);
        }
    }

    const fetchAppointmentDuration = async (date) => {
        try {
            const response = await getAppointmentsDuration(date);
            setAppointments(generateAppointments("9:00", response.data, Math.floor((480/response.data))-1))
        } catch (error) {
            showMessage(
                'error',
                `Ocurrió un error al cargar los espacios de citas. ${error.message}`
            )
        } finally {
            setLoading(false);
        }
    }

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

        fetchAppointments(selectedDayFormatted.date);
        fetchAppointmentDuration(normalizedDayOfWeek);
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
    };  
    






    // TO SCHEDULE APPOINTMENT ON GIVE DATE AND TIME
    const scheduleAppointment = async (date, time) => {
        const cita = {
            fecha: date,
            hora: time,
            idpaciente: JSON.parse(localStorage.getItem('user')).idpaciente,
            nombre: JSON.parse(localStorage.getItem('user')).name + ' ' + JSON.parse(localStorage.getItem('user')).surname,
            telefono: JSON.parse(localStorage.getItem('user')).telefono,
            correo: JSON.parse(localStorage.getItem('user')).correo
        }
        
        try {
            setLoading(true);
            const response = await createAppointment(cita);
            if (response.status === 200) {
                showMessage(
                    'success',
                    `La cita se agendó exitosamente. Se envió un correo electrónico con los datos de su cita. En breve será redirigido al chat.`
                )
            }
        } catch (error) {
            if (error.response.data.hasOwnProperty('error')) {
                if (error.response.data.error.toLowerCase().includes('expired')){
                    showMessage(
                        'error',
                        `Su sesión expiró. En breve será redirigido a la página de inicio de sesión.`
                    )
                    setTimeout(() => {
                        localStorage.clear()
                        navigate('/cliente/preguntas')
                    }, 5000)
                } else if (error.response.data.error.toLowerCase().includes('does not match')) {
                    showMessage(
                        'error',
                        `Su sesión actual no es válida. Debe iniciar sesión de nuevo. En breve será redirigido a la página de inicio de sesión.`
                    )
                    setTimeout(() => {
                        localStorage.clear()
                        navigate('/cliente/preguntas')
                    }, 5000)
                }
            } else{
                console.log(error)
                showMessage(
                    'error',
                    `Ocurrió un error al agendar la cita. ${error.response.data}`
                )
            }
        } finally {
            setIsConfirmationModalOpen(false)
            setIsDaySelectionModalOpen(false)
            setLoading(false);
            setTimeout(() => {
                navigate('/cliente/preguntas')
            }, 10000)
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
        console.log(numberOfAppointments)
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
            <FeedbackMessage visible={message?.visible} type={message?.type} text={message?.text} onClose={() => hideMessage()}>
            </FeedbackMessage>
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
                                onClick={() => showAppointmentModal(day)}
                            >
                                    <div>{format(day, 'dd')}</div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            
            <div className='alert-message'>
                <p>Si no hay fechas activas, puede deberse a varias razones: 1. No hay optometras disponibles en el momento. 2. Los domingos no son dias laborales. 3. El dia no pertenece al mes actual, en ese caso, avance al siguiente mes para acceder a dichos dias.</p>
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
                        <div 
                            key={index}
                            className={
                                `time ${isDisabledTime(appointment) ? 'disabled-time' : ''}`
                            }
                            onClick={() => showConfirmationModal(appointment)}
                        >
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
                    <Button key="schedule" type="primary" loading={loading} onClick={() => scheduleAppointment(selectedDay?.date, selectedTime)}>
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