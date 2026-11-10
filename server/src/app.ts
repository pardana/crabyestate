import express from "express";
import cors from "cors";
import AuthRouter from "./routes/auth.route.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", AuthRouter);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Hello Craby Estate!",
  });
});

export default app;
