import React, { useState, useEffect } from "react";
import axios from "axios";

export default function MyChatBot() {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [toggleConcern, setToggleConcern] = useState(false);

  const predefinedPrompts = [
    "Hi",
    "How to register",
    "How to login",
    "Book an Hotel",
  ];

  useEffect(() => {
    async function subscribeConcern() {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_API_SUBSCRIBE}`,
          {
            user: "subscribeConcernforUser",
          }
        );
        // Parse the JSON string to a JavaScript object
        const responseBody = "User has a concern: " + response.data;

        // Add bot response to chat history
        if (response.data != "undefined") {
          setToggleConcern("true");
          // setMessages((prevMessages) => [
          //   ...prevMessages,
          //   { type: "bot", text: responseBody },
          // ]);
        }
      } catch (error) {
        console.error("Error communicating with Lex bot:", error);
        // setMessages((prevMessages) => [
        //   ...prevMessages,
        //   { type: "user", text: input },
        //   {
        //     type: "bot",
        //     text: "There was an error communicating with the bot.",
        //   },
        // ]);
      }
    }

    subscribeConcern();
  });

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const handlePromptClick = (prompt) => {
    setUserInput(prompt);
    handleSubmit(prompt);
  };

  const handleSubmit = async (input) => {
    if (!input.trim()) return;

    // // Add user message to chat history
    // setMessages((prevMessages) => [
    //   ...prevMessages,
    //   { type: "user", text: input },
    // ]);
    console.log(input);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_GATEWAY_CHATBOT}`,
        {
          text: input,
        }
      );
      console.log(response);
      // Parse the JSON string to a JavaScript object
      const responseBody = JSON.parse(response.data.body);

      // Add bot response to chat history
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: "user", text: input },
        { type: "bot", text: responseBody.botResponse },
      ]);
    } catch (error) {
      console.error("Error communicating with Lex bot:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: "user", text: input },
        { type: "bot", text: "There was an error communicating with the bot." },
      ]);
    }

    setUserInput("");
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSubmit(userInput);
  };

  const handleClear = () => {
    setMessages([]);
  };

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className=" fixed -bottom-1 right-1 max-w-xs w-full p-4 border rounded-lg bg-gray-100 shadow-lg">
      <button
        onClick={toggleChatbot}
        className="p-2 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600 mb-2"
      >
        {isOpen ? "Close Chat Bot" : "Open Chat Bot"}
      </button>
      {toggleConcern ? (
        <button className="p-2 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600 mb-2">
          {isOpen ? "Close Property Owner Chat" : "Open Property Owner Chat"}
        </button>
      ) : (
        <></>
      )}

      {isOpen && (
        <div className="transition-all duration-300 ease-in-out transform text-xs">
          <div className="h-64 overflow-y-scroll mb-4 p-2 flex flex-col border rounded-lg bg-white">
            <div className="text-xs flex items-center flex-wrap  justify-center">
              {predefinedPrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handlePromptClick(prompt)}
                  className="  max-h-10 m-1 min-h-10 bg-gray-50 border-blue-600 rounded-lg hover:bg-gray-400"
                >
                  {prompt}
                </button>
              ))}
            </div>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 my-1 text-xs max-w-xs break-words rounded-lg ${
                  msg.type === "user"
                    ? "bg-blue-200 text-right self-end"
                    : "bg-gray-200 text-left self-start"
                }`}
                style={{
                  alignSelf: msg.type === "user" ? "flex-end" : "flex-start",
                }}
              >
                {msg.text}
              </div>
            ))}
          </div>

          <form onSubmit={handleFormSubmit} className="flex flex-col space-y-2">
            <input
              type="text"
              value={userInput}
              onChange={handleInputChange}
              placeholder="Type your message"
              className="flex-1 p-2 text-xs border rounded-lg"
            />
            <button
              type="submit"
              className="p-2 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600"
            >
              Send
            </button>
            <button
              onClick={handleClear}
              className="p-2 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600"
            >
              Clear
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
