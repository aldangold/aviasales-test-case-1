import React from 'react';
import { Container } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import logo from './logo.png';
import Tickets from './components/Tickets.jsx';
import SideBar from './components/SideBar';
import TopBar from './components/TopBar';

const App = () => (
    <Container className="App">
      <Container className='header d-flex'><img src={logo} alt="logo" /></Container>
        <Container className='main d-flex'>
          <Container className='layout d-flex'>
            <Container className='left-layout'>
              <SideBar/>
            </Container>
            <Container className='center-layout'>
              <TopBar/>
              <Tickets/>
            </Container>
        </Container>
      </Container>
      <ToastContainer/>
    </Container>
);
export default App;
