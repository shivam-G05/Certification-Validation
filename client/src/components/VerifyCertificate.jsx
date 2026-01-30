import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { verifyCertificate } from '../utils/api';
import '../styles/VerifyCertificate.css';

const VerifyCertificate = () => {
  const [certId, setCertId] = useState('');
  const [loading, setLoading] = useState(false);
  const [certificate, setCertificate] = useState(null);
  const [error, setError] = useState('');

  const formRef = useRef(null);
  const resultRef = useRef(null);

  useEffect(() => {
    gsap.from(formRef.current, {
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    });
  }, []);

  useEffect(() => {
  if (certificate && resultRef.current) {
    gsap.fromTo(resultRef.current, 
      {
        scale: 0.8,
        opacity: 0
      },
      {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        ease: 'back.out(1.7)',
        clearProps: 'all' // ← This clears GSAP inline styles after animation
      }
    );
  }
}, [certificate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setCertificate(null);

    try {
      const result = await verifyCertificate(certId);
      
      setCertificate(result.certificate);
    } catch (err) {
      setError(err.response?.data?.error || 'Certificate not found');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <section className="verify-section">
      <div className="verify-container">
        <div ref={formRef} className="verify-card">
          <h2 className="section-title">
            Verify Certificate
            <span className="title-decoration"></span>
          </h2>

          <p className="verify-description">
            Enter the Certificate ID to verify its authenticity on the blockchain
          </p>

          <form onSubmit={handleSubmit} className="verify-form">
            <div className="form-group">
              <label htmlFor="certId">Certificate ID</label>
              <input
                type="text"
                id="certId"
                value={certId}
                onChange={(e) => setCertId(e.target.value)}
                placeholder="0x..."
                required
              />
            </div>

            <button type="submit" className="verify-btn" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Verifying...
                </>
              ) : (
                <>
                  <span className="verify-icon">🔍</span>
                  Verify Certificate
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="error-message">
              <span className="error-icon">❌</span>
              {error}
            </div>
          )}

          {certificate && (
            <div ref={resultRef} className={`certificate-result ${certificate.isValid ? 'valid' : 'invalid'}`}>
              <div className="status-badge">
                {certificate.isValid ? (
                  <>
                    <span className="badge-icon">✅</span>
                    <span>Valid Certificate</span>
                  </>
                ) : (
                  <>
                    <span className="badge-icon">⛔</span>
                    <span>Revoked Certificate</span>
                  </>
                )}
              </div>

              <div className="certificate-details">
                <div className="detail-row">
                  <div className="detail-icon">👤</div>
                  <div className="detail-content">
                    <span className="detail-label">Student Name</span>
                    <span className="detail-value">{certificate.studentName}</span>
                  </div>
                </div>

                <div className="detail-row">
                  <div className="detail-icon">📚</div>
                  <div className="detail-content">
                    <span className="detail-label">Course</span>
                    <span className="detail-value">{certificate.course}</span>
                  </div>
                </div>

                <div className="detail-row">
                  <div className="detail-icon">📅</div>
                  <div className="detail-content">
                    <span className="detail-label">Issue Date</span>
                    <span className="detail-value">{formatDate(certificate.issueDate)}</span>
                  </div>
                </div>

                <div className="detail-row">
                  <div className="detail-icon">🏢</div>
                  <div className="detail-content">
                    <span className="detail-label">Issuer Address</span>
                    <code className="detail-value address">{certificate.issuer}</code>
                  </div>
                </div>

                <div className="detail-row">
                  <div className="detail-icon">🔗</div>
                  <div className="detail-content">
                    <span className="detail-label">IPFS Hash</span>
                    <a 
                      href={`https://gateway.pinata.cloud/ipfs/${certificate.ipfsHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="detail-link"
                    >
                      View Certificate File
                    </a>
                  </div>
                </div>
              </div>

              <div className="verification-proof">
                <div className="proof-icon">🔐</div>
                <p>This certificate is cryptographically verified on the Ethereum blockchain</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default VerifyCertificate;