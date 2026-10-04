# Edemy - Learning Management System (LMS)

Welcome to **Edemy LMS Platform**, a modern, full-stack Learning Management System designed to bridge the gap between enthusiastic learners and knowledgeable educators.

### 🌐 Live Links
- **Frontend (Live Demo):** [https://edemy-lms-education-platform.vercel.app/]
- **Backend (API):** [https://edemy-lms-backend-server.vercel.app/]

## 🚀 Features

- **Authentication System:** Secure student and instructor sign-in using [Clerk](https://clerk.dev/).
- **Multi-Role Dashboards:**
  - **Student Portal:** Browse courses, view detailed curriculum, play videos, and track course enrollments via a dedicated progress dashboard.
  - **Educator Dashboard:** Securely gated (Admin only) dashboard to add new courses, track student enrollment, and monitor metrics.
- **Payment Integration:** Secure and seamless checkout experience powered by [Razorpay](https://razorpay.com/).
- **Rich Media & Storage:** Course thumbnail and video management supported by [Cloudinary](https://cloudinary.com/).
- **Responsive UI:** A beautifully designed frontend tailored with Tailwind CSS that adapts flawlessly to any screen size.

## 💻 Tech Stack

### Frontend (Client)
- **Framework:** [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **State/Routing:** React Context API & React Router DOM
- **Authentication:** Clerk React
- **UI Libraries:** React Hot Toast, React Simple Star Rating, rc-progress

### Backend (Server)
- **Environment:** [Node.js](https://nodejs.org/) & [Express](https://expressjs.com/)
- **Database:** [MongoDB](https://www.mongodb.com/) (Mongoose)
- **Payment Gateway:** Razorpay API
- **Webhooks:** Svix
- **File Uploads:** Multer & Cloudinary

## 🛠️ Project Structure

This project is organized into two main directories:

```text
LMS Website/
├── client/         # React + Vite frontend application
└── server/         # Node.js + Express backend API
```

## 🏃‍♂️ How to Run Locally

### 1. Setup the Backend
Open a terminal and navigate to the server directory:
```bash
cd server
npm install
```
Create a `.env` file in the `server` folder with your private API keys (MongoDB URL, Clerk Secret, Razorpay keys, Cloudinary credentials).
Then, start the backend server:
```bash
npm run server 
```

### 2. Setup the Frontend
Open another terminal and navigate to the client directory:
```bash
cd client
npm install
```
Create a `.env.local` file with your Clerk Publishable Key (`VITE_CLERK_PUBLISHABLE_KEY`).
Start the Vite development server:
```bash
npm run dev
```

The application frontend will be running at `http://localhost:5173`.
