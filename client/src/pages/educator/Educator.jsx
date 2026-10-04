import React, { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../../components/educator/Navbar'
import Sidebar from '../../components/educator/Sidebar'
import Footer from '../../components/educator/Footer'

const Educator = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Keep them logged in across refreshes
    if (localStorage.getItem('adminAuth') === 'true') {
      setIsAdmin(true);
    }
  }, []);

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (email === 'lms@gmail.com' && password === 'education26') {
      setIsAdmin(true);
      localStorage.setItem('adminAuth', 'true');
      setError('');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className='text-default min-h-screen bg-white'>
      <Navbar />
      <div className='flex'>
        {isAdmin && <Sidebar />}
        <div className='flex-1 flex items-center justify-center min-h-[80vh]'>
          {!isAdmin ? (
            <div className='max-w-md w-full bg-white p-8 rounded-lg shadow-md border'>
              <h2 className='text-2xl font-bold text-center mb-6 text-red-600'>Only Admin Access</h2>
              {error && <p className='text-red-500 text-sm mb-4 text-center'>{error}</p>}
              
              <form onSubmit={handleAdminLogin} className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>Email</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className='w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                    placeholder="Enter admin email"
                    required
                  />
                </div>
                
                <div className='relative'>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>Password</label>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className='w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10'
                    placeholder="Enter password"
                    required
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className='absolute right-3 top-9 text-gray-500 hover:text-gray-700'
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
                </div>
                
                <button 
                  type="submit"
                  className='w-full bg-blue-600 text-white font-medium py-2 rounded-md hover:bg-blue-700 transition'
                >
                  Submit
                </button>
              </form>
            </div>
          ) : (
            <Outlet/>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Educator