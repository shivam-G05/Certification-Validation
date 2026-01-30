import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';
import gsap from 'gsap';

const Navbar = () => {
  const navRef = useRef(null);
  const [account, setAccount] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    gsap.from(navRef.current, {
      y: -100,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    });

    // Check if wallet is already connected
    checkIfWalletIsConnected();
  }, []);

  // Check if MetaMask is installed
  const isMetaMaskInstalled = () => {
    return typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask;
  };

  // Check if wallet is already connected
  const checkIfWalletIsConnected = async () => {
    if (!isMetaMaskInstalled()) return;

    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        setAccount(accounts[0]);
      }
    } catch (error) {
      console.error('Error checking wallet connection:', error);
    }
  };

  // Connect to MetaMask
  const connectWallet = async () => {
    // Check if MetaMask is installed
    if (!isMetaMaskInstalled()) {
      setShowModal(true);
      return;
    }

    setIsConnecting(true);

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      setAccount(accounts[0]);

      // Listen for account changes
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      
      // Listen for chain changes
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });

    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
      
      if (error.code === 4001) {
        alert('Please connect to MetaMask to continue');
      } else {
        alert('Error connecting to MetaMask. Please try again.');
      }
    } finally {
      setIsConnecting(false);
    }
  };

  // Handle account changes
  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      setAccount(null);
      console.log('Please connect to MetaMask');
    } else {
      setAccount(accounts[0]);
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setAccount(null);
    // Note: MetaMask doesn't have a disconnect method, user must disconnect from extension
    alert('To fully disconnect, please disconnect from MetaMask extension');
  };

  // Format address for display
  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <nav ref={navRef} className="navbar">
        <div className="nav-container">
          <Link to="/" className="nav-logo">
            <span className="logo-icon">🔐</span>
            <span className="logo-text">CertiChain</span>
          </Link>

          <ul className="nav-menu">
            <li className="nav-item">
              <Link to="/" className="nav-link">Home</Link>
            </li>
            <li className="nav-item">
              <Link to="/issue" className="nav-link">Issue</Link>
            </li>
            <li className="nav-item">
              <Link to="/verify" className="nav-link">Verify</Link>
            </li>
            <li className="nav-item">
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
            </li>
          </ul>

          <div className="nav-cta">
            {account ? (
              <div className="wallet-connected">
                <span className="wallet-address">{formatAddress(account)}</span>
                <button className="disconnect-btn" onClick={disconnectWallet}>
                  Disconnect
                </button>
              </div>
            ) : (
              <button 
                className="connect-btn" 
                onClick={connectWallet}
                disabled={isConnecting}
              >
                {isConnecting ? 'Connecting...' : 'Connect Wallet'}
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* MetaMask Installation Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>×</button>
            
            <div className="modal-header">
              <h2>MetaMask Not Detected</h2>
              <p>You need MetaMask to connect your wallet</p>
            </div>

            <div className="modal-body">
              <div className="installation-steps">
                <h3>Installation Steps:</h3>
                
                <div className="step">
                  <span className="step-number">1</span>
                  <div className="step-content">
                    <h4>Visit MetaMask Website</h4>
                    <p>Go to <a href="https://metamask.io" target="_blank" rel="noopener noreferrer">metamask.io</a></p>
                  </div>
                </div>

                <div className="step">
                  <span className="step-number">2</span>
                  <div className="step-content">
                    <h4>Download Extension</h4>
                    <p>Click "Download" and select your browser (Chrome, Firefox, Brave, or Edge)</p>
                  </div>
                </div>

                <div className="step">
                  <span className="step-number">3</span>
                  <div className="step-content">
                    <h4>Install & Setup</h4>
                    <p>Follow the installation wizard to create a new wallet or import an existing one</p>
                  </div>
                </div>

                <div className="step">
                  <span className="step-number">4</span>
                  <div className="step-content">
                    <h4>Secure Your Wallet</h4>
                    <p><strong>Important:</strong> Write down your Secret Recovery Phrase and store it safely. Never share it with anyone!</p>
                  </div>
                </div>

                <div className="step">
                  <span className="step-number">5</span>
                  <div className="step-content">
                    <h4>Reload & Connect</h4>
                    <p>After installation, reload this page and click "Connect Wallet"</p>
                  </div>
                </div>
              </div>

              <div className="modal-actions">
                <a 
                  href="https://metamask.io/download/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="install-btn"
                >
                  Install MetaMask
                </a>
                <button className="cancel-btn" onClick={closeModal}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;