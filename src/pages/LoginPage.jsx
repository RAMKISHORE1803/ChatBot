import React, { useState } from "react";
import "./LoginPage.css";
import Image from "../assets/image 1.png";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { z } from "zod";

import { auth } from "../config/firebase.js";
import { signInWithEmailAndPassword } from "firebase/auth";

const usernameSchema = z.string().min(4).max(20);
const passwordSchema = z.string().min(8).max(30);

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [validated, setIsValidated] = useState(false);
  const [redirect, setRedirect] = useState(false);

  const validate = (e) => {
    e.preventDefault();
    try {
      usernameSchema.parse(username);
      passwordSchema.parse(password);
      setIsValidated(true);
    } catch (err) {
      setIsValidated(false);
      setError(err.message);
      console.log(err.message);
      alert("Password must contain a minimum of 8 characters");
    }
  };

  const signInUser = async (username, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        username,
        password
      );

      const user = auth.currentUser;
      console.log("User signed in:", user);
      navigate("/chat");
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(errorCode, errorMessage);
      alert(errorCode);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    validate(e);
    if (validated) {
      signInUser(username, password);
      setUsername("");
      setPassword("");
    }
  };

  return (
    <>
      <div className="container">
        <div className="image-container">
          <img
            src={Image}
            alt="Login Page Image"
            style={{
              maxHeight: "100vh",
              maxWidth: "100%",
              height: "100vh",
              width: "46.2vw",
              objectFit: "cover",
            }}
          />
        </div>
        <div className="login-form">
          <h1>Login</h1>
          <form onSubmit={handleSubmit} action="/login" method="post">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              placeholder="Enter your username"
              onChange={(e) => setUsername(e.target.value)}
            />
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <div style={{ display: "flex" }}>
              <input type="checkbox" id="remember-me" name="remember-me" />
              <label htmlFor="remember-me">Remember me</label>
            </div>
            <button type="submit">Login</button>
          </form>
          <p>
            Don't have an account? <Link to="/register">Create an account</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
