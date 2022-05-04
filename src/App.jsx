import React from 'react';
import { Container } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import logo from './logo.png';
import Tickets from './components/Tickets.jsx';
import SideBar from './components/SideBar';
import TopBar from './components/TopBar';

const App = () => {
  return (
    <Container className="App">
      <header className='header'><img src={logo} alt="logo" /></header>
        <Container className='main'>
        <SideBar/>
        <Container className='result col-12 col-md-9 flex-column'>
          <TopBar/>
          <Tickets/>
        </Container>
      </Container>
      <ToastContainer/>
    </Container>
  );
}
export default App;
