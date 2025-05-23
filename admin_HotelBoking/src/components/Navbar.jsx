import React from 'react'
import { Link } from 'react-router-dom';
import { assets } from './../assets/assets';

const Navbar = () => {
  return (
    <div className='flex items-center justify-between px-4 md:px-8 border-b border-gray-300 py-3 bg-white transition-all duration-300'>
      <Link to={'/'}>
        <img src={assets.logo} alt="" className='h-9 invert opacity-80'/>
      </Link>
      <button type="button" className="w-20 py-3 active:scale-95 transition text-sm text-white rounded-full bg-slate-700"><p className="mb-0.5">Login</p></button>
    </div>
  )
}

export default Navbar
