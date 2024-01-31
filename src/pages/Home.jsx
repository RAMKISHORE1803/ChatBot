import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Home.css";

import { auth } from "../config/firebase.js";
import { signOut } from "firebase/auth";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [loggedin, setLoggedin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await auth.currentUser;
        if (user) {
          console.log(user, "nice");
          setLoggedin(true);
        } else {
          console.log("Not logged in");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error checking user:", error);
      }
    };

    setTimeout(() => {
      checkUser();
    }, 2000);
  }, []);

  const navigateLogin = () => {
    navigate("/login");
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.log(error.message);
    }
  };

  const renderButtons = () => {
    if (loading) {
      return <div className="loading-spinner"></div>;
    }

    if (loggedin) {
      return (
        <Link to="/chat">
          <button onClick={navigateLogin} className="primary-button">
            Chat Now
          </button>
          <button onClick={logout} className="secondary-button">
            Logout
          </button>
        </Link>
      );
    }

    return (
      <>
        <Link to="/login">
          <button className="primary-button">Login</button>
        </Link>
        <Link to="/register">
          <button className="secondary-button">Signup</button>
        </Link>
      </>
    );
  };

  return (
    <div className="landing-page">
      <div className="center">
        <div className="header">
          <h1 className={loggedin ? "title hovered" : "title"}>
            Chatbot Application
          </h1>
          <p>Your Personal Assistant</p>
        </div>

        <div className="main-content">
          <p>Welcome to our Chatbot Application! Get started now.</p>
          <div className="cta-buttons">{renderButtons()}</div>
        </div>
      </div>

      <div className="footer">
        <p>&copy; 2024 Chatbot Application. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Home;
