
import { useState, useRef } from 'react';
import './App.css';

function App() {
  const [transcript, setTranscript] = useState('');
  const [listening, setListening] = useState(false);
  const [assistantReply, setAssistantReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationStarted, setConversationStarted] = useState(false);

  const recognitionRef = useRef(null);
  const shouldContinueRef = useRef(false);
  const isProcessingRef = useRef(false);
  const isSpeakingRef = useRef(false);
  const historyRef = useRef([]);

  // Clean formatting from AI responses.
  const cleanText = (text) => {
    return String(text || '')
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/#{1,6}\s/g, '')
      .replace(/`/g, '')
      .trim();
  };

  // Speak the AI response.
  const speakText = (text) => {
    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = 'en-IN';
    speech.rate = 1;
    speech.pitch = 1;

    speech.onstart = () => {
      isSpeakingRef.current = true;
    };

    speech.onend = () => {
      isSpeakingRef.current = false;

      if (shouldContinueRef.current) {
        setTimeout(startRecognition, 700);
      }
    };

    speech.onerror = () => {
      isSpeakingRef.current = false;

      if (shouldContinueRef.current) {
        setTimeout(startRecognition, 700);
      }
    };

    window.speechSynthesis.speak(speech);
  };

  // Start the microphone again.
  const startRecognition = () => {
    const recognition = recognitionRef.current;

    if (
      !recognition ||
      !shouldContinueRef.current ||
      isProcessingRef.current ||
      isSpeakingRef.current
    ) {
      return;
    }

    try {
      recognition.start();
    } catch (error) {
      console.log('Recognition start error:', error.message);
    }
  };

  // Send the question and history to the backend.
  const getAIResponse = async (spokenText) => {
    isProcessingRef.current = true;
    setLoading(true);
    setAssistantReply('Analyzing your business performance...');

    historyRef.current = [
      ...historyRef.current,
      { role: 'user', content: spokenText }
    ];

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/chat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: spokenText,
            history: historyRef.current,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || `Backend error: ${response.status}`
        );
      }

      if (typeof data.reply !== 'string' || !data.reply.trim()) {
        throw new Error('The backend returned an empty response.');
      }

      const reply = cleanText(data.reply);

      setAssistantReply(reply);

      historyRef.current = [
        ...historyRef.current,
        { role: 'assistant', content: reply }
      ];

      isProcessingRef.current = false;

      if (shouldContinueRef.current) {
        speakText(reply);
      }

    } catch (error) {
      console.error('Backend error:', error);

      const errorMessage =
        'I could not connect to the server. Please check your backend.';

      setAssistantReply(errorMessage);
      isProcessingRef.current = false;

      if (shouldContinueRef.current) {
        speakText(errorMessage);
      }

    } finally {
      setLoading(false);
    }
  };

  // Start a new conversation.
  const startConversation = () => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Please use Google Chrome for speech recognition.');
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognitionRef.current = recognition;

    shouldContinueRef.current = true;
    isProcessingRef.current = false;
    isSpeakingRef.current = false;
    historyRef.current = [];

    setConversationStarted(true);
    setTranscript('');
    setAssistantReply('');

    recognition.onstart = () => {
      console.log('Microphone started');
      setListening(true);
    };

    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript;

      console.log('You said:', spokenText);

      setTranscript(spokenText);
      getAIResponse(spokenText);
    };

    recognition.onerror = (event) => {
      console.log('Speech error:', event.error);

      if (
        event.error === 'not-allowed' ||
        event.error === 'service-not-allowed'
      ) {
        shouldContinueRef.current = false;
        setConversationStarted(false);
        setListening(false);
        setAssistantReply('Please allow microphone permission.');
      }
    };

    recognition.onend = () => {
      console.log('Microphone session ended');
      setListening(false);

      if (
        shouldContinueRef.current &&
        !isProcessingRef.current &&
        !isSpeakingRef.current
      ) {
        console.log('Restarting microphone...');
        setTimeout(startRecognition, 700);
      }
    };

    // Start listening.
    startRecognition();
  };

  // End the entire conversation.
  const stopConversation = () => {
    shouldContinueRef.current = false;
    isProcessingRef.current = false;
    isSpeakingRef.current = false;

    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    window.speechSynthesis.cancel();

    setListening(false);
    setLoading(false);
    setConversationStarted(false);
  };

  // Main UI.
  return (
    <div className="app">
      <header className="header">
        <h2>Mini Virtual KAM</h2>
        <span>AI Voice Assistant</span>
      </header>

      <main className="main">
        <div className="assistant-card">
          <div className="status">● AI ASSISTANT ONLINE</div>

          <h1>
            Your Personal
            <br />
            AI Account Manager
          </h1>

          <p>
            Let's understand your business performance
            and discover opportunities to grow your sales.
          </p>

          <div className="mic-circle">🎙️</div>

          <h3>
            {listening
              ? 'Listening to you...'
              : loading
                ? 'Analyzing your business...'
                : conversationStarted
                  ? 'AI is responding...'
                  : 'Start a conversation'}
          </h3>

          <p className="hint">
            {conversationStarted
              ? 'Speak naturally. The assistant will listen after responding.'
              : 'Click below and speak to your AI assistant.'}
          </p>

          {!conversationStarted ? (
            <button
              className="start-btn"
              onClick={startConversation}
            >
              Start Conversation
            </button>
          ) : (
            <button
              className="start-btn"
              onClick={stopConversation}
            >
              End Conversation
            </button>
          )}

          {transcript && (
            <div className="transcript">
              <h4>You said:</h4>
              <p>{transcript}</p>
            </div>
          )}

          {assistantReply && (
            <div className="assistant-reply">
              <h4>AI Assistant:</h4>
              <p>{assistantReply}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
