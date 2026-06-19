import React from 'react'
import Navbar from '../../composants/Navbar'
import Footer from '../../composants/Footer'
import { Outlet } from 'react-router-dom'

const UserLayout = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#fff' }}>
      <Navbar />
      <div style={{ flex: 1 }}>
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}

export default UserLayout