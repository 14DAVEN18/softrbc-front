import { useEffect, useRef, useState } from 'react';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, addMonths, format, isLeapYear } from 'date-fns';


import './cancel-work-day.css';

export default function CancelWorkDay() {

    const ref = useRef(null);
    const [height, setHeight] = useState(0);
    const [width, setWidth] = useState(0);

    useEffect(() => {
        setHeight(ref.current.offsetHeight);
        setWidth(ref.current.offsetWidth);
    }, [])

    const weekDays = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

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


    return (
        <div className='cancel-day' ref={ref}>
            <div className='calendar-action'>
                <button onClick={handlePrevMonth}>Previous Month</button>
                <span>{format(currentDate, 'MMMM yyyy')}</span>
                <button onClick={handleNextMonth}>Next Month</button>
            </div>
            <div className='calendar'>
                {weekDays.map((day, index) => (
                    <div key={index} className='day-header'>{day}</div>
                ))}
                {daysInMonth.map((day, index) => (
                    <div key={index} className='day'>{format(day, 'dd')}</div>
                ))}
            </div>
        </div>
    )
}