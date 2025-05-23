// src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegistrationForm from './components/RegistrationForm';
import VideoUpload from './components/VideoUpload';
import LoginPage from './components/LoginPage.jsx';
import Homepage from './components/Homepage.jsx';
import Layout from './components/Layout';
import LikedVideos from './components/LikedVideos.jsx'
// import VideoPlayer from './components/VideoPlayer.jsx'
import VideoPlayer from './components/VideoPlayer.jsx';
import WatchHistory from './components/WatchHistory.jsx';

import './App.css';
import { AuthProvider } from './context/AuthContext.jsx';

function App() {
  return (
   <AuthProvider>
    <Router>
      <Routes>
        {/* All routes that share the same layout */}
        <Route element={<Layout />}>   {/* using it as a parent wrapper*/ }
          <Route path="/" element={<RegistrationForm />} />
          <Route path="/home" element={<Homepage />} />
          
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/video-upload" element={<VideoUpload />} />
          <Route path="/liked-videos" element={<LikedVideos />} />
          <Route path="/history" element={<WatchHistory />} />
        </Route>
        <Route path="video/v/:videoId" element={<VideoPlayer />} />
      </Routes>
    </Router>
    </AuthProvider> 
  );
}

export default App;
