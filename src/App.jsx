import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Navbar from './components/Navbar'
import ScrollToTop from './components/navigation/ScrollToTop'

import Landing from './pages/Landing'
import Discover from './pages/Discover'
import Compare from './pages/Compare'
import Recommendations from './pages/Recommendations'
import Saved from './pages/Saved'
import CarDetails from './pages/CarDetails'

import { AppProvider } from './contexts/AppContext'

import './App.css'

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>

        <ScrollToTop />

        <div className="min-h-screen bg-[#06060C] text-white overflow-x-hidden">
          
          {/* Global Navbar */}
          <Navbar />

          {/* Routes */}
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="/recommendations" element={<Recommendations />} />
            <Route path="/saved" element={<Saved />} />

            {/* Dynamic car page */}
            <Route path="/car/:id" element={<CarDetails />} />
          </Routes>

        </div>

      </AppProvider>
    </BrowserRouter>
  )
}