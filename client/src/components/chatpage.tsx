import { useState, useRef, useEffect } from "react";
import Markdown from 'react-markdown';
import { createCurrentTimestamp } from "../utils";
import { useOpenAI } from "../hooks/useOpenAI";
import { v4 as uuidv4 } from "uuid";

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

import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import '../styles/summaryStyle.css';

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

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
  avatar: string;
}

interface ChatUIProps {
  sessionId: string;
}

const OpenDialogButton: React.FC<ChatUIProps> = ({sessionId}) => {
  const { send, responseMessage, resetResponsMessage } = useOpenAI(sessionId);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  // Prompt with the structured format
  const summaryPrompt = `
  {
  "response": "🔥 Drop a one-liner summary that captures the session's essence!",
  "student_level": "Choose one: beginner | intermediate | advanced",
  "student_details": {
    "likes": ["🎨 Things the student loves—could be math, music, or marshmallows!"],
    "learning_preferences": ["📚 Preferred learning styles—think visuals, hands-on, or discussions!"],
    "learning_style": "Select one: Diverging | Assimilating | Accommodating | Converging"
  },
  "topic": "🧐 What exciting topic did we dive into today?",
  "ai_role": "What role did I play? Choose one: Coaching Role | Facilitator Role | Expert Role | Evaluator Role",
  "session_report": {
    "summary": "🌟 A quick overview of our journey today!",
    "strengths": ["💪 Where the learner absolutely crushed it!"],
    "struggles": ["🤔 Challenges the learner faced (and will conquer next time!)"],
    "recommendations": ["📈 Tailored tips, tricks, or resources to keep the momentum going!"]
  },
  "correct_count": "✔️ How many correct answers did the student get?",
  "incorrect_count": "❌ How many tricky spots did the student stumble on?"
}
  `;
  // Handlers for opening and closing the dialog
  const handleOpen = () => {
    send(summaryPrompt);
    setOpen(true)
  };
  const handleClose = () => setOpen(false);

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

  return (
    <div className="summary-wrapper25">
      {/* Button to open the dialog */}
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Summary
      </Button>

      {/* Dialog component */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Summary</DialogTitle>
        <DialogContent>
          <Markdown>{messages[messages.length - 1]?.text || "No message yet"}</Markdown>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

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

      <Container maxWidth="md" sx={{ mt: 4 }}>
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
                }}
              >
                <IoSend />
              </IconButton>
            </Stack>
          </InputContainer>
        </ChatContainer>
      </Container>
      <OpenDialogButton sessionId={sessionId}/>
    </div>
  );
};

export default ChatUI;

