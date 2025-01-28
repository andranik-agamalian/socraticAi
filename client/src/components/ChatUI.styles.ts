// src/components/Chat/ChatUI/ChatUI.styles.ts

import { styled } from '@mui/system';
import { Paper, Box } from '@mui/material';

export const ChatContainer = styled(Paper)(({ theme }) => ({
  height: '80vh',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: 16,
  overflow: 'hidden',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
}));

export const MessagesContainer = styled(Box)({
  flex: 1,
  overflowY: 'auto',
  padding: '20px',
  '&::-webkit-scrollbar': {
    width: '6px',
  },
  '&::-webkit-scrollbar-track': {
    background: '#f1f1f1',
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#888',
    borderRadius: '3px',
  },
});

export const MessageBubble = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isUser',
})<{ isUser: boolean }>(({ isUser }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  marginBottom: '16px',
  flexDirection: isUser ? 'row-reverse' : 'row',
}));

export const MessageContent = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'isUser',
})<{ isUser: boolean }>(({ isUser }) => ({
  padding: '12px 16px',
  borderRadius: '16px',
  maxWidth: '70%',
  marginLeft: isUser ? 0 : '12px',
  marginRight: isUser ? '12px' : 0,
  backgroundColor: isUser ? '#2196f3' : '#f5f5f5',
  color: isUser ? '#fff' : '#000',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    transform: 'scale(1.02)',
  },
}));

export const InputContainer = styled(Box)({
  padding: '20px',
  borderTop: '1px solid rgba(0, 0, 0, 0.1)',
});
