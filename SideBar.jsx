import React from 'react';
import '../App.css';
import Logo from '../assets/User.png';

const Sidebar = ({ theme, setTheme }) => {

  const handleThemeChange = () => {
    if (theme == "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  return (
    <div className="sidebar">
      <div className="logo-container">
        <div className="logo-shape">
          <div className='invoice-logo'></div>
          <div className="logo-inner"></div>
        </div>
      </div>
      <div className="sidebar-bottom">
        <button onChange={() => handleThemeChange()} className="theme-toggle">
          <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg">
            <path d="M19.502 11.342a.703.703 0 00-.588.128 7.499 7.499 0 01-2.276 1.336 7.556 7.556 0 01-2.585.451 7.503 7.503 0 01-7.5-7.5c0-1.102.24-2.145.664-3.074a7.504 7.504 0 011.244-2.034.703.703 0 00-.512-1.157 10.025 10.025 0 00-1.867.174C2.916 1.32.002 4.32.002 7.75c0 5.523 4.477 10 10 10 3.13 0 5.87-1.445 7.641-3.674a.703.703 0 00.113-.734h-.254z" fill="#7E88C3" fillRule="nonzero" />
          </svg>
        </button>
        <div className="sidebar-divider"></div>
        <div className="avatar-container">
          <img src={Logo} alt="User Avatar" className="user-avatar" />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;