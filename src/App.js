import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import Medibot from "./components/Medibot";
import NearbyServices from "./components/NearbyServices";
import WellbeingMonitor from "./components/WellbeingMonitor";
import ExerciseTracker from "./components/ExerciseTracker";
import PersonalHealthRecords from "./components/PersonalHealthRecords/PersonalHealthRecords";
import CommunityForum from "./components/CommunityForum";
import SOSReminders from "./components/SOSReminders";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/medibot" element={<Medibot />} />
        <Route path="/nearby" element={<NearbyServices />} />
        <Route path="/wellbeing" element={<WellbeingMonitor />} />
        <Route path="/exercise" element={<ExerciseTracker />} />
        <Route path="/phr" element={<PersonalHealthRecords />} />
        <Route path="/forum" element={<CommunityForum />} />
        <Route path="/sos" element={<SOSReminders />} />
      </Routes>
    </Router>
  );
}

export default App;
