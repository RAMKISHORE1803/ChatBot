// prettier-ignore
import { React, useRef, useState, useEffect, TextareaAutosize, ChatItem, MessageBox, GoogleGenerativeAI, chatIcon, usericon, containerStyle, rightDiv, leftDiv, responseStyle, buttonStyle, inputStyle, safetySettings, generationConfig, roboticon } from "./ChatImports";
import { API_KEY } from "../../config";
import { Flex, Text, Card, Avatar, Box } from "@radix-ui/themes";

const Chat = () => {
  const promptRef = useRef(null);
  const [content, setContent] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [gettingResponse, setGettingResponse] = useState(false);
  const [isSafe, setIsSafe] = useState(true);
  let response = "";
  {
    /********************************************************************************************************8*/
  }
  useEffect(() => {
    console.log("control reached useeffect hook");
    console.log("chat history", chatHistory);
  }, [chatHistory]);
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
  const newChat = () => {
    setChatHistory([]);
    setContent("");
  };
  {
    /********************************************************************************************************8*/
  }
  return (
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
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
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
      <div style={rightDiv}>
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
    </div>
  );
};

export default Chat;
