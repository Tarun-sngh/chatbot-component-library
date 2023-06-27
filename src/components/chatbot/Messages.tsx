import React, { useEffect } from "react";

interface Message {
  speak: string;
  text: string;
}

interface MessagesProps {
  messages: Message[];
  handleOptionClick: (index: number, option: string) => void;
}

export const Messages: React.FC<MessagesProps> = ({ messages, handleOptionClick }) => {
  const scrollToBottom = () => {
    const messagesContainer = document.querySelector(".messages");
    const lastMessage = messagesContainer?.lastChild as HTMLElement;
    lastMessage?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const displayMessage = (message: Message, index: number) => {
    if (message.speak === "user") {
      return (
        <div key={index} className="message__user">
          <p className="message_text-user">{message.text}</p>
        </div>
      );
    } else if (message.speak === "bot") {
      if (message.text.includes("\n")) {
        const questionAnswer = message.text.split("\n");
        return (
          <div key={index} className="message__df">
            {questionAnswer.map((qa, qaIndex) => (
              <p
                key={qaIndex}
                className={`message_text-df${qaIndex === 0 ? "" : "-options"}`}
                onClick={() => {
                  if (qaIndex !== 0) {
                    handleOptionClick(qaIndex, qa);
                  }
                }}
              >
                {qa}
              </p>
            ))}
          </div>
        );
      } else {
        return (
          <div key={index} className="message__df">
            <p className="message_text-df">{message.text}</p>
          </div>
        );
      }
    }
    return null;
  };

  return <div className="messages">{messages.map((message, index) => displayMessage(message, index))}</div>;
};
