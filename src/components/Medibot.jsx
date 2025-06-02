import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Medibot.css'; // Adjust path if necessary
function Medibot() {
  const [input, setInput] = useState('');
  const [chatLog, setChatLog] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [image, setImage] = useState(null);
  const recognitionRef = useRef(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognitionRef.current = recognition;

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        addMessage('User', transcript);
        handleSymptomQuery(transcript);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
    }
  }, []);

  // Function to handle voice input
  const handleVoiceInput = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  // Function to add messages to chat log
  const addMessage = (sender, message) => {
    setChatLog((prevLog) => [...prevLog, { sender, message }]);
  };

  // Handle Symptom Query (Text Input)
  const handleSymptomQuery = async (query) => {
    try {
      const res = await axios.post('http://127.0.0.1:5000/symptom-diagnosis', { symptom: query });
      addMessage('Medibot', res.data.message);
      if (res.data.followUp) {
        addMessage('Medibot', res.data.followUp);
      }
    } catch (error) {
      addMessage('Medibot', 'Error connecting to Medibot backend.');
    }
  };

  // Handle Image Upload
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  // Submit Image for Diagnosis
  const handleImageSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      alert("Please upload an image first.");
      return;
    }
    const formData = new FormData();
    formData.append('file', image);

    try {
      const res = await axios.post('http://127.0.0.1:5000/image-diagnosis', formData);
      addMessage('Medibot', res.data.message);
    } catch (error) {
      addMessage('Medibot', 'Error analyzing image.');
    }
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-3xl font-bold text-blue-600">🤖 Medibot - Your Health Companion</h2>
      <div className="h-64">
  {chatLog.map((log, index) => (
    <div 
      key={index} 
      className={`chat-bubble ${log.sender === 'User' ? 'user-bubble' : 'bot-bubble'}`}>
      <strong>{log.sender}:</strong> {log.message}
    </div>
  ))}
</div>

      <form onSubmit={(e) => { e.preventDefault(); handleSymptomQuery(input); }} className="flex gap-2">
        <input
          type="text"
          placeholder="Type your symptoms..."
          className="p-2 border rounded w-full"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" className="bg-blue-600 text-white p-2 rounded">Send</button>
      </form>

      <input type="file" accept="image/*" onChange={handleImageChange} className="mt-4" />
      <button onClick={handleImageSubmit} className="bg-purple-600 text-white p-2 mt-2 rounded w-full">
        📷 Upload Image
      </button>

      <button onClick={handleVoiceInput} className="bg-green-600 text-white p-2 mt-2 rounded w-full">
        🎤 Speak Symptoms
      </button>
    </div>
  );
}

export default Medibot;
