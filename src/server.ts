import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoute from "./routes/auth";
import brandsRoute from "./routes/brand";
import categoriesRoute from "./routes/category";
import productRoute from "./routes/product";
import wishlistRoute from "./routes/wishlist";
import cartRoute from "./routes/cart";
import { AppDataSource } from "./utils/db";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: ["http://localhost:5173"], credentials: true }));
const PORT = process.env.PORT || 4001;

app.use("/api/auth", authRoute);
app.use("/brands", brandsRoute);
app.use("/categories", categoriesRoute);
app.use("/products", productRoute);
app.use("/wishlist", wishlistRoute);
app.use("/cart", cartRoute);

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
