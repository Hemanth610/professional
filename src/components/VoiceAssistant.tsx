import React, { useState, useEffect, useCallback, useRef } from 'react';
import './VoiceAssistant.css';
import { useNavigate } from 'react-router-dom';

declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

interface VoiceAssistantProps {
  onSearch?: (query: string) => void;
  recipeToRead?: {
    title: string;
    description: string;
    cookingTime: number;
    servings: number;
    difficulty: string;
    ingredients: string[];
    instructions: string[];
  };
}

const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ onSearch, recipeToRead }) => {
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  // Use useRef to store the recognition instance
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Initialize speech recognition
  useEffect(() => {
    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = false;
        recognitionRef.current = recognition;
      } else {
        setIsSupported(false);
        console.error('Speech recognition is not supported in this browser');
      }
    } catch (error) {
      setIsSupported(false);
      console.error('Error initializing speech recognition:', error);
    }
  }, []);

  // Initialize speech synthesis
  const synth = window.speechSynthesis;

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 0.9; // Lower pitch for male voice
    utterance.volume = 1;
    utterance.lang = 'en-US';

    // Try to find a male voice
    const voices = synth.getVoices();
    const maleVoice = voices.find(voice => 
      voice.lang.startsWith('en-') && 
      !voice.name.toLowerCase().includes('female')
    ) || voices.find(voice => voice.lang.startsWith('en-'));

    if (maleVoice) {
      utterance.voice = maleVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synth.speak(utterance);
  };

  const readRecipe = useCallback(() => {
    if (!recipeToRead) return;

    const textToSpeak = `
      ${recipeToRead.title}.
      ${recipeToRead.description}
      
      This recipe takes ${recipeToRead.cookingTime} minutes to prepare and serves ${recipeToRead.servings} people.
      Difficulty level is ${recipeToRead.difficulty}.
      
      Ingredients needed:
      ${recipeToRead.ingredients.join('. ')}
      
      Instructions:
      ${recipeToRead.instructions.join('. ')}
    `;

    speak(textToSpeak);
  }, [recipeToRead]);

  const handleVoiceCommands = useCallback((command: string) => {
    const lowerCommand = command.toLowerCase().trim();

    // Navigation commands
    if (lowerCommand === 'go home' || lowerCommand === 'home') {
      navigate('/');
      speak('Navigating to home page');
      return;
    }
    
    if (lowerCommand === 'create recipe' || lowerCommand === 'new recipe') {
      navigate('/create');
      speak('Opening recipe creation page');
      return;
    }
    
    if (lowerCommand === 'explore chefs' || lowerCommand === 'show chefs') {
      navigate('/chefs');
      speak('Showing chef profiles');
      return;
    }
    
    if (lowerCommand === 'go to profile' || lowerCommand === 'show profile') {
      navigate('/profile');
      speak('Opening your profile');
      return;
    }
    
    if (lowerCommand.startsWith('search for ')) {
      const searchQuery = lowerCommand.replace('search for ', '');
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      onSearch?.(searchQuery);
      speak(`Searching for ${searchQuery}`);
      return;
    }

    // Existing recipe reading functionality
    if (lowerCommand === 'read recipe' && recipeToRead) {
      readRecipe();
      return;
    }

    // Help command
    if (lowerCommand === 'help' || lowerCommand === 'what can you do') {
      const helpText = `
        I can help you navigate the website and read recipes.
        Try saying:
        - Go home
        - Create recipe
        - Explore chefs
        - Go to profile
        - Search for [your search term]
        - Read recipe (when viewing a recipe)
      `;
      speak(helpText);
      return;
    }

    // If no command matches
    speak("I didn't understand that command. Say 'help' to learn what I can do.");
  }, [navigate, onSearch, readRecipe, recipeToRead]);

  useEffect(() => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    recognition.onstart = () => {
      console.log('Voice recognition started');
      setIsListening(true);
    };

    recognition.onend = () => {
      console.log('Voice recognition ended');
      if (isListening) {
        recognition.start();
      }
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const current = event.resultIndex;
      const transcript = event.results[current][0].transcript;
      setTranscript(transcript);
      handleVoiceCommands(transcript);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    return () => {
      if (recognition) {
        recognition.stop();
      }
      if (synth.speaking) {
        synth.cancel();
      }
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [handleVoiceCommands, isListening, timer]);

  const toggleListening = () => {
    if (!recognitionRef.current || !isSupported) {
      alert('Speech recognition is not supported in your browser');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      speak('Voice assistant deactivated');
    } else {
      recognitionRef.current.start();
      setIsListening(true);
      speak('Voice assistant activated. How can I help you?');
    }
  };

  return (
    <div className="voice-assistant">
      <button 
        className={`mic-button ${isListening ? 'listening' : ''} ${isSpeaking ? 'speaking' : ''}`}
        onClick={toggleListening}
        aria-label="Toggle voice assistant"
        disabled={!isSupported}
      >
        <i className={`fas fa-microphone${isListening ? '-slash' : ''}`}></i>
      </button>
      {!isSupported && (
        <div className="error-message">
          Speech recognition is not supported in your browser
        </div>
      )}
      {transcript && (
        <div className="transcript">
          <p>{transcript}</p>
        </div>
      )}
    </div>
  );
};

export default VoiceAssistant;