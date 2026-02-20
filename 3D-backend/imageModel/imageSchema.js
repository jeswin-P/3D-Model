import mongoose from "mongoose";

const ModelSchema = new mongoose.Schema({
  filename: String,
  filepath: String, // Kept for backward compatibility or direct URL reference if needed
  fileId: mongoose.Schema.Types.ObjectId, // GridFS file ID
  contentType: String,
  uploadedAt: { type: Date, default: Date.now },
});

export default mongoose.model('Model', ModelSchema);
