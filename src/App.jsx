import React from 'react';
import { Container } from 'react-bootstrap';
import logo from './logo.png';
import Tickets from './components/Tickets.jsx';
import SideBar from './components/SideBar';
import TopBar from './components/TopBar';

const App = () => {
  return (
    <main className="App">
      <header className='header'><img src={logo} alt="logo" /></header>
        <Container className='main'>
        <SideBar/>
        <Container className='result col-12 col-md-9 flex-column'>
          <TopBar/>
          <Tickets/>
        </Container>
      </Container>
    </main>
  );
}
export default App;
