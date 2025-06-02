function RecordItem({ record, onDelete }) {
  return (
    <div className="record-item">
      {record.profilePic && <img src={record.profilePic} alt="Profile" className="profile-pic" />}
      <h4>{record.name}</h4>
      <p><strong>Age:</strong> {record.age}</p>
      <p><strong>Blood Type:</strong> {record.bloodType || "N/A"}</p>
      <p><strong>Allergies:</strong> {record.allergies || "None"}</p>
      <p><strong>Notes:</strong> {record.notes || "No notes added"}</p>
      <button onClick={() => onDelete(record.id)} className="delete-btn">Delete</button>
    </div>
  );
}

export default RecordItem;
