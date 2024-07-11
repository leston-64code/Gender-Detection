import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import ImageInputHandler from './pages/ImageInputHandler'
import VideoInputHandler from './pages/VideoInputHandler'
import Navbar from './components/Navbar'

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route element={<ImageInputHandler />} path='/' />
        <Route element={<VideoInputHandler />} path='/videofeed' />
      </Routes>
    </Router>
  )
}

export default App
