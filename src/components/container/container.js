// React imports
import {useEffect, useRef, useState} from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Login from './customer/login/login';
import Register from './customer/register/register';
import AccountRecovery from './common/account-recovery';
import PasswordReset from './common/reset-password';


// Common for both admin and optometrist
import EmployeeLogin from './common/common-login';

// Components for administrator pages
import Admin from './administrator/admin-container'
import OptometristManagement from './administrator/optometrist-management/optometrist-management';
import Reports from './administrator/reports/reports';
import WorkCalendar from './administrator/work-calendar/work-calendar';
import CancelWorkDay from './administrator/cancel-work-day/cancel-work-day';
import Changelog from './administrator/changelog/changelog';
import FAQManagement from './administrator/faq-management/faq-management';

// Components for optometrist pages
import Optometrist from './optometrist/optometrist-container';
import OptometristSchedule from './optometrist/optometrist-schedule/optometrist-schedule';
import FindPatient from './optometrist/find-patient/find-patient';

// Components for customer pages
import AppointmentManagement from './customer/appointment-management/appointment-management';
import Chatbot from './customer/chatbot/chatbot';

// Styles
import './container.css';
import 'antd/dist/reset.css';

export default function Container() {
  
  const ref = useRef(null);

    const [height, setHeight] = useState(0);
    const [width, setWidth] = useState(0);

    useEffect(() => {
        setHeight(ref.current.offsetHeight);
        setWidth(ref.current.offsetWidth);
    }, [])

  return (
      <div className='container' ref={ref}>
        <div className="content">
          <Routes>
            <Route path='/' element={ <Navigate replace to="/cliente/preguntas"/> }></Route>
            <Route path='/inicio-empleados' element={ <EmployeeLogin/> }></Route>
            <Route path='/recuperacion-de-cuenta' element={ <AccountRecovery/> }></Route>
            <Route path='/reiniciar-clave' element={ <PasswordReset/> }></Route>

            <Route path='/administrador' element={ <Navigate replace to="/administrador/gestion-optometras"/> }></Route>
            <Route path='/administrador' element={ <Admin/> }>
              <Route path='gestion-optometras' element={ <OptometristManagement/> }></Route>
              <Route path='calendario-laboral' element={ <WorkCalendar/> }></Route>
              <Route path='cancelar-dia' element={ <CancelWorkDay/> }></Route>
              <Route path='gestion-preguntas' element={ <FAQManagement/> }></Route>
              <Route path='reportes' element={ <Reports/> }></Route>
              <Route path='cambios' element={ <Changelog/> }></Route>
            </Route>

            <Route path='/optometra' element={ <Navigate replace to="/optometra/agenda"/> }></Route>
            <Route path='/optometra' element={ <Optometrist/> }>
              <Route path='agenda' element={ <OptometristSchedule/> }></Route>
              <Route path='consultar-paciente' element= { <FindPatient/> }></Route>
            </Route>

            <Route path='/cliente' element={ <Navigate replace to='/cliente/preguntas'/> }></Route>
            <Route path='/cliente/preguntas' element={ <Chatbot/> }></Route>
            <Route path='/cliente/inicio-de-sesion' element={ <Login/> }></Route>
            <Route path='/cliente/registro' element={ <Register/> }></Route>
            <Route path='/cliente/agendamiento' element={ <AppointmentManagement/> }></Route>
          </Routes>
        </div>
      </div>
  );
}