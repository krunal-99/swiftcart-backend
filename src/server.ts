import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoute from "./routes/auth";
import brandsRoute from "./routes/brand";
import categoriesRoute from "./routes/category";
import productRoute from "./routes/product";
import { AppDataSource } from "./utils/db";

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());
const PORT = process.env.PORT || 4001;

app.use("/api/auth", authRoute);
app.use("/brands", brandsRoute);
app.use("/categories", categoriesRoute);
app.use("/products", productRoute);

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
