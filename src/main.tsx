import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { store } from '../src/store.ts'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Provider store={store}>
        <App />
      </Provider>
    </LocalizationProvider>
  </BrowserRouter>,
)