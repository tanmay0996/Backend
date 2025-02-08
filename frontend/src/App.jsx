// src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegistrationForm from './components/RegistrationForm';
import VideoUpload from './components/VideoUpload';
import LoginPage from './components/LoginPage.jsx';
import Homepage from './components/Homepage.jsx';
import Layout from './components/Layout';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* All routes that share the same layout */}
        <Route element={<Layout />}>   {/* using it as a parent wrapper*/ }
          <Route path="/" element={<Homepage />} />
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/video-upload" element={<VideoUpload />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
