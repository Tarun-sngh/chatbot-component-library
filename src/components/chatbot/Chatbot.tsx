import React, { useState, useEffect, useRef } from "react";
import "./Chatbot.css";
import { Messages } from "./Messages";
import axios from 'axios';

interface ChatbotProps {
  userId: string;
  requestRoutes: string;
}

interface Message {
  speak: string;
  text: string;
}

const Chatbot: React.FC<ChatbotProps> = ({ userId, requestRoutes }) => {
  const [language, setLanguage] = useState("en-us");
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [minimized, setMinimized] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  const useChangeLanguage = () => {
    setLanguage((prevLanguage) => (prevLanguage === "en-us" ? "lt" : "en-us"));

    const messagesContainer = document.querySelector(".chatbot__body .messages");
    if (messagesContainer) {
      messagesContainer.innerHTML = "";
    }
  };

  const handleOptionClick = (index: number, option: string) => {
    setSelectedOption(index);
    sendUserQuery(option);
  };

  const sendUserQuery = async (userInput: string) => {
    if (!userInput) {
      alert("Please enter your query");
      return;
    }

    const botMessage: Message = {
      speak: "bot",
      text: "..."
    };
    const userMessage: Message = {
      speak: "user",
      text: userInput
    };
    setMessages([...messages, userMessage, botMessage]);

    const data = {
      text: userInput,
      userId: userId,
      language: language,
    };

    try {
      const response = await axios.post(requestRoutes, data);
      const botResponse: Message = {
        speak: "bot",
        text: response.data.fulfillmentText
      };
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages];
        const index = updatedMessages.indexOf(botMessage);
        if (index !== -1) {
          updatedMessages.splice(index, 1, botResponse);
        }
        return updatedMessages;
      });
    } catch (error) {
      console.error("Error occurred while sending user query:", error);
    }

    setSelectedOption(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const toggleMinimize = () => {
    setMinimized((prevMinimized) => !prevMinimized);
  };

  useEffect(() => {
    const languageButton = document.querySelector(".chatbot__header--lan-btn");
    if (languageButton) {
      languageButton.innerHTML = language;
    }
  }, [language]);

  return (
    <div className={`chatbot${minimized ? "_minimized" : ""}`}>
      {!minimized ? (
        <div className="chatbot__header">
          <div className="chatbot__headertext-btn">
            <h1 className="chatbot__header--text">Chatbot</h1>
            <button
              className="chatbot__header--lan-btn"
              type="button"
              onClick={useChangeLanguage}
            >
              {language}
            </button>
          </div>
          <button className="chatbot__header--btn" onClick={toggleMinimize}>
            &#9660;
          </button>
        </div>
      ) : (
        <div className="chatbot__header-circle" onClick={toggleMinimize}>
          ...
        </div>
      )}
      {!minimized && (
        <>
          <div className="chatbot__body">
            <Messages messages={messages} handleOptionClick={handleOptionClick} />
          </div>
          <div className="chatbot__footer">
            <input
              ref={inputRef}
              className="chatbot__footer--input"
              type="text"
              placeholder="Type here..."
            />
            <button
              className="chatbot__footer--btn"
              onClick={() => {
                if (inputRef.current) {
                  sendUserQuery(inputRef.current.value);
                  inputRef.current.value = "";
                }
              }}

              type="button"
            >
              &#10147;
            </button>
          </div>
        </>
      )}
    </div>
  );
};


export default Chatbot;