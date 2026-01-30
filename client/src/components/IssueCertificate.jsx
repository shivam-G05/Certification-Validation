import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { uploadCertificate, issueCertificate, checkAuthorization, connectWallet, getCurrentAccount,getBalance } from '../utils/api';
import AuthorizationBanner from './AuthorizationBanner';
import '../styles/IssueCertificate.css';

const IssueCertificate = () => {


  
  const [formData, setFormData] = useState({
    studentName: '',
    course: '',
    file: null
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  
  // Authorization states
  const [userAddress, setUserAddress] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [owner, setOwner] = useState('');
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [balance, setBalance] = useState('0');

  const formRef = useRef(null);
  const resultRef = useRef(null);

  useEffect(() => {
    checkWalletConnection();
    
    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', () => window.location.reload());
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);

  useEffect(() => {
    if (formRef.current && !checkingAuth) {
      gsap.from(formRef.current, {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
      });
    }
  }, [checkingAuth]);

  useEffect(() => {
    if (result && resultRef.current) {
      gsap.from(resultRef.current, {
        scale: 0.8,
        opacity: 0,
        duration: 0.5,
        ease: 'back.out(1.7)'
      });
    }
  }, [result]);

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      setUserAddress(null);
      setIsAuthorized(false);
      showAlert('error', 'Wallet Disconnected', 'Please connect your wallet to continue');
    } else {
      setUserAddress(accounts[0]);
      checkUserAuthorization(accounts[0]);
      checkUserBalance(accounts[0]);
    }
  };

  const checkWalletConnection = async () => {
    setCheckingAuth(true);
    
    // Check if MetaMask is installed
    if (!window.ethereum) {
      showAlert('error', 'MetaMask Not Detected', 'Please install MetaMask extension to use this application. Visit https://metamask.io');
      setCheckingAuth(false);
      return;
    }

    try {
      const address = await getCurrentAccount();
      
      if (address) {
        setUserAddress(address);
        await checkUserAuthorization(address);
        await checkUserBalance(address);
      } else {
        showAlert('warning', 'Wallet Not Connected', 'Please connect your MetaMask wallet to continue');
      }
    } catch (error) {
      console.error('Wallet check error:', error);
      showAlert('error', 'Connection Error', 'Error checking wallet connection');
    } finally {
      setCheckingAuth(false);
    }
  };

  const checkUserAuthorization = async (address) => {
    try {
      const authData = await checkAuthorization(address);
      setIsAuthorized(authData.isAuthorized);
      setOwner(authData.owner);
      
      if (!authData.isAuthorized) {
        showAlert(
          'error',
          'Not Authorized',
          `You are not a certified issuer. Please contact the contract owner to share your wallet address (${address.substring(0, 10)}...${address.substring(address.length - 8)}) to become a certified issuer.`
        );
      }
    } catch (error) {
      console.error('Authorization check error:', error);
      showAlert('error', 'Authorization Check Failed', 'Could not verify your issuer status');
    }
  };

  const checkUserBalance = async (address) => {
  try {
    const balanceInEth = await getBalance(address);
    setBalance(balanceInEth);
    
    console.log('✅ Balance check:', balanceInEth, 'Sepolia ETH');
    
    // Only show warning if balance is critically low (less than 0.001 ETH)
    // 0.0895 ETH is plenty for transactions
    if (parseFloat(balanceInEth) < 0.001) {
      showAlert(
        'warning',
        'Low Balance',
        `Your wallet has only ${parseFloat(balanceInEth).toFixed(6)} Sepolia ETH. You may not have enough to issue certificates. Get free Sepolia ETH from faucets.`
      );
    } else {
      console.log('✅ Balance is sufficient:', balanceInEth, 'ETH');
    }
  } catch (error) {
    console.error('❌ Balance check error:', error);
    setBalance('0');
  }
};

  const handleConnectWallet = async () => {
    // Check if MetaMask is installed
    if (!window.ethereum) {
      showAlert(
        'error',
        'MetaMask Not Installed',
        'MetaMask is not installed in your browser. Please install MetaMask from https://metamask.io to continue.'
      );
      return;
    }

    try {
      const address = await connectWallet();
      setUserAddress(address);
      await checkUserAuthorization(address);
      await checkUserBalance(address);
      showAlert('success', 'Wallet Connected', `Successfully connected to ${address.substring(0, 10)}...`);
    } catch (error) {
      console.error('Connect wallet error:', error);
      
      if (error.code === 4001) {
        showAlert('warning', 'Connection Rejected', 'You rejected the connection request. Please try again.');
      } else {
        showAlert('error', 'Connection Failed', 'Failed to connect wallet. Please try again.');
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, file: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Pre-submission checks
    if (!window.ethereum) {
      showAlert('error', 'MetaMask Not Found', 'Please install MetaMask to issue certificates');
      return;
    }

    if (!userAddress) {
      showAlert('error', 'Wallet Not Connected', 'Please connect your wallet first');
      return;
    }

    if (!isAuthorized) {
      showAlert(
        'error',
        'Not Authorized',
        'You are not a certified issuer. Contact the owner to request authorization.'
      );
      return;
    }

    // Check balance before proceeding
    // Check balance before proceeding - only warn if extremely low
if (parseFloat(balance) < 0.0001) { // Changed from 0.001 to 0.0001
  const proceed = window.confirm(
    `Your balance is very low (${parseFloat(balance).toFixed(6)} ETH). Transaction may fail. Do you want to continue?`
  );
  if (!proceed) return;
}

    setLoading(true);
    setError('');
    setResult(null);

    try {
      // Step 1: Upload to IPFS
      showAlert('info', 'Uploading...', 'Uploading certificate to IPFS...');
      const uploadResult = await uploadCertificate(formData.file, formData.studentName);
      console.log('Upload result:', uploadResult);
      
      // Step 2: Issue on blockchain
      showAlert('info', 'Processing...', 'Issuing certificate on blockchain. Please confirm the transaction in MetaMask...');
      const issueResult = await issueCertificate(
        formData.studentName,
        formData.course,
        uploadResult.ipfsHash
      );

      setResult({
        ...issueResult,
        ipfsUrl: uploadResult.url
      });

      // Success alert
      showAlert(
        'success',
        'Certificate Issued!',
        'Certificate has been successfully issued on the blockchain!'
      );

      // Reset form
      setFormData({ studentName: '', course: '', file: null });
      e.target.reset();
      
      // Update balance after transaction
      await checkUserBalance(userAddress);
      
    } catch (err) {
      console.error('Issue certificate error:', err);
      
      // Handle specific errors
      if (err.code === 4001) {
        showAlert('warning', 'Transaction Rejected', 'You rejected the transaction in MetaMask');
      } else if (err.message.includes('insufficient funds')) {
        showAlert(
          'error',
          'Insufficient Funds',
          'You don\'t have enough Sepolia ETH to complete this transaction. Get free Sepolia ETH from faucets like https://sepoliafaucet.com'
        );
      } else if (err.message.includes('Not an authorized issuer')) {
        showAlert(
          'error',
          'Not Authorized',
          'You are not authorized to issue certificates. Contact the contract owner.'
        );
      } else {
        const errorMsg = err.response?.data?.error || err.message || 'Failed to issue certificate';
        showAlert('error', 'Error', errorMsg);
        setError(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  // Alert system
  const showAlert = (type, title, message) => {
    // Create custom alert with better styling
    const alertDiv = document.createElement('div');
    alertDiv.className = `custom-alert alert-${type}`;
    
    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };
    
    alertDiv.innerHTML = `
      <div class="alert-content">
        <div class="alert-icon">${icons[type] || 'ℹ️'}</div>
        <div class="alert-text">
          <div class="alert-title">${title}</div>
          <div class="alert-message">${message}</div>
        </div>
        <button class="alert-close" onclick="this.parentElement.parentElement.remove()">×</button>
      </div>
    `;
    
    document.body.appendChild(alertDiv);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      if (alertDiv.parentElement) {
        alertDiv.classList.add('alert-fade-out');
        setTimeout(() => alertDiv.remove(), 300);
      }
    }, 5000);
  };

  if (checkingAuth) {
    return (
      <section className="issue-section">
        <div className="loading-container">
          <div className="spinner-large"></div>
          <p>Checking authorization...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="issue-section">
      {/* Show wallet connection prompt if not connected */}
      {!userAddress && (
        <div className="wallet-prompt">
          <div className="wallet-prompt-content">
            <div className="wallet-icon">🦊</div>
            <h3>Connect Your Wallet</h3>
            <p>Please connect your MetaMask wallet to issue certificates</p>
            {!window.ethereum && (
              <div className="metamask-warning">
                <p>⚠️ MetaMask not detected. Please install it first.</p>
                <a 
                  href="https://metamask.io/download/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="install-metamask-btn"
                >
                  Install MetaMask
                </a>
              </div>
            )}
            {window.ethereum && (
              <button onClick={handleConnectWallet} className="connect-wallet-btn">
                Connect MetaMask
              </button>
            )}
          </div>
        </div>
      )}

      
      {userAddress && (
        <div className="top-info-container">
          <div className="left-info">
            <AuthorizationBanner 
              isAuthorized={isAuthorized}
              owner={owner}
              userAddress={userAddress}
            />
          </div>
          
          <div className="right-info">
            {/* Balance indicator */}
            <div className="balance-indicator">
              <span className="balance-label">Wallet Balance:</span>
              <span className={`balance-value ${parseFloat(balance) < 0.0001 ? 'low' : 'sufficient'}`}>
                {parseFloat(balance).toFixed(6)} Sepolia ETH
              </span>
              {parseFloat(balance) < 0.0001 ? (
                <span className="balance-warning">⚠️ Insufficient</span>
              ) : (
                <span className="balance-ok">✅ Sufficient</span>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="issue-container">
        <div ref={formRef} className="issue-card">
          <h2 className="section-title">
            Issue New Certificate
            <span className="title-decoration"></span>
          </h2>

          <form onSubmit={handleSubmit} className="issue-form">
            <div className="form-group">
              <label htmlFor="studentName">Student Name</label>
              <input
                type="text"
                id="studentName"
                name="studentName"
                value={formData.studentName}
                onChange={handleInputChange}
                required
                placeholder="Enter student name"
                disabled={!isAuthorized}
              />
            </div>

            <div className="form-group">
              <label htmlFor="course">Course Name</label>
              <input
                type="text"
                id="course"
                name="course"
                value={formData.course}
                onChange={handleInputChange}
                required
                placeholder="Enter course name"
                disabled={!isAuthorized}
              />
            </div>

            <div className="form-group">
              <label htmlFor="certificate">Certificate File (PDF/Image)</label>
              <div className="file-input-wrapper">
                <input
                  type="file"
                  id="certificate"
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png"
                  required
                  disabled={!isAuthorized}
                />
                <div className={`file-input-display ${!isAuthorized ? 'disabled' : ''}`}>
                  {formData.file ? formData.file.name : 'Choose file...'}
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              className="submit-btn" 
              disabled={loading || !isAuthorized}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Processing...
                </>
              ) : !isAuthorized ? (
                'Not Authorized'
              ) : (
                'Issue Certificate'
              )}
            </button>
          </form>

          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          {result && (
            <div ref={resultRef} className="success-result">
              <div className="success-icon">✅</div>
              <h3>Certificate Issued Successfully!</h3>
              
              <div className="result-details">
                <div className="detail-item">
                  <span className="detail-label">Certificate ID:</span>
                  <code className="detail-value">{result.certId}</code>
                </div>
                
                <div className="detail-item">
                  <span className="detail-label">Transaction Hash:</span>
                  <a 
                    href={`https://sepolia.etherscan.io/tx/${result.transactionHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="detail-link"
                  >
                    View on Etherscan
                  </a>
                </div>

                <div className="detail-item">
                  <span className="detail-label">IPFS URL:</span>
                  <a 
                    href={result.ipfsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="detail-link"
                  >
                    View Certificate
                  </a>
                </div>
              </div>

              <button 
                onClick={() => {
                  navigator.clipboard.writeText(result.certId);
                  showAlert('success', 'Copied!', 'Certificate ID copied to clipboard');
                }}
                className="copy-btn"
              >
                Copy Certificate ID
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default IssueCertificate;