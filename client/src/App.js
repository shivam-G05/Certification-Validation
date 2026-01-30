import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import gsap from 'gsap';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import IssueCertificate from './components/IssueCertificate';
import VerifyCertificate from './components/VerifyCertificate';
import Dashboard from './components/Dashboard';
import Footer from './components/Footer';
import './App.css';


function App() {
  useEffect(() => {
    // Animate background particles
    gsap.to('.particle', {
      y: 'random(-100, 100)',
      x: 'random(-100, 100)',
      duration: 'random(3, 5)',
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      stagger: {
        amount: 2,
        from: 'random'
      }
    });
  }, []);

  return (
     <Router>
      <div className="App">
        {/* Animated background particles */}
        <div className="background">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="particle" style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}></div>
          ))}
        </div>

        <Navbar />
        
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/issue" element={<IssueCertificate />} />
          <Route path="/verify" element={<VerifyCertificate />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>

        <Footer/>
      </div>
    </Router>
    
  );
}

export default App;