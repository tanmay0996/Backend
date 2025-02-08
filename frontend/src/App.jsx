import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import RegistrationForm from './components/RegistrationForm'
import VideoUpload from "./components/VideoUpload"
import LoginPage from './components/LoginPage.jsx'

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Homepage from "./components/Homepage.jsx";


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     {/* <RegistrationForm/>
     <LoginPage/>
     <VideoUpload/> */}

<div className="flex h-screen bg-black text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <Homepage />
      </div>
    </div>
     





  
    </>
  )
}

export default App
