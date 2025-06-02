import React, { useState, useEffect } from 'react';
import './SOSReminders.css';

function SOSReminders() {
  const [emergencyContacts] = useState([
    { name: "Ambulance", phone: "108" },
    { name: "Police", phone: "100" },
  ]);
  const [medicationReminders, setMedicationReminders] = useState([]);
  const [newMedication, setNewMedication] = useState("");
  const [newTime, setNewTime] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  // Request Notification Permission on Mount
  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  // Handle Adding New Medication Reminders
  const handleAddReminder = () => {
    if (newMedication && newTime) {
      setMedicationReminders([
        ...medicationReminders,
        { medication: newMedication, time: newTime }
      ]);
      setNewMedication("");
      setNewTime("");
    }
  };

  // Handle Deleting a Medication Reminder
  const handleDeleteReminder = (index) => {
    const updatedReminders = medicationReminders.filter((_, i) => i !== index);
    setMedicationReminders(updatedReminders);
  };

  // Handle Sending an SOS Alert
  const handleSendSOS = () => {
    emergencyContacts.forEach(contact => {
      alert(`📢 SOS Alert sent to ${contact.name} at ${contact.phone}`);
    });
  };

  // Screen Transition Effect
  const showScreenTransition = (medication) => {
    setAlertMessage(`💊 Time to take ${medication}!`);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000); // Dismiss after 5 seconds
  };

  // Check Reminder Time Every Second
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const currentTime = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
      console.log("⏰ Current Time:", currentTime);

      medicationReminders.forEach(reminder => {
        console.log("🔍 Checking Reminder:", reminder.time);
        if (reminder.time === currentTime) {
          console.log("🚨 Reminder Triggered for:", reminder.medication);
          showScreenTransition(reminder.medication);
          showNotification(reminder.medication);
        }
      });
    }, 1000); // Check every second
    return () => clearInterval(timer);
  }, [medicationReminders]);

  // Show Browser Notification
  const showNotification = (medication) => {
    if (Notification.permission === "granted") {
      new Notification("💊 Medication Reminder", {
        body: `Time to take your ${medication}!`,
      });
    } else {
      alert(`💊 Reminder: Time to take your ${medication}!`);
    }
  };

  return (
    <div className="sos-reminders-container">
      <h2>🚨 Emergency SOS & 💊 Medication Reminders</h2>

      {/* Emergency SOS Section */}
      <div className="sos-section">
        <h3>🔴 Emergency SOS</h3>
        <p>In case of an emergency, notify us instantly.</p>
        <button className="sos-button" onClick={handleSendSOS}>
          Send SOS Alert
        </button>
        <ul className="contact-list">
          {emergencyContacts.map((contact, index) => (
            <li key={index}>
              <strong>{contact.name}:</strong> {contact.phone}
            </li>
          ))}
        </ul>
      </div>

      {/* Medication Reminder Section */}
      <div className="reminder-section">
        <h3>💊 Medication Reminders</h3>
        <p>Keep track of your medications and their schedules.</p>
        <div className="reminder-form">
          <input
            type="text"
            placeholder="Medication Name"
            value={newMedication}
            onChange={(e) => setNewMedication(e.target.value)}
          />
          <input
            type="time"
            value={newTime}
            onChange={(e) => setNewTime(e.target.value)}
          />
          <button onClick={handleAddReminder}>Add Reminder</button>
        </div>

        <ul className="reminder-list">
          {medicationReminders.map((reminder, index) => (
            <li key={index}>
              <span>{reminder.medication} - {reminder.time}</span>
              <button onClick={() => handleDeleteReminder(index)}>❌</button>
            </li>
          ))}
        </ul>
      </div>

      {/* Full Screen Transition */}
      {showAlert && (
        <div className="alert-overlay">
          {alertMessage}
        </div>
      )}
    </div>
  );
}

export default SOSReminders;
