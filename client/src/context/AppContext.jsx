import React, { createContext, useEffect, useState } from 'react';
import { dummyCourses } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import humanizeDuration from 'humanize-duration';
import { useAuth, useUser } from "@clerk/clerk-react";

export const AppContext = createContext()

export const AppContextProvider = (props)=>{

    const currency = import.meta.env.VITE_CURRENCY || '₹'
    const navigate = useNavigate()

    const {getToken} = useAuth()
    const {user} = useUser()

    const [allCourses, setAllCourse] = useState([])
    const [isEducator, setIsEducator] = useState(true)
    const [enrolledCourses, setEnrolledCourses] = useState([])

    // Fetch All Course
    const fetchAllCourses = async ()=>{
        setAllCourse(dummyCourses)
    }

    // Function to calculate average rating of course
    const calculateRating = (course)=>{
        if(course.courseRatings.length === 0){
            return 0;
        }
        let totalRating = 0
        course.courseRatings.forEach(rating => {
            totalRating += rating.rating
        })
        return totalRating / course.courseRatings.length
    }

    // Function to Calculate Course Chapter Time
    const calculateChapterTime = (chapter)=>{
        let time = 0
        chapter.chapterContent.map((lecture)=> time += lecture.lectureDuration)
        return humanizeDuration(time * 60 * 1000, {units: ["h", "m"]})
    }

    // Function to Calculate Course Duration
    const calculateCourseDuration = (course)=>{
        let time = 0

        course.courseContent.map((chapter)=> chapter.chapterContent.map((lecture) => time += lecture.lectureDuration))
        return humanizeDuration(time * 60 * 1000, {units: ["h", "m"]})

    }

    // Function calculate to No of Lecture in the course
    const calculateNoOfLectures = (course)=>{
        let totalLectures = 0;
        course.courseContent.forEach(chapter => {
            if(Array.isArray(chapter.chapterContent)){
                totalLectures += chapter.chapterContent.length
            }
        });
        return totalLectures;
    }

    // Fetch User Enrolled Courses
    const fetchUserEnrolledCourses = async ()=>{
        setEnrolledCourses(dummyCourses)
    }


    useEffect(()=>{
      fetchAllCourses()
      fetchUserEnrolledCourses()
    },[])

       const syncUserToDatabase = async ()=>{
           try {
               const token = await getToken();
               if (!token) return;
               
               await fetch(backendUrl + '/api/user/sync', {
                   method: 'POST',
                   headers: {
                       'Content-Type': 'application/json',
                       Authorization: `Bearer ${token}`
                   },
                   body: JSON.stringify({
                       name: user.fullName || '',
                       email: user.primaryEmailAddress?.emailAddress || '',
                       imageUrl: user.imageUrl || ''
                   })
               });
               console.log("User synced successfully with local MongoDB");
           } catch (error) {
               console.error("User sync error:", error);
           }
       }

    useEffect(()=>{
        if(user){
            syncUserToDatabase()
        }
    },[user])

    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'

    const value = {
        currency, allCourses, navigate, calculateRating,
        isEducator, setIsEducator, calculateNoOfLectures, 
        calculateCourseDuration, calculateChapterTime, enrolledCourses,
        fetchUserEnrolledCourses, backendUrl

    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )

    
}

  