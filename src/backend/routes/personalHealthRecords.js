import express from "express";
import multer from "multer";
import path from "path";
import PersonalHealthRecord from "../models/PersonalHealthRecord.js";

const router = express.Router();

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// @route GET /api/phr
// @desc Get all health records
router.get("/", async (req, res) => {
  try {
    const records = await PersonalHealthRecord.find();
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: "Error fetching records" });
  }
});

// @route POST /api/phr
// @desc Create a new health record
router.post("/", upload.single("file"), async (req, res) => {
  const { patientName, age, diagnosis, medications, labResults } = req.body;

  try {
    const newRecord = new PersonalHealthRecord({
      patientName,
      age,
      diagnosis,
      medications: medications.split(","), // Convert comma-separated string to array
      labResults,
      file: req.file ? req.file.filename : null,
    });

    await newRecord.save();
    res.status(201).json(newRecord);
  } catch (error) {
    res.status(400).json({ message: "Error creating record", error });
  }
});

// @route DELETE /api/phr/:id
// @desc Delete a health record
router.delete("/:id", async (req, res) => {
  try {
    await PersonalHealthRecord.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Record deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting record" });
  }
});

export default router;
