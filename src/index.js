import ReactDOM from 'react-dom';
import init from './init.jsx';

const app = async () => {
  const vdom = await init();
  const tickets = document.getElementById('root');
  ReactDOM.render(vdom, tickets);
};

app();
