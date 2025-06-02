import React, { useState, useEffect } from "react";
import "./WellbeingMonitor.css";

function WellbeingMonitor() {
  // State Variables
  const [waterCount, setWaterCount] = useState(0);
  const [mood, setMood] = useState(3); // 1 to 5
  const [stressLevel, setStressLevel] = useState(5); // 1 to 10
  const [recommendedBreathing, setRecommendedBreathing] = useState(0);
  const [isBreathing, setIsBreathing] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [screenTime, setScreenTime] = useState(0);
  const [bmi, setBmi] = useState(null);
  const [bmiCategory, setBmiCategory] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [lastPeriod, setLastPeriod] = useState("");
  const [cycleLength, setCycleLength] = useState("");
  const [nextPeriod, setNextPeriod] = useState("");

  // Track Screen Time (Every Minute)
  useEffect(() => {
    const interval = setInterval(() => {
      setScreenTime((prev) => prev + 1);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Sync Mood & Stress for Breathing Duration
  useEffect(() => {
    const averageScore = Math.floor((mood * 2 + stressLevel) / 3);
    if (averageScore <= 3) setRecommendedBreathing(0);
    else if (averageScore > 3 && averageScore <= 6) setRecommendedBreathing(2);
    else if (averageScore > 6 && averageScore <= 8) setRecommendedBreathing(4);
    else setRecommendedBreathing(5);
  }, [mood, stressLevel]);

  // Handle Breathing Exercise Start
  const startBreathing = () => {
    if (recommendedBreathing > 0) {
      setIsBreathing(true);
      setSecondsLeft(recommendedBreathing * 60);
    }
  };

  // Breathing Timer
  useEffect(() => {
    if (isBreathing && secondsLeft > 0) {
      const timer = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (secondsLeft === 0 && isBreathing) {
      setIsBreathing(false);
    }
  }, [isBreathing, secondsLeft]);

  // BMI Calculator
  const calculateBMI = () => {
    if (height && weight) {
      const bmiValue = (weight / (height / 100) ** 2).toFixed(2);
      setBmi(bmiValue);

      if (bmiValue < 18.5) setBmiCategory("Underweight");
      else if (bmiValue < 24.9) setBmiCategory("Normal weight");
      else if (bmiValue < 29.9) setBmiCategory("Overweight");
      else setBmiCategory("Obese");
    }
  };

  // Menstruation Tracker
  const handlePeriodPrediction = () => {
    if (lastPeriod && cycleLength) {
      const last = new Date(lastPeriod);
      const next = new Date(last);
      next.setDate(last.getDate() + parseInt(cycleLength));
      setNextPeriod(next.toDateString());
    }
  };

  // Format Time Function (MM:SS)
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  return (
    <div className="wellbeing-monitor">
      <h1>🌟 Wellbeing Monitor</h1>

      {/* Water Intake Tracker */}
      <div className="wellbeing-section">
        <h3>💧 Water Intake</h3>
        <p>{waterCount} / 8 glasses</p>
        <button onClick={() => setWaterCount(waterCount + 1)}>Drink Water</button>
      </div>

      {/* Mood Analyzer */}
      <div className="wellbeing-section">
        <h3>😊 Mood Analyzer</h3>
        <div className="mood-buttons">
          <button onClick={() => setMood(5)}>😄 Happy</button>
          <button onClick={() => setMood(4)}>🙂 Calm</button>
          <button onClick={() => setMood(3)}>😐 Neutral</button>
          <button onClick={() => setMood(2)}>😟 Stressed</button>
          <button onClick={() => setMood(1)}>😢 Sad</button>
        </div>
        <p>Current Mood: {mood}</p>
      </div>

      {/* Stress Tracker */}
      <div className="wellbeing-section">
        <h3>😟 Stress Tracker</h3>
        <input
          type="range"
          min="1"
          max="10"
          value={stressLevel}
          onChange={(e) => setStressLevel(parseInt(e.target.value))}
        />
        <p>Stress Level: {stressLevel} / 10</p>
      </div>

      {/* Breathing Exercise */}
      <div className="wellbeing-section">
        <h3>🌬️ Breathing Exercise</h3>
        <p>Recommended Duration: {recommendedBreathing} minutes</p>
        <button onClick={startBreathing} disabled={isBreathing}>
          {isBreathing ? "In Progress..." : "Start Breathing"}
        </button>
        {isBreathing && <p>{formatTime(secondsLeft)}</p>}
      </div>

      {/* Screen Time */}
      <div className="wellbeing-section">
        <h3>🖥️ Screen Time</h3>
        <p>{screenTime} minutes on site</p>
      </div>

      {/* BMI Calculator */}
      <div className="wellbeing-section">
        <h3>📏 BMI Calculator</h3>
        <input type="number" placeholder="Height (cm)" onChange={(e) => setHeight(e.target.value)} />
        <input type="number" placeholder="Weight (kg)" onChange={(e) => setWeight(e.target.value)} />
        <button onClick={calculateBMI}>Calculate BMI</button>
        {bmi && <p>BMI: {bmi} ({bmiCategory})</p>}
      </div>

      {/* Menstruation Tracker */}
      <div className="wellbeing-section">
        <h3>🩸 Menstruation Tracker</h3>
        <input type="date" onChange={(e) => setLastPeriod(e.target.value)} />
        <input type="number" placeholder="Cycle Length (days)" onChange={(e) => setCycleLength(e.target.value)} />
        <button onClick={handlePeriodPrediction}>Predict</button>
        {nextPeriod && <p>Next Period: {nextPeriod}</p>}
      </div>
    </div>
  );
}

export default WellbeingMonitor;
