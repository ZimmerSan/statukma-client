import React from 'react';
import {render} from 'react-dom';
import registerServiceWorker from './registerServiceWorker';

import jquery from 'jquery';
import metismenu from 'metismenu';

import './_static/styles/style.css';
import './_static/styles/animate.css';

import App from './App';

window.$ = window.jQuery = jquery;

render(<App />, document.getElementById('root'));
registerServiceWorker();