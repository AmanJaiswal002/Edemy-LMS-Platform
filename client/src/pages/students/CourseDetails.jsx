import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'
import Loading from "../../components/student/Loading";
import { assets } from '../../assets/assets'
import humanizeDuration from 'humanize-duration';
import Footer from '../../components/student/Footer'
import YouTube from 'react-youtube'
import { useAuth, useUser } from '@clerk/clerk-react'
import { toast } from 'react-hot-toast'

const CourseDetails = () => {

  const {id} = useParams()

  const [courseData, setCourseData] = useState(null)
  const [openSections, setOpenSections] = useState({})
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false)
  const [playerData, setPlayerData] = useState(null)
  const [showCheckoutModal, setShowCheckoutModal] = useState(false)
  const [checkoutData, setCheckoutData] = useState({ name: '', email: '' })

  const { getToken } = useAuth()
  const { user } = useUser()

  useEffect(() => {
    if (user) {
      setCheckoutData({
        name: user.fullName || '',
        email: user.primaryEmailAddress?.emailAddress || ''
      })
    }
  }, [user])

  const {allCourses, calculateRating, calculateNoOfLectures, 
  calculateCourseDuration, calculateChapterTime, currency, backendUrl} = useContext(AppContext)

  // Fetch Course Data
  const fetchCourseData = async ()=>{
    const findCourse = allCourses.find(course => course._id === id)
    setCourseData(findCourse);
  }

  useEffect(()=>{
    fetchCourseData()
  },[allCourses, id])


// Toggle Chapter
const toggleSection = (index)=>{
  setOpenSections((prev)=>(
    {...prev,
      [index]: !prev[index],
    }
  ))
}

