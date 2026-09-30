import React from 'react'
import { assets } from '../../assets/assets'

const Companies = () => {
  return (
    <div className='pt-16'>
      <p className='text-base text-gray-500'>Trusted by learners from</p>
      <div className='flex flex-wrap items-center justify-center gap-6 md:gap-19 md:mt-10 mt-5'>

        <img src={assets.microsoft_logo} alt="Microsoft" className='w-20 md:w-28'/>
        <img src={assets.google_logo} alt="Google" className='w-20 md:w-28'/>
        <img src={assets.flipkart_logo} alt="Flipkart" className='w-20 md:w-28'/>
        <img src={assets.amazon_logo} alt="Amazon" className='w-20 md:w-28'/>
        <img src={assets.wipro_logo} alt="Wipro" className='w-20 md:w-28'/>
      </div>
    </div>
  )
}

export default Companies