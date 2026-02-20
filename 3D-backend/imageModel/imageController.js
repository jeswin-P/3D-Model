import multer from "multer";
import { GridFsStorage } from "multer-gridfs-storage";
import mongoose from "mongoose";
import imageSchema from "./imageSchema.js";
import dotenv from "dotenv";

dotenv.config();

// Create a storage object with a given configuration
const storage = new GridFsStorage({
  url: process.env.MONGO_URI,
  file: (req, file) => {
    return {
      bucketName: "uploads", // Setting collection name to 'uploads'
      filename: `${Date.now()}-${file.originalname}`,
      metadata: { originalName: file.originalname }
    };
  },
});

export const upload = multer({ storage });

let gfs;
const conn = mongoose.connection;
conn.once("open", () => {
  // Init stream
  gfs = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "uploads"
  });
});

export const addModel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Create a record in the 'Model' collection linking to the GridFS file
    const newModel = new imageSchema({
      filename: req.file.filename,
      fileId: req.file.id, // Store GridFS ID
      contentType: req.file.contentType,
    });

    await newModel.save();
    res.status(201).json(newModel);
  } catch (error) {
    res.status(500).json({ error: "Upload failed", details: error.message });
  }
};

export const getAllModels = async (req, res) => {
  try {
    const models = await imageSchema.find().sort({ uploadedAt: -1 });

    if (models.length === 0) {
      return res.status(404).json({ message: "No models found" });
    }

    res.status(200).json(models);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch models", details: error.message });
  }
};

// Stream file from GridFS to client
export const getFile = async (req, res) => {
  try {
    const _id = new mongoose.Types.ObjectId(req.params.id);
    const files = await gfs.find({ _id }).toArray();
    if (!files || files.length === 0) {
      return res.status(404).json({
        err: 'No file exists'
      });
    }

    gfs.openDownloadStream(_id).pipe(res);
  } catch (err) {
    // Try finding by filename as fallback or if ID is invalid hex
    try {
      const file = await gfs.find({ filename: req.params.id }).toArray();
      if (!file || file.length === 0) {
        return res.status(404).json({
          err: 'No file exists'
        });
      }
      gfs.openDownloadStreamByName(req.params.id).pipe(res);

    } catch (e) {
      res.status(500).json({ err: 'Server Error' });
    }
  }
};


export const deleteModel = async (req, res) => {
  try {
    const model = await imageSchema.findById(req.params.id);
    if (!model) {
      return res.status(404).json({ error: "Model not found" });
    }

    // Delete from GridFS if fileId exists
    if (model.fileId) {
      try {
        await gfs.delete(new mongoose.Types.ObjectId(model.fileId));
      } catch (err) {
        console.error("Error deleting from GridFS:", err);
        // Continue to delete metadata even if file is missing (orphan cleanup)
      }
    } else if (model.filename) {
      // Fallback: try to find and delete by filename if fileId is missing (legacy)
      const files = await gfs.find({ filename: model.filename }).toArray();
      if (files.length > 0) {
        await gfs.delete(files[0]._id);
      }
    }

    // Delete the record from the database
    await imageSchema.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Model deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Deletion failed", details: error.message });
  }
};
