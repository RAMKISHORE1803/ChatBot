import React, { useState } from "react";
import "./LoginPage.css";
import Image from "../assets/image 1.png";
import { Link, Navigate } from "react-router-dom";
import { z } from "zod";

import { auth } from "../config/firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { db } from "../config/firebase.js";
import { collection, addDoc, setDoc, doc } from "firebase/firestore";

const usernameSchema = z.string().min(4).max(20);
const passwordSchema = z.string().min(8).max(30);

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [validated, setIsValidated] = useState(false);
  const [redirect, setRedirect] = useState(false);
  {
    /******************************************************************************************************/
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
    /******************************************************************************************************/
  }
  const createCollection = async (userId, userEmail) => {
    try {
      const usersCollectionRef = collection(db, "users");
      const userDocumentRef = doc(usersCollectionRef, userId);

      // Set user data in the 'userData' subcollection
      const userDataCollectionRef = collection(userDocumentRef, "userData");
      const userDataDocumentRef = doc(userDataCollectionRef, `user: ${userId}`);
      await setDoc(userDataDocumentRef, {
        userId: userId,
        username: userEmail,
      });

      console.log("Document and subcollections added to users collection");
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };
  {
    /******************************************************************************************************/
  }
  const signUp = async (username, password) => {
    try {
      // Create user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        username,
        password
      );
      console.log("User created with email and password");

      // Get the current user
      const user = auth.currentUser;
      const userEmail = user.email;
      const userId = user.uid;
      // Sign in the created user
      await signInWithEmailAndPassword(auth, username, password);
      console.log("User created and signed in:", user);

      createCollection(userId, userEmail);
      console.log("collecton created successfully");

      setRedirect(true);
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(errorCode, errorMessage);
      alert(errorCode);
    }
  };
  {
    /******************************************************************************************************/
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    validate(e);
    if (validated) {
      signUp(username, password);
      setUsername("");
      setPassword("");
      setConfirmPassword("");
    }
  };
  {
    /******************************************************************************************************/
  }
  return (
    <>
      {redirect && <Navigate to="/chat" />}
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
          <h1>Register</h1>
          <form onSubmit={handleSubmit} action="/register" method="post">
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
            <input
              type="password"
              id="confirm-password"
              name="password"
              value={confirmPassword}
              placeholder="Re-Enter your password"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <div style={{ display: "flex" }}>
              <input type="checkbox" id="remember-me" name="remember-me" />
              <label htmlFor="remember-me">Remember me</label>
            </div>
            <button type="submit">Register</button>
          </form>
          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
