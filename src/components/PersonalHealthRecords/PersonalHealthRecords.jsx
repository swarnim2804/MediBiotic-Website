import { useState, useEffect } from "react";  // ✅ Place imports at the top
import Form from "./Form";
import RecordList from "./RecordList";
import SummaryPanel from "./SummaryPanel";
import "./PersonalHealthRecords.css";

function PersonalHealthRecords() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const savedRecords = JSON.parse(localStorage.getItem("healthRecords")) || [];
    setRecords(savedRecords);
  }, []);

  const saveToLocalStorage = (data) => {
    localStorage.setItem("healthRecords", JSON.stringify(data));
  };

  const handleAddRecord = (newRecord) => {
    const updatedRecords = [...records, { ...newRecord, id: Date.now() }];
    setRecords(updatedRecords);
    saveToLocalStorage(updatedRecords);
  };

  const handleDelete = (id) => {
    const updatedRecords = records.filter((record) => record.id !== id);
    setRecords(updatedRecords);
    saveToLocalStorage(updatedRecords);
  };

  return (
    <div className="phr-container">
      <h2 className="title">Personal Health Records</h2>
      <SummaryPanel records={records} />
      <div className="content-grid">
        <Form onAdd={handleAddRecord} />
        <RecordList records={records} onDelete={handleDelete} />
      </div>
    </div>
  );
}

export default PersonalHealthRecords;
