import {useEffect, useRef, useState} from 'react';

import Login from './customer/login/login';
import Register from './customer/register/register';


// Common for both admin and optometrist
import EmployeeLogin from './common-login/common-login';

// Components for administrator pages
import Admin from './administrator/admin-container'
import OptometristManagement from './administrator/optometrist-management/optometrist-management';

import { Routes, Route, Navigate } from 'react-router-dom';

import './container.css';
import 'antd/dist/reset.css';

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