import { IconButton, Tooltip } from '@mui/material';
import { MdMic, MdMicOff, MdVolumeUp, MdVolumeOff } from 'react-icons/md';

interface VoiceControlsProps {
  isListening: boolean;
  isSpeaking: boolean;
  onStartListening: () => void;
  onStopListening: () => void;
  onToggleSpeech: () => void;
}

const VoiceControls: React.FC<VoiceControlsProps> = ({
  isListening,
  isSpeaking,
  onStartListening,
  onStopListening,
  onToggleSpeech,
}) => {
  return (
    <>
      <Tooltip title={isListening ? "Stop recording" : "Start recording"}>
        <IconButton
          onClick={isListening ? onStopListening : onStartListening}
          color={isListening ? "error" : "default"}
          aria-label={isListening ? "Stop recording" : "Start recording"}
        >
          {isListening ? <MdMicOff /> : <MdMic />}
        </IconButton>
      </Tooltip>
      <Tooltip title={isSpeaking ? "Disable voice responses" : "Enable voice responses"}>
        <IconButton 
          onClick={onToggleSpeech}
          color={isSpeaking ? "primary" : "default"}
          aria-label={isSpeaking ? "Disable voice responses" : "Enable voice responses"}
        >
          {isSpeaking ? <MdVolumeUp /> : <MdVolumeOff />}
        </IconButton>
      </Tooltip>
    </>
  );
};

export default VoiceControls; 