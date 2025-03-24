import express, { Request, Response } from "express";
import authRoute from "./routes/authRoute";
import { AppDataSource } from "./services/db";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 4001;

app.use("/api/auth", authRoute);

AppDataSource.initialize()
  .then(() => {
    console.log("Connected to database successfully.");
    app.listen(PORT, () => {
      console.log(`Server is running on PORT ${PORT}`);
    });
  })
  .catch((err) => console.error("Error connecting to database: ", err));

app.get("/", async (req: Request, res: Response) => {
  res.send("Heyy");
});
