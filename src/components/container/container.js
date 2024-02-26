import {useEffect, useRef, useState} from 'react';

import Login from './customer/login/login';
import Register from './customer/register/register';


// Common for both admin and optometrist
import EmployeeLogin from './common-login/common-login';

// Components for administrator pages
import Admin from './administrator/admin-container'
import OptometristManagement from './administrator/optometrist-management/optometrist-management';
import Reports from './administrator/reports/reports';
import WorkCalendar from './administrator/work-calendar/work-calendar';

// Components for optometrist pages
import Optometrist from './optometrist/optometrist-container';
import OptometristSchedule from './optometrist/optometrist-schedule/optometrist-schedule';

import { Routes, Route, Navigate } from 'react-router-dom';

import './container.css';
import 'antd/dist/reset.css';
import CancelWorkDay from './administrator/cancel-work-day/cancel-work-day';
import Changelog from './administrator/changelog/changelog';

// import RegisterTransaction from './application/register-transaction/register-transaction';
// import ListTransactions from './application/list-transactions/list-transactions';

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
            <Route path='/' element={ <Navigate replace to="/inicio-de-sesion"/> }></Route>
            <Route path='/inicio-de-sesion' element={ <Login/> }></Route>
            <Route path='/registro' element={ <Register/> }></Route>
            <Route path='/inicio-empleados' element={ <EmployeeLogin/> }></Route>

            <Route path='/administrador' element={ <Navigate replace to="/administrador/gestion-optometras"/> }></Route>
            <Route path='/administrador' element={ <Admin/> }>
              <Route path='gestion-optometras' element={ <OptometristManagement/> }></Route>
              <Route path='calendario-laboral' element={ <WorkCalendar/> }></Route>
              <Route path='cancelar-dia' element={ <CancelWorkDay/> }></Route>
              <Route path='reportes' element={ <Reports/> }></Route>
              <Route path='cambios' element={ <Changelog/> }></Route>
            </Route>

            <Route path='/optometra' element={ <Navigate replace to="/optometra/agenda"/> }></Route>
            <Route path='/optometra' element={ <Optometrist/> }>
              <Route path='agenda' element={ <OptometristSchedule/> }></Route>
            </Route>
          </Routes>
        </div>
      </div>
  );
}

/*
<Route path='gestion-optometras' element={ <OptometristManagement/> }></Route>
<Routes>
  <Route path='/' element={<Navigate replace to="/login" />}>
  </Route>
  <Route path='/login' element={<Login/>}>
  </Route>
  <Route path='/register' element={<Register/>}>
  </Route>
  <Route path='/application' element={<Application/>}>
    <Route path='register-transaction' element={<RegisterTransaction/>}></Route>
    <Route path='list-transactions' element={<ListTransactions/>}></Route>
  </Route>
</Routes>

*/