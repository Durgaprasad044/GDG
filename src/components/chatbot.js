import React from 'react';
import './chatbot.css';

function Chatbot() {
  const [messages, setMessages] = React.useState([]);
  const [input, setInput] = React.useState('');
  const [isListening, setIsListening] = React.useState(false);
  const [isCapturingImage, setIsCapturingImage] = React.useState(false);
  const [geminiApiKey, setGeminiApiKey] = React.useState('');
  const [apiKeySet, setApiKeySet] = React.useState(false);
  
  const videoRef = React.useRef(null);
  const canvasRef = React.useRef(null);
  const recognitionRef = React.useRef(null);
  const mediaStreamRef = React.useRef(null);
  
  // Initialize speech recognition
  React.useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        
        setInput(transcript);
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };
    } else {
      console.error('Speech recognition not supported in this browser');
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);
  
  // Function to toggle speech recognition
  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
    setIsListening(!isListening);
  };
  
  // Function to save API key
  const saveApiKey = () => {
    if (geminiApiKey.trim()) {
      setApiKeySet(true);
      // Store the API key in localStorage
      localStorage.setItem('AIzaSyDyFUmT8OtZdJDHzc0R1Ro-pBdJrSjIkDc', geminiApiKey);
      addMessage('System', 'API key set successfully. You can now use the chatbot!');
    }
  };
  
  // Function to toggle camera for face recognition
  const toggleCamera = async () => {
    if (isCapturingImage) {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
      setIsCapturingImage(false);
    } else {
      try {
        mediaStreamRef.current = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStreamRef.current;
        }
        setIsCapturingImage(true);
      } catch (err) {
        console.error('Error accessing camera:', err);
        addMessage('System', 'Failed to access camera. Please check permissions.');
      }
    }
  };
  
  // Function to capture image and analyze with Gemini
  const captureAndAnalyze = async () => {
    if (!videoRef.current || !canvasRef.current || !apiKeySet) return;
    
    const context = canvasRef.current.getContext('2d');
    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    
    context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
    
    try {
      // Convert canvas to base64 image
      const imageBase64 = canvasRef.current.toDataURL('image/jpeg').split(',')[1];
      
      addMessage('User', '[Image captured for analysis]');
      
      // Call Gemini API for image analysis
      const response = await analyzeImageWithGemini(imageBase64);
      addMessage('Vision', response);
    } catch (error) {
      console.error('Error analyzing image:', error);
      addMessage('System', 'Failed to analyze image. Please try again.');
    }
  };
  
  // Function to analyze image with Gemini API
  const analyzeImageWithGemini = async (imageBase64) => {
    try {
      const response = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=AIzaSyDG_8Lc5X4uSW50YWcT_L-aCrwOhHpLT3Q`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: "Analyze this image for face recognition. Describe what you see and detect any faces present."
                },
                {
                  inline_data: {
                    mime_type: "image/jpeg",
                    data: imageBase64
                  }
                }
              ]
            }
          ]
        })
      });
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message || 'Unknown error from Gemini API');
      }
      
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Gemini API error:', error);
      return 'Error analyzing image: ' + error.message;
    }
  };
  
  // Function to send text message to Gemini API
  const sendMessageToGemini = async (text) => {
    try {
      const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyDyFUmT8OtZdJDHzc0R1Ro-pBdJrSjIkDc", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: text
                }
              ]
            }
          ]
        })
      });
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message || 'Unknown error from Gemini API');
      }
      
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Gemini API error:', error);
      return 'Error processing message: ' + error.message;
    }
  };
  
  // Function to add message to chat
  const addMessage = (sender, text) => {
    setMessages(prevMessages => [...prevMessages, { sender, text, id: Date.now() }]);
  };
  
  // Function to handle sending messages
  const handleSendMessage = async () => {
    if (!input.trim() || !apiKeySet) return;
    
    const userMessage = input.trim();
    addMessage('User', userMessage);
    setInput('');
    
    try {
      const response = await sendMessageToGemini(userMessage);
      addMessage('Gemini', response);
    } catch (error) {
      console.error('Error sending message:', error);
      addMessage('System', 'Failed to get response. Please try again.');
    }
  };
  
  // Load API key from localStorage if available
  React.useEffect(() => {
    const savedApiKey = localStorage.getItem('AIzaSyDyFUmT8OtZdJDHzc0R1Ro-pBdJrSjIkDc');
    if (savedApiKey) {
      setGeminiApiKey(savedApiKey);
      setApiKeySet(true);
      addMessage('System', 'Welcome back! Your API key has been loaded.');
    } else {
      addMessage('System', 'Please enter your Google Gemini API key to begin.');
    }
  }, []);
  
  // Render method converted from JSX
  return React.createElement('div', { className: 'app-container' }, [
    React.createElement('h1', null, 'Gemini Chatbot'),
    React.createElement('h2', null, 'with Speech & Face Recognition'),
    
    !apiKeySet ? 
    React.createElement('div', { className: 'api-key-container' }, [
      React.createElement('input', {
        type: 'password',
        value: geminiApiKey,
        onChange: (e) => setGeminiApiKey(e.target.value),
        placeholder: 'Enter your Gemini API key',
        className: 'api-key-input'
      }),
      React.createElement('button', { 
        onClick: saveApiKey, 
        className: 'api-key-button' 
      }, 'Save API Key'),
      React.createElement('p', { className: 'api-key-note' }, [
        'Note: Get your API key from ',
        React.createElement('a', { 
          href: 'https://ai.google.dev/', 
          target: '_blank', 
          rel: 'noreferrer' 
        }, 'Google AI Studio')
      ])
    ]) : 
    React.createElement(React.Fragment, null, [
      React.createElement('div', { className: 'chat-container' }, [
        // Messages container
        React.createElement('div', { className: 'messages-container' }, 
          messages.map(message => 
            React.createElement('div', { 
              key: message.id, 
              className: `message ${message.sender.toLowerCase()}-message`
            }, [
              React.createElement('div', { className: 'message-sender' }, message.sender),
              React.createElement('div', { className: 'message-text' }, message.text)
            ])
          )
        ),
        
        // Input container
        React.createElement('div', { className: 'input-container' }, [
          React.createElement('input', {
            type: 'text',
            value: input,
            onChange: (e) => setInput(e.target.value),
            placeholder: 'Type your message...',
            className: 'message-input',
            onKeyPress: (e) => e.key === 'Enter' && handleSendMessage()
          }),
          React.createElement('div', { className: 'controls' }, [
            React.createElement('button', { 
              onClick: toggleListening, 
              className: `control-button ${isListening ? 'active' : ''}`
            }, isListening ? 'Stop Listening' : 'Start Listening'),
            React.createElement('button', { 
              onClick: handleSendMessage, 
              className: 'control-button' 
            }, 'Send'),
            React.createElement('button', { 
              onClick: toggleCamera, 
              className: `control-button ${isCapturingImage ? 'active' : ''}`
            }, isCapturingImage ? 'Stop Camera' : 'Start Camera'),
            isCapturingImage && 
            React.createElement('button', { 
              onClick: captureAndAnalyze, 
              className: 'control-button' 
            }, 'Capture & Analyze')
          ])
        ])
      ]),
      
      isCapturingImage && 
      React.createElement('div', { className: 'video-container' }, [
        React.createElement('video', { 
          ref: videoRef, 
          autoPlay: true, 
          playsInline: true, 
          className: 'video-element' 
        }),
        React.createElement('canvas', { 
          ref: canvasRef, 
          style: { display: 'none' } 
        })
      ])
    ])
  ]);
}

export default Chatbot;