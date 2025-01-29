import { useState, useEffect } from "react";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { ChatUIProps, Message } from '../../utils/chatTypes';
import { createCurrentTimestamp } from "../../utils";
import { useOpenAI } from "../../hooks/useOpenAI";
import Markdown from 'react-markdown';
import { v4 as uuidv4 } from "uuid";
import './summaryStyles.css';
import { summaryPrompt } from "./summaryPrompt";


import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';


const options = [
    'Summary',
    'Profile'
];

const ITEM_HEIGHT = 48;

const OpenSummary: React.FC<ChatUIProps> = ({ sessionId }) => {
    // const [open, setOpen] = useState(false);
    // const { send, responseMessage, resetResponsMessage } = useOpenAI(sessionId);
    // const [messages, setMessages] = useState<Message[]>([]);

    // // Handlers for opening and closing the dialog
    // const handleOpen = () => {
    //   send(summaryPrompt);
    //   setOpen(true)
    // };
    // const handleClose = () => setOpen(false);

    // useEffect(() => {
    //   if (responseMessage) {
    //     setMessages([
    //       ...messages,
    //       {
    //         id: uuidv4(),
    //         text: responseMessage,
    //         isUser: false,
    //         timestamp: createCurrentTimestamp(),
    //         avatar: "images.unsplash.com/photo-1494790108377-be9c29b29330",
    //       },
    //     ]);
    //     resetResponsMessage();
    //   }
    //   // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [responseMessage]);

    // return (
    //   <div className="summary-wrapper25">
    //     {/* Button to open the dialog */}
    //     <Button variant="contained" color="primary" onClick={handleOpen}>
    //       Summary
    //     </Button>

    //     {/* Dialog component */}
    //     <Dialog open={open} onClose={handleClose}>
    //       <DialogTitle>Summary</DialogTitle>
    //       <DialogContent>
    //         <Markdown>{messages[messages.length - 1]?.text || "No message yet"}</Markdown>
    //       </DialogContent>
    //       <DialogActions>
    //         <Button onClick={handleClose} color="secondary">
    //           Close
    //         </Button>
    //       </DialogActions>
    //     </Dialog>
    //   </div>
    // );
    const { send, responseMessage, resetResponsMessage } = useOpenAI(sessionId);
    const [messages, setMessages] = useState<Message[]>([]);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);

    };

    // Handler for clicking on the 'Summary' MenuItem
    const handleSummaryClick = () => {
        send(summaryPrompt);
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

    console.log('summary', messages)

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
                    <Markdown>{messages[messages.length - 1]?.text || "No message yet"}</Markdown>
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