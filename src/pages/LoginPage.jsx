import React, { useState } from "react";
import "./LoginPage.css";
import Image from "../assets/image 1.png";
import { z } from "zod";
import { Link } from "react-router-dom";

import { auth } from "../config/firebase.js";
import { signInWithEmailAndPassword } from "firebase/auth";

const usernameSchema = z.string().min(4).max(20);
const passwordSchema = z.string().min(8).max(30);

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [validated, setIsValidated] = useState(false);
  {
    /**************************************************************************************************/
  }
  const validate = (e) => {
    e.preventDefault();
    try {
      if (password !== confirmPassword) {
        alert("Passwords do not match");
        throw new Error("Passwords do not match");
      }
      usernameSchema.parse(username);
      passwordSchema.parse(password);
      setIsValidated(true);
    } catch (err) {
      setIsValidated(false);
      setError(err.message);
      console.log(err.message); // Access the message property within the array
      alert("Password must contain a minimum of 8 characters");
    }
  };
  {
    /**************************************************************************************************/
  }
  const signIn = async (username, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        username,
        password
      );
      const user = auth.currentUser;
      console.log(user);
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
      alert(errorCode);
    }
  };
  {
    /**************************************************************************************************/
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    validate(e);
    if (validated) {
      signIn(username, password);
      setUsername("");
      setPassword("");
      setConfirmPassword("");
    }
  };
  {
    /**************************************************************************************************/
  }
  return (
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
            placeholder="Enter your username"
            onChange={(e) => setUsername(e.target.value)}
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <div style={{ display: "flex" }}>
            <input type="checkbox" id="remember-me" name="remember-me" />
            <label htmlFor="remember-me">Remember me</label>
          </div>
          <button type="submit">Login</button>
          <a href="/forgot-password">Forgot Password?</a>
        </form>
        <p>
          Don't have an account? <Link to="/register">Create an account</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
