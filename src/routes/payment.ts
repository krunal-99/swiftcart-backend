import express, { Request, Response } from "express";
import Stripe from "stripe";
import { CartItem } from "../entities/CartItem";
const stripe = new Stripe(process.env.STRIPE_SECRET!);
const router = express.Router();

router.post("/create-checkout-session", async (req: Request, res: Response) => {
  const { products, email } = req.body;

  const lineItems = products.map((item: CartItem) => ({
    price_data: {
      currency: "inr",
      product_data: {
        name: item.product.title,
        images: item.product.imageUrls,
      },
      unit_amount: Math.round(item.product.salePrice * 100),
    },
    quantity: item.quantity,
  }));

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: "http://localhost:5173/success",
      cancel_url: "http://localhost:5173/error",
      billing_address_collection: "required",
      customer_email: req.body.email || "unknown@example.com",
    });
    res.json({ id: session.id });
  } catch (error) {
    console.error("Stripe error:", error);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
});

export default router;
