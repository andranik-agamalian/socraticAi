export interface ChatUIProps {
    sessionId: string;
}

export interface Message {
    id: string;
    text: string;
    isUser: boolean;
    timestamp: string;
    avatar: string;
}
