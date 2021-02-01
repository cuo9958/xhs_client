import React from 'react';
import { render } from 'react-dom';
import HomePage from './pages/home';

const mainElement = document.createElement('div');
mainElement.setAttribute('id', 'root');
document.body.appendChild(mainElement);

render(<HomePage />, mainElement);
