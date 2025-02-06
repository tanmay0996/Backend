import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import RegistrationForm from './components/RegistrationForm'
import VideoUpload from "./components/VideoUpload"
import LoginPage from './components/LoginPage.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <RegistrationForm/>
     <LoginPage/>
     <VideoUpload/>




  
    </>
  )
}

export default App
