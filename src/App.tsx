import React from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Settings from './pages/Settings'
import Exporter from './pages/Exporter'
import Account from './pages/Account'
import Home from './pages/Home/Home'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/settings" element={<Settings />} />
        <Route path="/exporter" element={<Exporter />} />
        <Route path="/account" element={<Account />} />
        <Route index element={<Home />} />
      </Routes>
    </Router>
  )
}

export default App
