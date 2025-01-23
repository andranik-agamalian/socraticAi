import { useState, useRef, useEffect } from "react";

import {
  Box,
  TextField,
  IconButton,
  Paper,
  Typography,
  Avatar,
  Stack,
  Container,
} from "@mui/material";

import { styled } from "@mui/system";
import { IoSend } from "react-icons/io5";

const ChatContainer = styled(Paper)(({ theme }) => ({
  height: "80vh",
  display: "flex",
  flexDirection: "column",
  borderRadius: 16,
  overflow: "hidden",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
}));

const MessagesContainer = styled(Box)({
  flex: 1,
  overflowY: "auto",
  padding: "20px",
  "&::-webkit-scrollbar": {
    width: "6px",
  },
  "&::-webkit-scrollbar-track": {
    background: "#f1f1f1",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "#888",
    borderRadius: "3px",
  },
});

const MessageBubble = styled(Box)<{ isUser: boolean }>(({ isUser }) => ({
  display: "flex",
  alignItems: "flex-start",
  marginBottom: "16px",
  flexDirection: isUser ? "row-reverse" : "row",
}));

const MessageContent = styled(Paper)<{ isUser: boolean }>(({ isUser }) => ({
  padding: "12px 16px",
  borderRadius: "16px",
  maxWidth: "70%",
  marginLeft: isUser ? 0 : "12px",
  marginRight: isUser ? "12px" : 0,
  backgroundColor: isUser ? "#2196f3" : "#f5f5f5",
  color: isUser ? "#fff" : "#000",
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    transform: "scale(1.02)",
  },
}));

const InputContainer = styled(Box)({
  padding: "20px",
  borderTop: "1px solid rgba(0, 0, 0, 0.1)",
});

const generateTime = () => {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}
const dummyMessages = [
  {
    id: 1,
    text: "Hey! What do you want to learn?",
    isUser: false,
    timestamp: "10:00 AM",
    avatar: "images.unsplash.com/photo-1494790108377-be9c29b29330",
  },
  // {
  //   id: 2,
  //   text: "I'm doing great! Thanks for asking. How about you?",
  //   isUser: true,
  //   timestamp: "10:02 AM",
  //   avatar: "images.unsplash.com/photo-1599566150163-29194dcaad36",
  // },
//   {
//     id: 3,
//     text: "I'm good too! Just working on some new projects.",
//     isUser: false,
//     timestamp: "10:05 AM",
//     avatar: "images.unsplash.com/photo-1494790108377-be9c29b29330",
//   },
];

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: string;
  avatar: string;
}

const ChatUI = () => {
  // Add type for a "message"
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [aiResponses, setAiResponses] = useState([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null); // Explicit type for ref

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (aiResponses.length) {
      setMessages([
        ...messages,
        ...aiResponses
      ]);

      setAiResponses([])
    }
  }, [aiResponses]);

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      setMessages([
        ...messages,
        // populate state with message from user
        {
          id: messages.length + 1,
          text: newMessage,
          isUser: true,
          timestamp: generateTime(),
          avatar: "images.unsplash.com/photo-1599566150163-29194dcaad36",
        },
        // ...serverMessages, // populate state with response from server
      ]);
      setNewMessage("");
      // TODO: Make pretty
      const headers = new Headers();
      headers.append("Content-Type", "application/json");

      const response = await fetch("http://localhost:3000/api/v1/chat", {
        method: "POST",
        body: JSON.stringify({ message: newMessage }), // TODO: Include chat history
        headers,
      });

      // TODO: Handle error if response.status !== 200
      const data = await response.json();
      console.log(data);

      // Update state with message(s) returned from the server
      const serverMessages = data.messages.map((message: string) => {
        return {
          id: Math.random() * 10000, // TODO: Use uuid or another unique identifier
          text: message,
          isUser: false,
          timestamp: generateTime(),
          avatar: "images.unsplash.com/photo-1494790108377-be9c29b29330"
        }
      });

      // come up with better name
      setAiResponses(serverMessages);
    }
  };

  const handleKeyPress = (e:any) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <ChatContainer>
        <MessagesContainer>
          {messages.map((message) => (
            <MessageBubble key={message.id} isUser={message.isUser}>
              <Avatar
                src={`https://${message.avatar}`}
                alt={message.isUser ? "User" : "Contact"}
                sx={{
                  width: 40,
                  height: 40,
                }}
              />
              <MessageContent isUser={message.isUser}>
                <Typography variant="body1" component="div">
                  {message.text}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ opacity: 0.7, mt: 0.5, display: "block" }}
                >
                  {message.timestamp}
                </Typography>
              </MessageContent>
            </MessageBubble>
          ))}
          <div ref={messagesEndRef} />
        </MessagesContainer>
        <InputContainer>
          <Stack direction="row" spacing={2}>
            <TextField
              fullWidth
              multiline
              maxRows={4}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              variant="outlined"
              size="small"
              sx={{ backgroundColor: "#fff" }}
              aria-label="Message input field"
            />
            <IconButton
              onClick={handleSendMessage}
              color="primary"
              aria-label="Send message"
              sx={{
                backgroundColor: "#2196f3",
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#1976d2",
                },
              }}
            >
              <IoSend />
            </IconButton>
          </Stack>
        </InputContainer>
      </ChatContainer>
    </Container>
  );
};

export default ChatUI;
