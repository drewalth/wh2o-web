import React from 'react'
import './App.css'
import './style/index.scss'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Settings from './pages/Settings'
import Exporter from './pages/Exporter'
import Account from './pages/Account'
import Home from './pages/Home/Home'
import { Login } from './pages/Auth/Login'
import { Navigation } from './components/Common/Navigation'
import { Gage } from './components/Gage/Gage'
import AppProvider from './components/App/AppProvider'
import { Logout } from './pages/Auth/Logout'
import { Unauthorized } from './pages/Auth/Unauthorized'
import { GageDetail } from './components/Gage/GageDetail'

function App() {
  return (
    <Router>
      <AppProvider>
        <Navigation>
          <Routes>
            <Route path="/settings" element={<Settings />} />
            <Route path="/exporter" element={<Exporter />} />
            <Route path="/account" element={<Account />} />
            <Route path="/gage" element={<Gage />} />
            <Route path="/gage/:state/:id" element={<GageDetail />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/logout" element={<Logout />} />
            <Route path="/auth/forgot" element={<Login />} />
            <Route path="/auth/reset" element={<Login />} />
            <Route path="/auth/verify" element={<Login />} />
            <Route path="/auth/unauthorized" element={<Unauthorized />} />
            <Route index element={<Home />} />
          </Routes>
        </Navigation>
      </AppProvider>
    </Router>
  )
}

export default App
