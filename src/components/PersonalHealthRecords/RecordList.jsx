import RecordItem from "./RecordItem";

function RecordList({ records, onDelete }) {
  return (
    <div className="record-list">
      {records.length === 0 ? (
        <p className="no-records">No records available. Add your first one!</p>
      ) : (
        records.map((record) => (
          <RecordItem key={record.id} record={record} onDelete={onDelete} />
        ))
      )}
    </div>
  );
}

export default RecordList;
