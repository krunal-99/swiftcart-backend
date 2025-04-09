import express, { Request, Response } from "express";
import Stripe from "stripe";
import { CartItem } from "../entities/CartItem";
const stripe = new Stripe(process.env.STRIPE_SECRET!);
const router = express.Router();

router.post("/create-checkout-session", async (req: Request, res: Response) => {
  const products = req.body;
  console.log(products.products);

  const lineItems = products.products.map((item: CartItem) => ({
    price_data: {
      currency: "inr",
      product_data: {
        name: item.product.title,
        images: [item.product.imageUrls],
      },
      unit_amount: item.product.salePrice,
    },
    quantity: item.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    success_url: "http://localhost:5173/success",
    cancel_url: "http://localhost:5173/error",
  });
  res.json({ id: session.id });
});

export default router;
