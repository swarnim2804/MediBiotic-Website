import React, { useState, useEffect } from 'react';
import './ExerciseTracker.css';  

const ExerciseTracker = () => {
  const [isActive, setIsActive] = useState(false);
  const [time, setTime] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [selectedExercise, setSelectedExercise] = useState('');

  const exercises = ['Treadmill', 'Cycling', 'Plank', 'Skipping', 'Swimming'];

  // Exercise video links for each exercise
  const exerciseVideos = {
    'Treadmill': [
      "https://youtu.be/eGZ_3MbXAnM",
      "https://youtu.be/vdsaHSr1H_E",
      "https://youtu.be/PwKT4hUJSQc",
    ],
    'Cycling': [
      "https://youtu.be/ewrf_rCHUdA",
      "https://youtu.be/sOpm6E1lnpc",
      "https://youtu.be/4Hl1WAGKjMc",
    ],
    'Plank': [
      "https://youtu.be/Z90xpWvuUPs",
      "https://youtu.be/ynUw0YsrmSg",
      "https://youtu.be/Gtf05twdBiE",
    ],
    'Skipping': [
      "https://youtu.be/irSzTAFJpOs",
      "https://youtu.be/DTdaiqR9now",
      "https://youtu.be/tNaoARG9E8w",
    ],
    'Swimming': [
      "https://youtu.be/4VG_JdTx3Rk",
      "https://youtu.be/6_vXycbD2TM",
      "https://youtu.be/sBuoMkJsMsA",
    ]
  };

  // Start Timer
  const startTimer = () => {
    setIsActive(true);
    const id = setInterval(() => {
      setTime((prevTime) => prevTime + 1);
    }, 1000);
    setIntervalId(id);
  };

  // Stop Timer
  const stopTimer = () => {
    setIsActive(false);
    clearInterval(intervalId);
  };

  // Reset Timer
  const resetTimer = () => {
    setIsActive(false);
    clearInterval(intervalId);
    setTime(0);
  };

  // Handle Exercise Selection
  const handleExerciseChange = (event) => {
    setSelectedExercise(event.target.value);
    resetTimer();
  };

  // Format Time to MM:SS
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  };

  // Extract YouTube Video ID
  const getYouTubeId = (url) => {
    const regExp = /(?:https?:\/\/)?(?:youtu\.be\/|www\.youtube\.com\/watch\?v=)([^&]+)/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  return (
    <div className="exercise-tracker-container p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-black">🏋️‍♂️ Exercise Tracker</h2>

      {/* Exercise Selection */}
      <div className="exercise-selection mb-4">
        <label htmlFor="exercise" className="text-lg font-semibold text-black">Select Exercise: </label>
        <select
          id="exercise"
          value={selectedExercise}
          onChange={handleExerciseChange}
          className="border p-2 rounded"
        >
          <option value="">-- Choose an Exercise --</option>
          {exercises.map((exercise, index) => (
            <option key={index} value={exercise}>{exercise}</option>
          ))}
        </select>
      </div>

      {/* Timer Controls */}
      {selectedExercise && (
        <div className="timer-controls">
          <h3 className="text-xl font-semibold text-black mb-2">Selected Exercise: {selectedExercise}</h3>
          <p className="text-2xl font-bold text-black">{formatTime(time)}</p>

          <div className="timer-buttons mt-4">
            <button
              onClick={startTimer}
              disabled={isActive || !selectedExercise}
              className="bg-green-500 text-white p-2 rounded mr-2"
            >
              Start
            </button>
            <button
              onClick={stopTimer}
              disabled={!isActive}
              className="bg-red-500 text-white p-2 rounded mr-2"
            >
              Stop
            </button>
            <button
              onClick={resetTimer}
              className="bg-gray-500 text-white p-2 rounded"
            >
              Reset
            </button>
          </div>

          {/* Show Video Thumbnails */}
          <div className="video-thumbnails mt-6">
            <h4 className="font-semibold text-black mb-2">Recommended Exercise Videos:</h4>
            <div className="thumbnails-grid">
              {exerciseVideos[selectedExercise].map((link, index) => {
                const videoId = getYouTubeId(link);
                return (
                  <a
                    key={index}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="thumbnail-link"
                  >
                    <img
                      src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                      alt="Exercise Thumbnail"
                      className="thumbnail"
                    />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {!selectedExercise && <p className="text-gray-500 mt-4">Please select an exercise to start the timer.</p>}
    </div>
  );
};

export default ExerciseTracker;
