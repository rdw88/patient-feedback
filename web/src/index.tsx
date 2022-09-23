import React from 'react'

import { Routes, Route, BrowserRouter } from 'react-router-dom'
import ReactDOM from 'react-dom/client'

import { createTheme, ThemeProvider } from '@mui/material'

import LoadingStatus, { LoadingState } from './components/loading-status'
import PatientFeedback from './PatientFeedback'
import reportWebVitals from './reportWebVitals'
import './index.css'

const theme = createTheme({
  palette: {
    primary: {
      main: '#ed0a6f',
    },
    secondary: {
      main: '#feffff',
    },
  },
  typography: {
    h4: {
      fontWeight: 'lighter',
    },
    h6: {
      fontWeight: 'lighter',
    },
    subtitle2: {
      color: '#6A6A6A',
    },
  },
})

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route
            path="*"
            element={<LoadingStatus state={LoadingState.NOT_FOUND} />}
          />

          <Route path="/responses/:id" element={<PatientFeedback />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
