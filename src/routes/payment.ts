import express, { Request, Response } from "express";
import Stripe from "stripe";
import { CartItem } from "../entities/CartItem";
import { createOrderAfterPayment } from "../controllers/orders";

const stripe = new Stripe(process.env.STRIPE_SECRET!);
const router = express.Router();

router.post("/create-checkout-session", async (req: Request, res: Response) => {
  const { products, email, userId, addressId, cartId } = req.body;

  if (!products || !userId || !addressId || !cartId) {
    res
      .status(400)
      .json({ status: "failed", message: "Missing required fields" });
    return;
  }

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
      success_url: `${process.env.BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.BASE_URL}/error`,
      billing_address_collection: "required",
      customer_email: email || "unknown@example.com",
      metadata: {
        userId: userId.toString(),
        addressId: addressId.toString(),
        cartId: cartId.toString(),
      },
    });
    res.json({ id: session.id });
  } catch (error) {
    console.error("Stripe error:", error);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
});

export default router;
