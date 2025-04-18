import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoute from "./routes/auth";
import brandsRoute from "./routes/brand";
import categoriesRoute from "./routes/category";
import productRoute from "./routes/product";
import wishlistRoute from "./routes/wishlist";
import cartRoute from "./routes/cart";
import addressRoute from "./routes/address";
import paymentRoute from "./routes/payment";
import ordersRoute from "./routes/orders";
import { AppDataSource } from "./utils/db";
import { handlepayment } from "./utils/services";
import { scheduleOrderStatusUpdate } from "./utils/scheduler";

const app = express();
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://swiftcart-tau.vercel.app"],
    credentials: true,
  })
);

app.post(
  "/api/webhook",
  express.raw({ type: "application/json" }),
  handlepayment
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
const PORT = process.env.PORT;

app.use("/api/auth", authRoute);
app.use("/brands", brandsRoute);
app.use("/categories", categoriesRoute);
app.use("/products", productRoute);
app.use("/wishlist", wishlistRoute);
app.use("/cart", cartRoute);
app.use("/address", addressRoute);
app.use("/payment", paymentRoute);
app.use("/orders", ordersRoute);

AppDataSource.initialize()
  .then(() => {
    console.log("Connected to database successfully.");
    scheduleOrderStatusUpdate();
    app.listen(PORT, () => {
      console.log(`Server is running on PORT ${PORT}`);
    });
  })
  .catch((err) => console.error("Error connecting to database: ", err));

app.get("/", async (req: Request, res: Response) => {
  res.send("Heyy");
});
