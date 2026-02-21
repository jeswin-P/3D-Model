import multer from "multer";
import fs from "fs";
import path from "path";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";
import imageSchema from "./imageSchema.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "3d-models",
    resource_type: "auto", // VERY IMPORTANT for .glb
  },
});

export const upload = multer({ storage });

export const addModel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Only .glb files are allowed" });
    }

    const newModel = new imageSchema({
      filename: req.file.originalname,
      filepath: req.file.path,
    });

    await newModel.save();
    res.status(201).json(newModel);
  } catch (error) {
    res.status(500).json({ error: "Upload failed", details: error.message });
  }
};


export const getAllModels = async (req, res) => {
  try {
    const models = await imageSchema.find();

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

export const deleteModel = async (req, res) => {
  try {
    const model = await imageSchema.findById(req.params.id);
    if (!model) {
      return res.status(404).json({ error: "Model not found" });
    }

    // Delete the file from the server
    const fullPath = path.resolve(model.filepath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }

    // Delete the record from the database
    await imageSchema.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Model deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Deletion failed", details: error.message });
  }
};
