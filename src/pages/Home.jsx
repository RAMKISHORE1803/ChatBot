import React, { useState } from "react";
import "./Home.css";
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const navigateLogin = () => {
    navigate("/login");
  };

  const navigateRegister = () => {
    navigate("/register");
  };

  const handleTitleHover = () => {
    setIsHovered(true);
  };

  const handleTitleLeave = () => {
    setIsHovered(false);
  };

  return (
    <div className="landing-page">
      <div className="center">
        <div className="header">
          <h1
            className={isHovered ? "title hovered" : "title"}
            onMouseEnter={handleTitleHover}
            onMouseLeave={handleTitleLeave}
          >
            Chatbot Application
          </h1>
          <p>Your Personal Assistant</p>
        </div>

        <div className="main-content">
          <p>Welcome to our Chatbot Application! Get started now.</p>

          <div className="cta-buttons">
            <button onClick={navigateLogin} className="primary-button">
              <Link to="/login" />
              Login
            </button>
            <button onClick={navigateRegister} className="secondary-button">
              Signup
            </button>
          </div>
        </div>
      </div>

      <div className="footer">
        <p>&copy; 2024 Chatbot Application. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Home;
