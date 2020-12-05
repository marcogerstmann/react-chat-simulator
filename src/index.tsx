import * as React from 'react';
import * as ReactDOM from 'react-dom';

/**
 * Currently no need for adding jquery and bootstrap JavaScript code
 */
import 'bootstrap/dist/css/bootstrap.min.css';

import App from './app';
import './styles/styles.scss';

const mountNode = document.getElementById('app');
ReactDOM.render(<App />, mountNode);
