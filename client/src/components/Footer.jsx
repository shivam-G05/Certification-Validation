import React from 'react';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">CertiChain</h3>
            <p className="footer-description">
              Blockchain-powered certificate verification system built on Ethereum.
            </p>
            <div className="social-links">
              <a href="https://github.com/shivam-G05" target="_blank" rel="noopener noreferrer" className="social-link">
                GitHub
              </a>
              <a href="https://x.com/shivamgoel72747" target="_blank" rel="noopener noreferrer" className="social-link">
                Twitter
              </a>
              <a href="https://www.linkedin.com/in/shivam-goel-6236432a8/" target="_blank" rel="noopener noreferrer" className="social-link">
                LinkedIn
              </a>
            </div>
          </div>

          <div className="footer-section">
            <h4 className="footer-subtitle">Quick Links</h4>
            <ul className="footer-links">
              <li><a href="/">Home</a></li>
              <li><a href="/issue">Issue Certificate</a></li>
              <li><a href="/verify">Verify Certificate</a></li>
              <li><a href="/dashboard">Dashboard</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-subtitle">Technology</h4>
            <ul className="footer-tech">
              <li>⚡ Solidity Smart Contracts</li>
              <li>🔗 Ethereum Blockchain</li>
              <li>📦 IPFS Storage</li>
              <li>⚛️ React Frontend</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2025 CertiChain. Built with blockchain technology.</p>
          <p className="footer-credit">Powered by @shivamkgjj2005@gmail.com</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;