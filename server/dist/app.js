import express from "express";
import cors from "cors";
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/hello", (req, res) => {
    res.json({
        success: true,
        message: "Hello Craby Estate!",
    });
});
export default app;
