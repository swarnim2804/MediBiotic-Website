function SummaryPanel({ records }) {
    const total = records.length;
    const avgAge = total ? (records.reduce((sum, r) => sum + Number(r.age), 0) / total).toFixed(1) : 0;
    const bloodTypes = [...new Set(records.map(r => r.bloodType))].join(", ") || "None";
  
    return (
      <div className="summary-panel">
        <h4>Summary</h4>
        <p><strong>Total Records:</strong> {total}</p>
        <p><strong>Average Age:</strong> {avgAge}</p>
        <p><strong>Blood Types:</strong> {bloodTypes}</p>
      </div>
    );
  }
  
  export default SummaryPanel;
  