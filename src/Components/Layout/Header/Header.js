import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";

function Header({ user, onLogin, onLogout }) {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="header__left"></div>

      <div className="header__center">
        <Link to="/" className="header__nav-item">
          <span className="header__icon">🏠</span>
          <span className="header__text">Home</span>
        </Link>
        <Link to="/about" className="header__nav-item">
          <span className="header__icon">ℹ️</span>
          <span className="header__text">About</span>
        </Link>
      </div>

      <div className="header__right">
        {user ? (
          <div className="header__user">
            <Link to={`/profile/${user.id}`}>
              <img src={user.avatar} alt="Avatar" className="header__avatar" />
            </Link>
            <span className="header__greeting">
              Hi {user.firstname} {user.lastname}
            </span>
            <button className="header__logout-btn" onClick={onLogout}>
              Logout
            </button>
          </div>
        ) : (
          <div className="header__login">
            <span className="header__login-text" onClick={handleLogin}>
              Please Login
            </span>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
