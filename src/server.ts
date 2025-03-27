import express, { Request, Response } from "express";
import authRoute from "./routes/authRoute";
import { AppDataSource } from "./services/db";
import cors from "cors";
import cookieParser from "cookie-parser";
import productRoute from "./routes/productRoute";
import categoriesRoute from "./routes/categoriesRoute";

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());
const PORT = process.env.PORT || 4001;

app.use("/api/auth", authRoute);
app.use("/products", productRoute);
app.use("/categories", categoriesRoute);

AppDataSource.initialize()
  .then(() => {
    console.log("Connected to database successfully.");
    app.listen(PORT, () => {
      console.log(`Server is running on PORT ${PORT}`);
    });
  })
  .catch((err) => console.error("Error connecting to database: ", err));

app.get("/", async (req: Request, res: Response) => {
  res.json("Heyy.");
});
