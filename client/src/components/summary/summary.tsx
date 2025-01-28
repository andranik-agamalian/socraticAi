import { useState, useEffect } from "react";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { ChatUIProps, Message } from '../../utils/chatTypes';
import { createCurrentTimestamp } from "../../utils";
import { useOpenAI } from "../../hooks/useOpenAI";
import Markdown from 'react-markdown';
import { v4 as uuidv4 } from "uuid";
import './summaryStyles.css';
import { summaryPrompt } from "./summaryPrompt";

const OpenSummary: React.FC<ChatUIProps> = ({sessionId}) => {
    const { send, responseMessage, resetResponsMessage } = useOpenAI(sessionId);
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
  
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
  
  export default OpenSummary;