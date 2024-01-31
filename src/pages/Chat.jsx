// prettier-ignore
import { React, useRef, useState, useEffect, TextareaAutosize, GoogleGenerativeAI, chatIcon, usericon, containerStyle, rightDiv, leftDiv, responseStyle, buttonStyle, inputStyle, safetySettings, generationConfig, roboticon } from "./ChatImports";
import { API_KEY } from "../../config";
import "./Chat.css";
import { Flex, Text, Card, Avatar, Box } from "@radix-ui/themes";
import { useNavigate } from "react-router-dom";

import { auth } from "../config/firebase.js";
import { signOut } from "firebase/auth";
import { db } from "../config/firebase.js";
import { collection, setDoc, doc, getDocs, getDoc } from "firebase/firestore";

const Chat = () => {
  const navigate = useNavigate();
  const promptRef = useRef(null);
  const [content, setContent] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [gettingResponse, setGettingResponse] = useState(false);
  const [isSafe, setIsSafe] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loggedin, setLoggedin] = useState(false);
  const [prevChats, setPrevChats] = useState([]);
  let response = "";
  let user = null;
  //let prevChats = [];

  {
    /********************************************************************************************************8*/
  }
  useEffect(() => {
    const fetchData = async () => {
      setTimeout(() => {
        user = auth.currentUser;
        if (user) {
          console.log(user, "nice");
          setLoading(false); // Set loading to false if user exists
        } else {
          navigate("/login");
          console.log("Not logged in");
          setLoading(true);
        }
      }, 2000);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!loading) {
      setLoggedin(true);
    } else {
      setLoggedin(false);
    }
  }, [loading]);

  useEffect(() => {
    setTimeout(() => {
      getChatHistory();
    }, 2000);
  }, [loading]);

  // useEffect(() => {
  //   console.log("control reached useeffect hook");
  //   console.log("chat history", chatHistory);
  // }, [chatHistory]);
  {
    /********************************************************************************************************8*/
  }
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleClick();
    }
  };
  {
    /********************************************************************************************************8*/
  }
  const handleClick = async () => {
    console.log("control reached handleClick");
    setGettingResponse(!gettingResponse);
    const prompt = promptRef.current.value;
    const userMsg = {
      role: "user",
      parts: `${prompt}`,
    };
    console.log("user msg generated");
    setChatHistory((prevChatHistory) => [...prevChatHistory, userMsg]);
    promptRef.current.value = "";

    const MODEL_NAME = "gemini-pro";
    const myApiKey = API_KEY;
    const genAI = new GoogleGenerativeAI(myApiKey);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    const chat = model.startChat({
      generationConfig,
      safetySettings,
      history: chatHistory,
    });

    try {
      const result = await chat.sendMessage(prompt);
      response = result.response.text();
    } catch (err) {
      console.log("control reached catch (err)");
      setIsSafe(false);
      console.log(err);
      setGettingResponse(false);
      response = "Sorry, I can not provide a response for that..";
      setContent(response);
      setIsSafe(true);
    }

    if (isSafe) {
      const modelMsg = {
        role: "model",
        parts: `${response}`,
      };
      setGettingResponse(false);

      console.log("model msg generated");
      setContent(response);
      setChatHistory((prevChatHistory) => [...prevChatHistory, modelMsg]);
    } else {
      const modelMsg = {
        role: "model",
        parts: "Sorry, I can not provide a response for that..",
      };
      setGettingResponse(false);
      console.log("model msg generated");
      setChatHistory((prevChatHistory) => [...prevChatHistory, modelMsg]);
    }
  };
  {
    /********************************************************************************************************8*/
  }
  const newChat = async () => {
    if (auth && chatHistory) {
      const userId = auth.currentUser.uid;
      const date = new Date();
      const time = date.toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: true,
      });

      const usersCollectionRef = collection(db, "users");
      const documentId = userId;
      const userDocumentRef = doc(usersCollectionRef, documentId);
      const chatsCollectionRef = collection(userDocumentRef, "chats");
      const chatsDocumentRef = doc(chatsCollectionRef, `chats: ${time}`);
      try {
        await setDoc(chatsDocumentRef, {
          time: time,
          chatHistory: chatHistory,
        });
      } catch (error) {
        console.log(error);
      }
      setChatHistory([]);
      setContent("");
      getChatHistory();
    } else {
      console.log("auth or chatHistory is not properly initialized.");
      setChatHistory([]);
      setContent("");
    }
  };
  {
    /********************************************************************************************************8*/
  }
  const getChatHistory = async () => {
    let documentIds;
    try {
      const userId = auth.currentUser.uid;
      const usersCollectionRef = collection(db, "users");
      const documentId = userId;
      const userDocumentRef = doc(usersCollectionRef, documentId);
      const chatsCollectionRef = collection(userDocumentRef, "chats");
      const snapshot = await getDocs(chatsCollectionRef);
      documentIds = snapshot.docs.map((doc) => doc.id);

      //console.log(documentIds);
      setPrevChats(documentIds);
    } catch (error) {
      console.log(error);
    } finally {
      console.log(prevChats);
      //return prevChats[0];
    }
    //return documentIds;
  };

  // const displayChatHistory = () => {
  //   const documentIds = getChatHistory();
  //   return documentIds; // You can now use the documentIds in your code as needed
  // };
  {
    /********************************************************************************************************8*/
  }
  const loadChat = async (item) => {
    console.log("control reached loadChat");
    const reqChatDocumentId = item;
    console.log(reqChatDocumentId);
    try {
      const userId = auth.currentUser.uid;
      const usersCollectionRef = collection(db, "users");
      const documentId = userId;
      const userDocumentRef = doc(usersCollectionRef, documentId);
      const chatsCollectionRef = collection(userDocumentRef, "chats");
      const reqDocumentRef = doc(chatsCollectionRef, reqChatDocumentId);
      const docSnap = await getDoc(reqDocumentRef);
      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data().chatHistory);
        const reqChatHistory = docSnap.data().chatHistory;
        setChatHistory(reqChatHistory);
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.log(error);
    }
  };
  {
    /********************************************************************************************************8*/
  }
  const logOut = async () => {
    user = auth.currentUser;
    if (user) {
      const userEmail = user.email;
      try {
        await signOut(auth);
        alert(`${userEmail} logged out successfully`);
        navigate("/login");
      } catch (error) {
        console.log(error.message);
      }
    } else {
      alert("no user is logged in");
    }
  };
  const getCurrentUser = () => {
    user = auth.currentUser;
    //console.log(user);
    if (user) {
      const userEmail = user.email;
      console.log(userEmail);
      return userEmail;
    } else {
      console.log("No user is currently logged in");
    }
  };
  {
    /********************************************************************************************************8*/
  }
  return (
    <>
      {!loggedin && <div className="loading-spinner"></div>}
      {loggedin && (
        <div style={containerStyle}>
          <div style={leftDiv}>
            {chatHistory.map((item, index) => (
              <div key={index}>
                {item.role === "user" && (
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <Card style={{ maxWidth: 340 }}>
                      <Flex gap="3" align="center">
                        <Avatar
                          size="3"
                          src={usericon}
                          radius="full"
                          fallback="T"
                        />
                        <Box>
                          <Text as="div" size="2" color="gray">
                            {item.parts}
                          </Text>
                        </Box>
                      </Flex>
                    </Card>
                  </div>
                )}
                {item.role === "model" && (
                  <div
                    style={{ display: "flex", justifyContent: "flex-start" }}
                  >
                    <Card style={{ maxWidth: 440 }}>
                      <Flex gap="3" align="center">
                        <Avatar
                          size="3"
                          src={roboticon}
                          radius="full"
                          fallback="T"
                        />
                        <Box>
                          <Text as="div" size="2" color="gray">
                            {item.parts}
                          </Text>
                        </Box>
                      </Flex>
                    </Card>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div style={{ display: "flex" }}>
            <div style={rightDiv}>
              <div>
                <button onClick={logOut}>Logout</button>
              </div>
              <TextareaAutosize
                maxRows={5}
                minRows={1}
                style={inputStyle}
                ref={promptRef}
                placeholder="Message ChatX"
                onKeyDown={handleKeyDown}
                disabled={gettingResponse}
              />
              <div>
                <button onClick={handleClick} style={buttonStyle}>
                  Send
                </button>
                <button onClick={newChat} style={buttonStyle}>
                  NewChat
                </button>
              </div>
              {content && (
                <TextareaAutosize
                  maxRows={25}
                  minRows={1}
                  style={responseStyle}
                  value={content}
                />
              )}

              <img
                src={chatIcon}
                alt="Chat Icon"
                style={{ marginTop: "20px", width: "50px", height: "50px" }}
              />
            </div>
            <div
              style={{
                backgroundColor: "grey",
                width: "10vw",
                height: "100vh",
                boxSizing: "border-box",
                maxHeight: "100vh",
                overflow: "scroll",
              }}
            >
              <div>{getCurrentUser()}</div>
              <div>
                {prevChats.map((item, index) => (
                  <button onClick={() => loadChat(item)} key={index}>
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chat;
