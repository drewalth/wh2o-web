import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
// import * as serviceWorkerRegistration from './serviceWorkerRegistration'
// import { disableReactDevTools } from '@fvilers/disable-react-devtools'
import './locale/i18n'
// const isProduction = process.env.NODE_ENV === 'production'

// if (isProduction) {
//   disableReactDevTools()
// }

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
)

// if (isProduction) {
//   serviceWorkerRegistration.register()
// } else {
// serviceWorkerRegistration.unregister()
// }
