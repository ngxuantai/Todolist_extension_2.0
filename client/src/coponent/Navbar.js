import React from 'react';
import {BrowserRouter as Router, Link, Route, Routes} from 'react-router-dom';
import Home from './Home';
import GGCalendar from './GGCalendar';
import Login from './UitTodo';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/Navbar.css';

const Navbar = () => {
  return (
    <Router>
      <nav
        className='navbar navbar-expand-sm navbar-dark bg-dark fixed-top'
        style={{
          width: '400px',
          height: '50px',
        }}
      >
        <div>
          <a className='navbar-brand'>TodoList</a>
          <Link className='navbar-link' to='/home'>
            Home
          </Link>
          <Link className='navbar-link' to='/login'>
            UIT
          </Link>
          <Link className='navbar-link' to='/gg-calendar'>
            Google Calendar
          </Link>
        </div>
      </nav>

      <Routes>
        <Route path='*' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/gg-calendar' element={<GGCalendar />} />
      </Routes>
    </Router>
  );
};

export default Navbar;
