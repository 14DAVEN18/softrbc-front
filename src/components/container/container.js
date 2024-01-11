import {useEffect, useRef, useState} from 'react';

import Login from './login/login';
import Register from './register/register';
// import Application from './application/application';

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

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
          <div className='title'>
            <h1>
              SoftRBC
            </h1>
          </div>
          <Routes>
            <Route path='/' element =
              {
                <Navigate replace to="/login" />
              }>
            </Route>

            <Route path='/login' element =
              {
                <Login/>
              }>
            </Route>

            <Route path='/register' element =
              {
                <Register/>
              }>
            </Route>
          </Routes>
        </div>
      </div>
  );
}

/*
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