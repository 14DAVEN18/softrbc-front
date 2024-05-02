// React imports
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// External components / libraries
import { addDays, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, addMonths, format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Button, Modal  } from 'antd';
import { saveAs } from 'file-saver';

// Self created components
import FeedbackMessage from '../../common/feedback-message/feedback-message';

// Self created services
import { cancelWorkDay } from '../../../../services/calendarService';
import { getDaysOptometrist } from '../../../../services/calendarService';

// Styles
import './cancel-work-day.css';

export default function CancelWorkDay() {

    const ref = useRef(null);
    const [height, setHeight] = useState(0);
    const [width, setWidth] = useState(0);
    const [message, setMessage] = useState({
        visible: false,
        type: '',
        text: ''
    })
    const [workDays, setWorkDays] = useState([])
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

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        
        const fecthWorkdays = async ()  => {
            try {
                const response = await getDaysOptometrist()
                console.log(response.data)
                const newWorkDays = response.data
                    .flatMap(calendar => calendar.split('.'))
                    .filter((day, index, self) => self.indexOf(day) === index);
                console.log(newWorkDays)
                setWorkDays(newWorkDays)
            } catch (error) {
                if(!error.hasOwnProperty('response')) {
                    if(error.hasOwnProperty('message')) {
                        if(error.message.toLowerCase() === 'network error') {
                            showMessage(
                                'error',
                                `No se puedo conectar al servidor. Por favor intente más tarde.`
                            )
                        }
                    }
                } else if (error.response.data.hasOwnProperty('error')) {
                    if (error.response.data.error.toLowerCase().includes('expired')){
                        showMessage(
                            'error',
                            `Su sesión expiró. En breve será redirigido al chat, por favor inicie sesión de nuevo en el menú "Agendar cita".`
                        )
                        setTimeout(() => {
                            localStorage.clear()
                            navigate('/cliente/preguntas')
                        }, 5000)
                    } else if (error.response.data.error.toLowerCase().includes('does not match')) {
                        showMessage(
                            'error',
                            `Su sesión actual no es válida. Debe iniciar sesión de nuevo. En breve será redirigido al chat, por favor inicie sesión de nuevo en el menú "Agendar cita".`
                        )
                        setTimeout(() => {
                            localStorage.clear()
                            navigate('/cliente/preguntas')
                        }, 5000)
                    }
                } else{
                    showMessage(
                        'error',
                        `Ocurrió un error al cargar los días disponibles.`
                    )
                }
            }
        }

        setHeight(ref.current.offsetHeight);
        setWidth(ref.current.offsetWidth);
        if(!localStorage.getItem('token')) {
            navigate("/inicio-empleados")
        } else {
            fecthWorkdays();   
        }
    }, [navigate])

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
        return (!isCurrentMonth(date) ||
                formattedDate < formattedCurrentDate) ||
                isSunday(date) ||
                !workDays.includes(format(date, 'EEEE', { locale: es }).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''));
    };






    // TO HANDLE DAY CANCELATION MODAL ***********************************************************
    const [isCancelationModalOpen, setIsCancelationModalOpen] = useState(false);
    const [selectedDay, setSelectedDay] = useState(null);


    const showCancelationModal = (day) => {
        setSelectedDay(format(day, 'dd/MM/yyyy'))
        setTimeout(() => {
            setIsCancelationModalOpen(true);
        }, 50)
        
    };  
    
    const cancelDay = async () => {
        setLoading(true);
        try {
            const response = await cancelWorkDay(selectedDay);
            const blob = new Blob([response.data], { type: 'application/json' });
            saveAs(blob, `citas_${selectedDay}.pdf`);

            if(response.status === 200) {
                showMessage(
                    'success',
                    `El dia ${selectedDay} fue cancelado exitosamente. En breve se descargará un documento PDF.`
                )
            }
        } catch (error) {
            if(!error.hasOwnProperty('response')) {
                if(error.hasOwnProperty('message')) {
                    if(error.message.toLowerCase() === 'network error') {
                        showMessage(
                            'error',
                            `No se puedo conectar al servidor. Por favor intente más tarde.`
                        )
                    }
                }
            } else if (error.response.data.hasOwnProperty('error')) {
                if (error.response.data.error.toLowerCase().includes('expired')){
                    showMessage(
                        'error',
                        `Su sesión expiró. En breve será redirigido a la página de inicio de sesión.`
                    )
                    setTimeout(() => {
                        localStorage.clear()
                        navigate('/inicio-empleados')
                    }, 5000)
                } else if (error.response.data.error.toLowerCase().includes('does not match')) {
                    showMessage(
                        'error',
                        `Su sesión actual no es válida. Debe iniciar sesión de nuevo. En breve será redirigido a la página de inicio de sesión.`
                    )
                    setTimeout(() => {
                        localStorage.clear()
                        navigate('/inicio-empleados')
                    }, 5000)
                }
            }
            else {
                showMessage(
                    'error',
                    `Ocurrió un error cancelando el dia laboral ${selectedDay}.`
                )
            }
        } finally {
            setLoading(false);
            setIsCancelationModalOpen(false);
        }
    };
    
    const statusCancelationModalCancel = () => {
        setIsCancelationModalOpen(false);
    };







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