import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import connectDB from "./db.js";
import routes from './routes/router.js'
import { fileURLToPath } from "url";


dotenv.config();
connectDB();
const app = express();
app.use(
  cors({
    origin: [
      "https://3-d-model-hub.vercel.app/",
      "http://localhost:3000"
    ],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true
  })
);


app.use(express.json());
app.use('/', routes);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
