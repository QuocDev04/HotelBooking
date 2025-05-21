import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Layout from './pages/hotel/Layout'
import AddRoom from './pages/hotel/AddRoom'
import Dashboard from './pages/dashboard/Dashboard'
import ListRoom from './pages/hotel/ListRoom'
import AddTour from './pages/tour/AddTour'

const App = () => {
  return (
    <div className='min-h-[70vh]'>
      <Routes>
        <Route path='/' element={<Layout/>}>
          <Route index element={<Dashboard />} />
          <Route path='/add-room' element={<AddRoom />} />
          <Route path='/list-room' element={<ListRoom />} />
          <Route path='/add-tour' element={<AddTour />} />
          <Route />
        </Route>
      </Routes>
    </div>
  )
}

export default App
