import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import '../styles/Hero.css';

const Hero = () => {
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();
    
    tl.from(titleRef.current, {
      y: 100,
      opacity: 0,
      duration: 1,
      ease: 'power4.out'
    })
    .from(subtitleRef.current, {
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    }, '-=0.5')
    .from(ctaRef.current.children, {
      y: 30,
      opacity: 0,
      duration: 0.6,
      stagger: 0.2,
      ease: 'back.out(1.7)'
    }, '-=0.4');
  }, []);

  return (
    <section ref={heroRef} className="hero">
      <div className="hero-content">
        <h1 ref={titleRef} className="hero-title">
          Blockchain-Powered
          <br />
          <span className="gradient-text">Certificate Verification</span>
        </h1>
        
        <p ref={subtitleRef} className="hero-subtitle">
          Issue, verify, and manage certificates on the Ethereum blockchain.
          Immutable, transparent, and trustless certification.
        </p>

        <div ref={ctaRef} className="hero-cta">
          <Link to="/issue" className="cta-btn primary">
            Issue Certificate
          </Link>
          <Link to="/verify" className="cta-btn secondary">
            Verify Certificate
          </Link>
        </div>

        <div className="hero-stats">
          <div className="stat-item">
            <div className="stat-number">100%</div>
            <div className="stat-label">Tamper-Proof</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">∞</div>
            <div className="stat-label">Forever Valid</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">⚡</div>
            <div className="stat-label">Instant Verify</div>
          </div>
        </div>
      </div>

      <div className="hero-visual">
        <div className="blockchain-animation">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="block" style={{ animationDelay: `${i * 0.2}s` }}>
              <div className="block-inner"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;