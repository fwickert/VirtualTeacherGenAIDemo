import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { FluentProvider, webLightTheme } from '@fluentui/react-components'
import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById('root')).render(
    <StrictMode>

        <FluentProvider theme={webLightTheme}>
            <App title="Learning Wizard" />
        </FluentProvider>

    </StrictMode>
)
