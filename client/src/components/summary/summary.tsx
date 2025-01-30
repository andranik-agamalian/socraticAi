import { useState, useEffect } from "react";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { ChatUIProps, Message } from '../../utils/chatTypes';
import { createCurrentTimestamp } from "../../utils";
import { useOpenAI } from "../../hooks/useOpenAI";
import Markdown from 'react-markdown';
import { v4 as uuidv4 } from "uuid";
import './summaryStyles.css';

import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { CircularProgress } from "@mui/material";

const options = [
    'Session Summary',
];

const ITEM_HEIGHT = 48;

const OpenSummary: React.FC<ChatUIProps> = ({ sessionId }) => {
    const { getSummary, isLoading, responseMessage, resetResponsMessage } = useOpenAI(sessionId);
    const [messages, setMessages] = useState<Message[]>([]);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    // Handler for clicking on the 'Summary' MenuItem
    const handleSummaryClick = () => {
        getSummary(sessionId);
        setDialogOpen(true);
        handleClose();   // Close the menu
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    // Handler to close the Dialog
    const handleDialogClose = () => {
        setDialogOpen(false)
    };

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

    const latestMessage = messages[messages.length - 1]?.text;

    return (
        <div style={{ position: "absolute", right: 0, top: 0 }}>
            <IconButton
                aria-label="more"
                id="long-button"
                aria-controls={open ? 'long-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-haspopup="true"
                onClick={handleClick}
            >
                <MoreVertIcon />
            </IconButton>
            <Menu
                id="long-menu"
                MenuListProps={{
                    'aria-labelledby': 'long-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                slotProps={{
                    paper: {
                        style: {
                            maxHeight: ITEM_HEIGHT * 4.5,
                            width: '20ch',
                        },
                    },
                }}
            >
                {options.map((option) => (
                    <MenuItem key={option} selected={option === 'Pyxis'} 
                    onClick={option === "Summary" ? handleSummaryClick : handleClose}>
                        {option}
                    </MenuItem>
                ))}
            </Menu>

            <Dialog open={dialogOpen} onClose={handleDialogClose}>
                <DialogTitle>Summary</DialogTitle>
                <DialogContent>
                {isLoading ? (
                <CircularProgress size={24} />
                ) : latestMessage ? (
                <Markdown>{latestMessage}</Markdown>
                ) : (
                    "No message yet"
                )}
                </DialogContent>
                <DialogActions>
                <Button onClick={handleDialogClose} color="secondary">
                    Close
                </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default OpenSummary;