// Razorpay Payment
const handlePayment = async () => {
  try {

    const token = await getToken()

    if (!token) {
      toast.error('Please login first')
      return
    }

    if (!courseData) {
      toast.error('Course data not found')
      return
    }

    const response = await fetch(
      `${backendUrl}/api/payment/create-order`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          courseId: courseData._id,
          name: checkoutData.name,
          email: checkoutData.email
        })
      }
    )

    const data = await response.json()

    if (!data.success) {
      toast.error(data.message)
      return
    }

    // Razorpay Checkout Options
    const options = {

      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: data.order.amount,
      currency: data.order.currency,

      name: 'Edemy',
      description: courseData.courseTitle,
      order_id: data.order.id,

      handler: async function (response) {
        try {
          const verifyResponse = await fetch(
            `${backendUrl}/api/payment/verify`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
              },
              body: JSON.stringify({
                courseId: courseData._id,
                name: checkoutData.name,
                email: checkoutData.email,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            }
          )

          const verifyData = await verifyResponse.json()

          if (verifyData.success) {
            toast.success(
             'Payment successful! Course enrolled.'
            )
                  
            setIsAlreadyEnrolled(true)
                
          } else {
            toast.error(
            verifyData.message || 'Payment verification failed'
           )
         }

         } catch (error) {
           toast.error(error.message)
         }
       },

       modal: {
        ondismiss: function () {
         toast.error('Payment cancelled')
        }
      }, 

      theme: {
        color: '#2563eb'
      },

      prefill: {
        name: checkoutData.name,
        email: checkoutData.email
      }
    }

    // Check Razorpay Script
    if (!window.Razorpay) {
      toast.error('Razorpay failed to load')
      return
    }

    setShowCheckoutModal(false) // Close custom modal before popping razorpay
    
    const razorpay = new window.Razorpay(options)
    razorpay.open()
  } catch (error) {
    console.error('Payment Error:', error)
    if (error.message === 'Failed to fetch') {
      toast.error('Backend server is not running or unreachable.')
    } else {
      toast.error(error.message)
    }
   }
 }

  
  return courseData ? (
    <>
    <div className='flex md:flex-row flex-col-reverse gap-10 relative items-start
     justify-between md:px-36 px-8 md:pt-12 pt-8 text-left'>

      <div className='absolute top-0 left-0 w-full h-[500px] z-0 bg-gradient-to-b from-cyan-100/70 to-white pointer-events-none'></div>
      

      {/* left column */}
      <div className='max-w-xl relative z-10 text-gray-500'>
        <h1 className='md:text-course-details-heading-large text-course-details-heading-small 
          font-bold text-gray-800'>{courseData.courseTitle}
        </h1>
        <p className='pt-4 md:text-base text-sm' 
          dangerouslySetInnerHTML={{__html: courseData.courseDescription.slice(0,200)}}>
        </p>

    {/* review and ratings */}
    <div className='flex items-center space-x-2 pt-3 pb-1 text-sm'>
        <p>{calculateRating(courseData)}</p>
       <div className='flex'>
         {[...Array(5)].map((_, i)=>(<img key={i} src={i < Math.floor
         (calculateRating(courseData)) ? assets.star : assets.star_blank} alt='' 
         className='w-3.5 h-3.5'/>
         ))}
        </div>
        <p className='text-blue-600'>({(courseData.courseRatings || []).length} 
        {(courseData.courseRatings || []).length > 1 ? 'ratings' : 'rating'})</p>

        <p>{(courseData.enrolledStudents || []).length} {(courseData.enrolledStudents || []).length > 1 ? 'students' : 'student'}</p>
        </div>

        <p className='text-sm'>Course by <span className='text-blue-600 underline'>Jaiswal@k</span></p>

        <div className='pt-8 text-gray-800'>
          <h2 className='text-xl font-semibold'>Course Structure</h2>

          <div className='pt-5'>{courseData.courseContent.map((chapter, index)=> (
            <div key={index} className='border border-gray-300 bg-white mb-2 rounded'>
              <div className='flex items-center justify-between px-4 py-3 cursor-pointer 
              select-none' onClick={()=> toggleSection(index)}>
                <div className='flex items-center gap-2'>
                  <img className={`transform transition-transform ${openSections[index] ? 'rotate-180' : ''}`} 
                  src={assets.down_arrow_icon} alt="arrow icon" />
                  <p className='font-medium md:text-base text-sm'>{chapter.chapterTitle}</p>
                </div>
                <p className='text-sm md:text-default'>{chapter.chapterContent.length} lectures - {calculateChapterTime(chapter)}</p>
              </div>

              <div className={`overflow-hidden transition-all duration-300 ${openSections[index] ? 'max-h-96' : 'max-h-0'}`}>
                <ul className='list-disc md:pl-10 pl-4 pr-4 py-2 text-gray-600 border-t border-gray-300'>
                  {chapter.chapterContent.map((lecture, i)=> (
                    <li key={i} className='flex items-start gap-2 py-1'>
                      <img src={assets.play_icon} alt="play icon" className='w-4 h-4 mt-1' />
                      <div className='flex items-center justify-between w-full text-gray-800 text-xs md:text-default'>
                        <p>{lecture.lectureTitle}</p>
                        <div className='flex gap-2'>
                          {lecture.isPreviewFree && <p onClick={()=> setPlayerData({videoId: lecture.lectureUrl.split('/').pop()})} 
                          className='text-blue-500 cursor-pointer'>Preview</p>}
                          <p>{humanizeDuration(lecture.lectureDuration * 60 * 1000, {units: ['h', 'm']})}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              
            </div>
          ))}
          </div>
        </div>

        <div className='py-20 text-sm md:text-default'>
          <h3 className='text-xl font-semibold text-gray-800'>Course Description</h3>
          <p className='pt-3 rich-text' 
           dangerouslySetInnerHTML={{__html: courseData.courseDescription}}>
          </p>
       </div>

    </div>

      {/* right column */}
      <div className='max-w-course-card z-10 shadow-custom-card rounded-t md:rounded-none 
      overflow-hidden bg-white min-w-[300px] sm:min-w-[420px]'>
        {
          playerData ?
          <YouTube  videoId={playerData.videoId} opts={{playerVars: {autoplay: 1}}} 
          iframeClassName='w-full aspect-video'/>
        : <img src={courseData.courseThumbnail} alt="" className='w-full' />
        }
        
        <div className='p-5'>
          <div className='flex items-center gap-2 text-sm text-red-500'>

              <img className='w-3.5' src={assets.time_left_clock_icon} 
              alt="time left clock icon" />
          <p><span className='font-medium'>5 days</span> left at this price!</p>
       </div>

          <div className='flex gap-3 items-center pt-2'>
            <p className='text-gray-800 md:text-4xl text-2xl font-semibold'>{currency}
            {(courseData.coursePrice - courseData.discount * courseData.coursePrice / 100).toFixed(2)}</p>
            <p className='md:text-lg text-gray-500 line-through'>{currency}{courseData.coursePrice}</p>
            <p className='md:text-lg text-gray-500'>{courseData.discount}% off</p>
          </div>

          <div className='flex items-center text-sm md:text-default gap-4 pt-2 md:pt-4 text-gray-500'>
            <div className='flex items-center gap-1'>
              <img src={assets.star} alt="star icon" />
              <p>{calculateRating(courseData)}</p>
            </div>

            <div className='h-4 w-px bg-gray-500/40'></div>

            <div className='flex items-center gap-1 text-blue-600'>
              <img src={assets.time_clock_icon} alt="clock icon" />
              <p>{calculateCourseDuration(courseData)}</p>
            </div>

            <div className='h-4 w-px bg-gray-500/40'></div>

            <div className='flex items-center gap-1'>
              <img src={assets.lesson_icon} alt="lesson icon" />
              <p>{calculateNoOfLectures(courseData)} lessons</p>
            </div>
          </div>

          <button onClick={() => setShowCheckoutModal(true)} className='md:mt-6 mt-4 w-full py-3 rounded bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all'>
            {isAlreadyEnrolled ? 'Already Enrolled' : 'Enroll Now'}
          </button>

          <div className='pt-6'>
            <p className='md:text-xl text-lg font-medium text-gray-800'>What's in the course?</p>
            <ul className='ml-4 pt-2 text-sm md:text-default list-disc text-gray-500 space-y-1'>
              <li>Lifetime access with free updates.</li>
              <li>Step-by-step, easy to follow lessons.</li>
              <li>Downloadable resources and source code.</li>
              <li>Quizzes to test your knowledge.</li>
              <li>Certificate of completion.</li>
            </ul>
          </div>
        </div>
      </div>

    </div>
    
    {/* Checkout Modal */}
    {showCheckoutModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden relative">
          <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-800">Checkout Details</h3>
            <button onClick={() => setShowCheckoutModal(false)} className="text-gray-400 hover:text-gray-600">
              <img src={assets.cross_icon} alt="Close" className="w-4 h-4 cursor-pointer" />
            </button>
          </div>
          
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input type="text" value={checkoutData.name} onChange={(e) => setCheckoutData({...checkoutData, name: e.target.value})} 
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Enter your name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input type="email" value={checkoutData.email} onChange={(e) => setCheckoutData({...checkoutData, email: e.target.value})} 
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Enter your email" />
            </div>
            
            <div className="pt-4">
               <button onClick={handlePayment} className="w-full py-3 rounded bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all flex justify-center items-center gap-2">
                 Proceed to Payment 
                 <img src={assets.arrow_icon} alt="arrow" className="w-4 h-4 filter invert" />
               </button>
            </div>
          </div>
        </div>
      </div>
    )}

    <Footer />
    </>
  ) : <Loading />
}

export default CourseDetails