import mongoose from "mongoose";

const ModelSchema = new mongoose.Schema({
  filename: String,
  filepath: String,
  uploadedAt: { type: Date, default: Date.now },
});

export default mongoose.model('Model', ModelSchema);
