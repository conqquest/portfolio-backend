import express from "express";
import cors from "cors";
import spotifyRoutes from "./routes/spotify.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/", spotifyRoutes);

export default app;