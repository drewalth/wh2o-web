import React from 'react'
import './App.css'
import './style/index.scss'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Settings from './components/User/Settings'
import Home from './pages/Home/Home'
import { Login } from './pages/Auth/Login'
import { Navigation } from './components/Common/Navigation'
import { Gage } from './components/Gage/Gage'
import AppProvider from './components/App/AppProvider'
import { Logout } from './pages/Auth/Logout'
import { Unauthorized } from './pages/Auth/Unauthorized'
import { GageDetailModal } from './components/Gage/GageDetailModal'
import { FiveHundred } from './pages/Auth/FiveHundred'
import { Admin } from './pages/Admin/Admin'
import { AuthGuard } from './hooks'
import { Register } from './pages/Auth/Register'
import { Verify } from './pages/Auth/Verify'
import { Forgot } from './pages/Auth/Forgot'
import { Alerts } from './components/User/Alerts/Alerts'

function App() {
  return (
    <Router>
      <AppProvider>
        <Navigation>
          <Routes>
            <Route path="/user/settings" element={<Settings />} />
            <Route
              path="/user/alerts"
              element={
                <AuthGuard>
                  <Alerts />
                </AuthGuard>
              }
            />
            <Route path="/explore" element={<Gage />} />
            <Route path="/explore/:state/:id" element={<GageDetailModal />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/logout" element={<Logout />} />
            <Route path="/auth/forgot" element={<Forgot />} />
            <Route path="/auth/reset" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />
            <Route path="/auth/verify" element={<Verify />} />
            <Route path="/auth/unauthorized" element={<Unauthorized />} />
            <Route path="/five-hundred" element={<FiveHundred />} />
            <Route path="/admin" element={<Admin />} />
            <Route index element={<Home />} />
          </Routes>
        </Navigation>
      </AppProvider>
    </Router>
  )
}

export default App
