import mongoose from "mongoose";

const PersonalHealthRecordSchema = new mongoose.Schema({
  patientName: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  diagnosis: {
    type: String,
    required: true,
  },
  medications: {
    type: [String],
    required: true,
  },
  labResults: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  file: {
    type: String,
  },
});

export default mongoose.model("PersonalHealthRecord", PersonalHealthRecordSchema);
