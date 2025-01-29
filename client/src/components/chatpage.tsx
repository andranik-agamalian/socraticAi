import { useState, useRef, useEffect } from "react";
import Markdown from 'react-markdown';
import { createCurrentTimestamp } from "../utils";
import { useOpenAI } from "../hooks/useOpenAI";
import { v4 as uuidv4 } from "uuid";
import { ChatUIProps, Message } from '../utils/chatTypes';
import { TextField, IconButton, Typography, Avatar, Stack, Container} from "@mui/material";
import { IoSend } from "react-icons/io5";
import { 
  ChatContainer,
  MessagesContainer,
  MessageBubble,
  MessageContent,
  InputContainer,
} from './ChatUI.styles';


const ChatUI: React.FC<ChatUIProps> = ({ sessionId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null); // Explicit type for ref
  const { send, responseMessage, resetResponsMessage } = useOpenAI(sessionId);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const didInit = useRef(false);

  useEffect(() => {
    if (!didInit.current) {
      didInit.current = true;
      send("");
    }
  }, []);


  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (responseMessage) {
      setMessages([
        ...messages,
        {
          id: uuidv4(),
          text: responseMessage,
          isUser: false,
          timestamp: createCurrentTimestamp(),
          avatar: "images.unsplash.com/photo-1494790108377-be9c29b29330",
        },
      ]);
      resetResponsMessage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [responseMessage]);

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      setMessages([
        ...messages,
        // populate state with message from user
        {
          id: uuidv4(),
          text: newMessage,
          isUser: true,
          timestamp: createCurrentTimestamp(),
          avatar: "images.unsplash.com/photo-1599566150163-29194dcaad36",
        },
        // ...serverMessages, // populate state with response from server
      ]);
      setNewMessage("");

      send(newMessage);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div>
      <Container maxWidth="lg" sx={{ mt: 4, paddingLeft: 0, paddingRight: 0, }}>
        <ChatContainer>
          <MessagesContainer>
            {messages.map((message) => (
              <MessageBubble key={message.id} isUser={message.isUser}>
                <Avatar
                  src={`https://${message.avatar}`}
                  alt={message.isUser ? "User" : "Assistant"}
                  sx={{ width: 40, height: 40 }}
                />
                <MessageContent isUser={message.isUser}>
                  <Typography variant="body1" component="div">
                    <Markdown>{message.text}</Markdown>
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
                aria-label="Message input field"
              />
              <IconButton
                onClick={handleSendMessage}
                color="primary"
                aria-label="Send message"
                sx={{
                  backgroundColor: "#2196f3",
                  color: "#fff",
                  "&:hover": { backgroundColor: "#1976d2" },
                  "max-height": "40px",
                }}
              >
                <IoSend />
              </IconButton>
            </Stack>
          </InputContainer>
        </ChatContainer>
      </Container>
    </div>
  );
};

export default ChatUI;

