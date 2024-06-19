import express from "express";
import dotenv from "dotenv";
import conectarDB from "./config/db.js";
import cors from "cors";
import veterinarioRoutes from "./routes/veterinarioRoutes.js";
import pacienteRoutes from "./routes/pacienteRoutes.js";

const app = express();

app.use(express.json());

dotenv.config();

conectarDB();

const dominiosPermitidos = [process.env.FRONTEND_URL];

app.use(
  cors({
    origin: '*',
  }),
);


app.use("/api/veterinarios", veterinarioRoutes);

app.use("/api/pacientes", pacienteRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  `SERVIDOR CONECTADO EN EL PUERTO ${PORT}`;
});
