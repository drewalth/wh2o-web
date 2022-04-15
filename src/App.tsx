import React from 'react'
import './App.css'
import './style/index.scss'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Settings from './components/User/Settings'
import Account from './pages/Account'
import Home from './pages/Home/Home'
import { Login } from './pages/Auth/Login'
import { Navigation } from './components/Common/Navigation'
import { Gage } from './components/Gage/Gage'
import AppProvider from './components/App/AppProvider'
import { Logout } from './pages/Auth/Logout'
import { Unauthorized } from './pages/Auth/Unauthorized'
import { GageDetail } from './components/Gage/GageDetail'
import { FiveHundred } from './pages/Auth/FiveHundred'

function App() {
  return (
    <Router>
      <AppProvider>
        <Navigation>
          <Routes>
            <Route path="/user/settings" element={<Settings />} />
            <Route path="/user/dashboard" element={<Account />} />
            <Route path="/gage" element={<Gage />} />
            <Route path="/gage/:state/:id" element={<GageDetail />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/logout" element={<Logout />} />
            <Route path="/auth/forgot" element={<Login />} />
            <Route path="/auth/reset" element={<Login />} />
            <Route path="/auth/verify" element={<Login />} />
            <Route path="/auth/unauthorized" element={<Unauthorized />} />
            <Route path="/five-hundred" element={<FiveHundred />} />
            <Route index element={<Home />} />
          </Routes>
        </Navigation>
      </AppProvider>
    </Router>
  )
}

export default App
