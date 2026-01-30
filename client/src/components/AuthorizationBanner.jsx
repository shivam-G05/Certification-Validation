import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import '../styles/AuthorizationBanner.css';

const AuthorizationBanner = ({ isAuthorized, owner, userAddress }) => {
  const bannerRef = useRef(null);

  // useEffect(() => {
  //   if (bannerRef.current) {
  //     gsap.from(bannerRef.current, {
  //       y: -100,
  //       opacity: 0,
  //       duration: 0.6,
  //       ease: 'power3.out'
  //     });
  //   }
  // }, []);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  if (isAuthorized) {
    return (
      <div ref={bannerRef} className="auth-banner success">
        <div className="banner-content">
          <div className="banner-icon">✅</div>
          <div className="banner-text">
            <h3>Congratulations! You are a Certified Issuer</h3>
            <p>You have permission to issue certificates on the blockchain</p>
          </div>
        </div>
        <div className="banner-address">
          <span className="address-label">Your Address:</span>
          <code className="address-value">{userAddress}</code>
        </div>
      </div>
    );
  }

  return (
    <div ref={bannerRef} className="auth-banner error">
      <div className="banner-content">
        <div className="banner-icon">⚠️</div>
        <div className="banner-text">
          <h3>Oops! You are not a Certified Issuer</h3>
          <p>You don't have permission to issue certificates. Please contact the contract owner.</p>
        </div>
      </div>
      
      <div className="banner-details">
        <div className="detail-row">
          <span className="detail-label">Your Wallet Address:</span>
          <div className="detail-value-wrapper">
            <code className="detail-value">{userAddress}</code>
            <button 
              onClick={() => copyToClipboard(userAddress)}
              className="copy-btn-small"
              title="Copy address"
            >
              📋
            </button>
          </div>
        </div>

        <div className="detail-row">
          <span className="detail-label">Contract Owner:</span>
          <div className="detail-value-wrapper">
            <code className="detail-value">{owner}</code>
            <button 
              onClick={() => copyToClipboard(owner)}
              className="copy-btn-small"
              title="Copy owner address"
            >
              📋
            </button>
          </div>
        </div>

        <div className="contact-info">
          <p>📧 Contact Owner: <a href="mailto:owner@certichain.com">owner@certichain.com</a></p>
          <p className="instructions">
            Include your wallet address (<strong>{userAddress.substring(0, 10)}...</strong>) in your email to request authorization.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthorizationBanner;