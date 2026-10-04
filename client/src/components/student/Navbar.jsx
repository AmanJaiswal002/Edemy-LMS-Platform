import React, { useContext } from 'react'
import { assets } from '../../assets/assets'
import { Link, useLocation } from 'react-router-dom'
import { useClerk, UserButton, useUser } from '@clerk/clerk-react'
import { AppContext } from '../../context/AppContext'

const Navbar = () => {

  const {navigate, isEducator} = useContext(AppContext)

 const location = useLocation();
 const isCourseListPage = location.pathname.includes('/course-list');

 const {openSignIn} = useClerk()
 const {user} = useUser()

  const [showAdminModal, setShowAdminModal] = React.useState(false);
  const [adminEmail, setAdminEmail] = React.useState('');
  const [adminPassword, setAdminPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [adminError, setAdminError] = React.useState('');

  const navigateToEducator = () => {
    if (localStorage.getItem('adminAuth') === 'true') {
      navigate('/educator');
    } else {
      setShowAdminModal(true);
    }
  };

  const handleAdminSubmit = (e) => {
    e.preventDefault();
    if (adminEmail === 'lms@gmail.com' && adminPassword === 'education26') {
      localStorage.setItem('adminAuth', 'true');
      setShowAdminModal(false);
      navigate('/educator');
    } else {
      setAdminError('Invalid credentials');
    }
  };

  return (
    <>
      <div className={`flex items-center justify-between px-4 sm:px-10 md:px-14 lg:px-36 
      border-b border-gray-500 py-4 ${isCourseListPage ? 'bg-white' : 'bg-cyan-100/70'}`}>
        <Link to='/'><img onClick={()=> navigate('/')} src={assets.logo} alt="Logo" className='w-28 lg:w-32 cursor-pointer' /></Link>
        <div className='hidden md:flex items-center gap-5 text-gray-500'>
          <div className='flex items-center gap-5'>
            { user &&
            <>
              <button onClick={navigateToEducator}>{isEducator ? 'Educator Dashboard' : 'Become Educator'}</button>
            |    <Link to='/my-enrollments'>My Enrollments</Link>
            </>
            }
          </div>
          { user ? <UserButton/> :
          <button onClick={()=> openSignIn()} className='bg-blue-600 text-white px-5 py-2 rounded-full'>Create Account</button>
          }
        </div>
        {/* For Mobile Screens */}
        <div className='md:hidden flex items-center gap-2 sm:gap-5 text-gray-500'>
          <div className='flex items-center gap-1 sm:gap-2 max-sm:text-xs'>
          { user &&
            <>
              <button onClick={navigateToEducator}>{isEducator ? 'Educator Dashboard' : 'Become Educator'}</button>
            |    <Link to='/my-enrollments'>My Enrollments</Link>
            </>
          }
          </div>
          {
            user ? <UserButton/>
            :   <button onClick={()=> openSignIn()}><img src={assets.user_icon} alt="" /></button>
          }
        
        </div>
      </div>

      {showAdminModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60'>
          <div className='max-w-md w-full bg-white p-8 rounded-lg shadow-xl relative m-4'>
            <button 
              onClick={() => setShowAdminModal(false)}
              className='absolute top-4 right-4 text-gray-500 hover:text-gray-800'
            >
              ✕
            </button>
            <h2 className='text-2xl font-bold text-center mb-6 text-red-600'>Only Admin Access</h2>
            {adminError && <p className='text-red-500 text-sm mb-4 text-center'>{adminError}</p>}
            
            <form onSubmit={handleAdminSubmit} className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Email</label>
                <input 
                  type="email" 
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className='w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                  placeholder="Enter admin email"
                  required
                />
              </div>
              
              <div className='relative'>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Password</label>
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
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
        </div>
      )}
    </>
  )
}

export default Navbar