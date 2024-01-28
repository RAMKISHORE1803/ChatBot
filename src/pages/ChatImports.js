// ChatImports.js
import React from "react";
import { useRef, useState, useEffect } from "react";
import TextareaAutosize from "react-textarea-autosize";
import "react-chat-elements/dist/main.css";
import { ChatItem, MessageBox } from "react-chat-elements";
import { GoogleGenerativeAI } from "@google/generative-ai";

import chatIcon from "../assets/chat.png";
import usericon from "../assets/user.png";
import roboticon from "../assets/robot.png";

import {
  containerStyle,
  rightDiv,
  leftDiv,
  responseStyle,
  buttonStyle,
  inputStyle,
} from "./ChatStyles";

import { safetySettings, generationConfig } from "./ChatSettings";

export {
  React,
  useRef,
  useState,
  useEffect,
  TextareaAutosize,
  ChatItem,
  MessageBox,
  GoogleGenerativeAI,
  chatIcon,
  usericon,
  roboticon,
  containerStyle,
  rightDiv,
  leftDiv,
  responseStyle,
  buttonStyle,
  inputStyle,
  safetySettings,
  generationConfig,
};
