import express from "express";
import { addModel, getAllModels, deleteModel, upload, getFile } from "../imageModel/imageController.js";

const Router = express.Router();

Router.post('/addModel', upload.single("model"), addModel);
Router.get('/getAllModels', getAllModels);
Router.get('/files/:id', getFile); // Route to stream file
Router.delete('/deleteModel/:id', deleteModel);

export default Router;

