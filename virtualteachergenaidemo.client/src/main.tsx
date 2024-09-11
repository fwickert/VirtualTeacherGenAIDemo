import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import { FluentProvider, webLightTheme } from '@fluentui/react-components'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <FluentProvider theme={webLightTheme}>
            <App title="Learning Wizard" />
        </FluentProvider>
    </StrictMode>
)
