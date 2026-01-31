import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import '../styles/navbar.css';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    navigate('/');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
  };

  const linkVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.1 },
    }),
  };

  const isAuthenticated = location.pathname === '/user-dashboard' || location.pathname === '/admin-dashboard';

  return (
    <nav className={isScrolled ? 'scrolled' : ''}>
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <div className="logo-icon">
            <Sparkles size={24} />
          </div>
          <div className="logo-text">
            <h1>Skill Connect</h1>
            <p>Professional Network</p>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="nav-links-desktop">
          {isAuthenticated ? (
            <>
              <Link
                to={location.pathname === '/user-dashboard' ? '/user-dashboard' : '/admin-dashboard'}
                className="nav-link"
              >
                Dashboard
              </Link>
              <button onClick={handleLogout} className="nav-button">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/" className="nav-link">
                Home
              </Link>
              <Link to="/old-age-homes" className="nav-link">
                Donate to Homes
              </Link>
              <Link to="/orphans" className="nav-link">
                Donate to Orphans
              </Link>
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/signup" className="nav-button">
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button className="mobile-menu-btn" onClick={toggleMenu}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        </div>

      </div>

      {/* Mobile Menu */}
      <div className={`nav-links-mobile ${isMenuOpen ? 'open' : ''}`}>
        {isAuthenticated ? (
          <>
            <Link
              to={location.pathname === '/user-dashboard' ? '/user-dashboard' : '/admin-dashboard'}
              onClick={() => setIsMenuOpen(false)}
              className="mobile-nav-item"
            >
              Dashboard
            </Link>
            <button onClick={handleLogout} className="mobile-nav-button">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className="mobile-nav-item"
            >
              Home
            </Link>
            <Link
              to="/old-age-homes"
              onClick={() => setIsMenuOpen(false)}
              className="mobile-nav-item"
            >
              Donate to Homes
            </Link>
            <Link
              to="/orphans"
              onClick={() => setIsMenuOpen(false)}
              className="mobile-nav-item"
            >
              Donate to Orphans
            </Link>
            <Link
              to="/login"
              onClick={() => setIsMenuOpen(false)}
              className="mobile-nav-item"
            >
              Login
            </Link>
            <Link
              to="/signup"
              onClick={() => setIsMenuOpen(false)}
              className="mobile-nav-button"
            >
              Get Started
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
