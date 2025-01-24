import ChatUI from './components/chatpage'
import { v4 as uuidv4 } from 'uuid';

const getSessionId = (): string => {
  let sessionId: string | null = localStorage.getItem('sessionId');
  
  // Generate a new sessionId if it doesn't exist or if it's null
  if (!sessionId || sessionId === 'null') {
    sessionId = uuidv4(); // Generate a new sessionId
    localStorage.setItem('sessionId', sessionId as string);
  }

  return sessionId as string;
};


const sessionId = getSessionId();

function App() {
  

  return (
    <>
      <ChatUI sessionId={sessionId} />
    </>
  )
}

export default App
