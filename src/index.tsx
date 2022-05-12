import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import * as serviceWorkerRegistration from './serviceWorkerRegistration'
import { disableReactDevTools } from '@fvilers/disable-react-devtools'
import './locale/i18n'
import ReactGA from 'react-ga4'
const isProduction = process.env.NODE_ENV === 'production'

if (isProduction) {
  ReactGA.initialize(process.env.REACT_APP_GA_TRACKING_ID || '')
  disableReactDevTools()
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
)

// if (isProduction) {
//   serviceWorkerRegistration.register()
// } else {
serviceWorkerRegistration.unregister()
// }
