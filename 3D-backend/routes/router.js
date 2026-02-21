import express from "express";
import { addModel, getAllModels, deleteModel, upload } from "../imageModel/imageController.js";

const Router = express.Router();

Router.post('/addModel', upload.single("model"), addModel);
Router.get('/getAllModels', getAllModels);
Router.delete('/deleteModel/:id', deleteModel);

export default Router;
