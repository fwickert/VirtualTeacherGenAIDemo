import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import { FluentProvider} from '@fluentui/react-provider'
import { Theme, webLightTheme } from '@fluentui/react-theme'

type CustomTheme = Theme & {  
};

const customTheme: CustomTheme = {
    ...webLightTheme, colorBrandBackground: '#000000', colorBrandBackgroundHover: '#000000', // Set primary button hover background color to black
    colorBrandBackgroundPressed: '#000000' };

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <FluentProvider theme={customTheme}>
            <App title="Learning Wizard" />
        </FluentProvider>
    </StrictMode>
)
