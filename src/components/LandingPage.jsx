import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

const healthTips = [
  "Stay hydrated throughout the day.",
  "Take a 5-minute walk every hour.",
  "Include more fruits and vegetables in your diet.",
  "Get 7-8 hours of sleep every night.",
  "Stretch regularly to keep your body flexible.",
  "Practice mindfulness to reduce stress.",
  "Limit screen time before bed for better sleep."
];

function LandingPage() {
  const [currentTip, setCurrentTip] = useState(healthTips[0]);
  const [activeCard, setActiveCard] = useState(null); // State to track enlarged card
  const featureSectionRef = useRef(null);
  const navigate = useNavigate(); 

  // Scroll to Feature Section
  const handleExploreClick = () => {
    featureSectionRef.current.scrollIntoView({ behavior: "smooth" });
  };

  // Health Tip Shuffler
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prevTip) => {
        const currentIndex = healthTips.indexOf(prevTip);
        return healthTips[(currentIndex + 1) % healthTips.length];
      });
    }, 4000); // Change tip every 4 seconds

    return () => clearInterval(interval);
  }, []);

  // Handle Card Click
  const handleFeatureClick = (path, index) => {
    setActiveCard((prevActive) => (prevActive === index ? null : index)); // Toggle enlarge
    if (activeCard === index) {
      navigate(path); // Navigate if the card is already enlarged
    }
  };

  return (
    <>
      <div className="landing-container">
        {/* Left Section */}
        <div className="left-section">
          <button className="explore-button" onClick={handleExploreClick}>
            Explore More!
          </button>
        </div>

        {/* Daily Health Tips Section */}
        <div className="daily-health-tips">
          <h4 className="tips-heading">Daily Health Tips:</h4>
          <p className="health-tip">{currentTip}</p>
        </div>
      </div>

      {/* Feature Section */}
      <div className="features-section" ref={featureSectionRef}>
        <div className="circular-grid">
          {[
            { name: "Medibot", path: "/medibot" },
            { name: "Nearby Services", path: "/nearby" },
            { name: "Wellbeing Monitor", path: "/wellbeing" },
            { name: "Exercise Tracker", path: "/exercise" },
            { name: "Personal Health Records", path: "/phr" },
            { name: "SOS Reminders", path: "/sos" },
            { name: "Community Forum", path: "/forum" },
          ].map((feature, index) => (
            <div
              key={index}
              className={`feature-card ${
                activeCard === index ? "active" : ""
              }`}
              onClick={() => handleFeatureClick(feature.path, index)}
            >
              {feature.name}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default LandingPage;
