import { IconButton, Tooltip } from '@mui/material';
import { MdMic, MdMicOff, MdVolumeUp, MdVolumeOff } from 'react-icons/md';

interface VoiceControlsProps {
  isListening: boolean;
  isSpeaking: boolean;
  ttsEnabled: boolean;
  onStartListening: () => void;
  onStopListening: () => void;
  onToggleSpeech: () => void;
}

const VoiceControls: React.FC<VoiceControlsProps> = ({
  isListening,
  ttsEnabled,
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
      <Tooltip title={ttsEnabled ? "Disable voice responses" : "Enable voice responses"}>
        <IconButton 
          onClick={onToggleSpeech}
          color={ttsEnabled ? "primary" : "default"}
          aria-label={ttsEnabled ? "Disable voice responses" : "Enable voice responses"}
        >
          {ttsEnabled ? <MdVolumeUp /> : <MdVolumeOff />}
        </IconButton>
      </Tooltip>
    </>
  );
};

export default VoiceControls; 