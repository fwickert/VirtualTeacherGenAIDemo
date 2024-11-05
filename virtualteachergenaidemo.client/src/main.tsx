import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import { FluentProvider} from '@fluentui/react-provider'
import { webLightTheme } from '@fluentui/react-theme'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <FluentProvider theme={webLightTheme}>
            <App title="Learning Wizard" />
        </FluentProvider>
    </StrictMode>
)
