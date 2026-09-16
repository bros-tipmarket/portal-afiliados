import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import '../app/globals.css';
import '../app/brand.css';
import Portal from '../app/portal';

createRoot(document.getElementById('root')!).render(<StrictMode><Portal/></StrictMode>);
