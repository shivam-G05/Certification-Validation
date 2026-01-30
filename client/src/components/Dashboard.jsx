import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import contractData from '../contractData.json';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const dashboardRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from('.stat-card', {
        y: 50,
        opacity: 0,
        duration: 0.5,
        
        ease: 'power3.out',
        clearProps: 'all'
      });
    }, dashboardRef);

    return () => ctx.revert(); // Cleanup on unmount
  }, []);

  return (
    <section ref={dashboardRef} className="dashboard-section">
      <div className="dashboard-container">
        <h2 className="section-title">
          Dashboard
          <span className="title-decoration"></span>
        </h2>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📜</div>
            <div className="stat-content">
              <h3 className="stat-title">Smart Contract</h3>
              <p className="stat-description">Deployed on Sepolia</p>
              <a 
                href={`https://sepolia.etherscan.io/address/${contractData.address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="stat-link"
              >
                View on Etherscan
              </a>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🔒</div>
            <div className="stat-content">
              <h3 className="stat-title">Security</h3>
              <p className="stat-description">Immutable & Tamper-Proof</p>
              <div className="stat-badge">
                <span className="badge-dot"></span>
                Active
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⚡</div>
            <div className="stat-content">
              <h3 className="stat-title">Network</h3>
              <p className="stat-description">Ethereum Sepolia Testnet</p>
              <div className="stat-badge">
                <span className="badge-dot green"></span>
                Online
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <h3 className="stat-title">Features</h3>
              <ul className="feature-list">
                <li>✅ Issue Certificates</li>
                <li>✅ Verify Authenticity</li>
                <li>✅ Revoke Certificates</li>
                <li>✅ IPFS Storage</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="contract-info">
          <h3 className="info-title">Contract Information</h3>
          
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Contract Address:</span>
              <code className="info-value">{contractData.address}</code>
              <button 
                onClick={() => navigator.clipboard.writeText(contractData.address)}
                className="copy-icon"
                title="Copy to clipboard"
              >
                📋
              </button>
            </div>

            <div className="info-item">
              <span className="info-label">Network:</span>
              <span className="info-value">Sepolia Testnet</span>
            </div>

            <div className="info-item">
              <span className="info-label">Chain ID:</span>
              <span className="info-value">11155111</span>
            </div>
          </div>
        </div>

        <div className="how-it-works">
          <h3 className="section-subtitle">How It Works</h3>
          
          <div className="steps-container">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h4>Upload Certificate</h4>
                <p>Upload your certificate file (PDF/Image) to IPFS decentralized storage</p>
              </div>
            </div>

            <div className="step-arrow">→</div>

            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h4>Issue on Blockchain</h4>
                <p>Certificate data is permanently recorded on Ethereum blockchain</p>
              </div>
            </div>

            <div className="step-arrow">→</div>

            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h4>Verify Anytime</h4>
                <p>Anyone can verify certificate authenticity using Certificate ID</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;