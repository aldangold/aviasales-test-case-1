import ReactDOM from 'react-dom';
import 'regenerator-runtime';
import './css/style.css';
import init from './init.jsx';

const app = async () => {
  const vdom = await init();
  const tickets = document.getElementById('root');
  ReactDOM.render(vdom, root);
};

app();