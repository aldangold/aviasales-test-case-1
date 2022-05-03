import React from 'react';
import logo from './logo.png';
import Tickets from './components/Tickets.jsx';
import { Container } from 'react-bootstrap';

const App = () => {
  return (
    <main className="App">
      <header className='header'><img src={logo} alt="logo" /></header>
        <Container className='main'>
          <Tickets/>
      </Container>
    </main>
  );
}
export default App;
