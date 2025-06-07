import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Layout from './pages/room/Layout'
import AddRoom from './pages/room/AddRoom'
import Dashboard from './pages/dashboard/Dashboard'
import ListRoom from './pages/room/ListRoom'
import AddTour from './pages/tour/AddTour'
import ListTour from './pages/tour/ListTour'
import ListHotel from './pages/hotel/ListHotel'
import AddHotel from './pages/hotel/AddHotel'
import Anh from './pages/anh'
import EditHotel from './pages/hotel/EditHotel'
import EditRoom from './pages/room/EditRoom'

const App = () => {
  return (
    <div className='min-h-[70vh]'>
      <Routes>
        <Route path='/' element={<Layout/>}>
          <Route index element={<Dashboard />} />
          <Route path='/add-room' element={<AddRoom />} />
          <Route path='/list-room' element={<ListRoom />} />
          <Route path='/edit-room/:id' element={<EditRoom />} />

          <Route path='/add-tour' element={<AddTour />} />
          <Route path='/list-tour' element={<ListTour />} />

          <Route path='/list-hotel' element={<ListHotel />} />
          <Route path='/add-hotel' element={<AddHotel />} />
          <Route path='/edit-hotel/:id' element={<EditHotel />} />

          <Route path='/add-' element={<Anh />} />

          
          <Route />
        </Route>
      </Routes>
    </div>
  )
}

export default App
