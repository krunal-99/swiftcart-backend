import { Brand } from "../entities/Brand";
import { Category } from "../entities/Category";
import { Product } from "../entities/Product";
import { Review } from "../entities/Review";
import { Users } from "../entities/User";
import { Wishlist } from "../entities/Wishlist";
import { AppDataSource } from "./db";
import jwt from "jsonwebtoken";
import { generateTokenProps } from "./types";
import { Cart } from "../entities/Cart";
import { CartItem } from "../entities/CartItem";
import { Address } from "../entities/Address";
import { Order } from "../entities/Order";
import { OrderItem } from "../entities/OrderItem";
import { Request, Response } from "express";
import Stripe from "stripe";
import { createOrderAfterPayment } from "../controllers/orders";

export const userRepo = AppDataSource.getRepository(Users);
export const productsRepo = AppDataSource.getRepository(Product);
export const categoriesRepo = AppDataSource.getRepository(Category);
export const brandsRepo = AppDataSource.getRepository(Brand);
export const reviewsRepo = AppDataSource.getRepository(Review);
export const wishlistRepo = AppDataSource.getRepository(Wishlist);
export const cartRepo = AppDataSource.getRepository(Cart);
export const cartItemRepo = AppDataSource.getRepository(CartItem);
export const addressRepo = AppDataSource.getRepository(Address);
export const orderRepo = AppDataSource.getRepository(Order);
export const orderItemRepo = AppDataSource.getRepository(OrderItem);

export const generateToken = (payload: generateTokenProps) => {
  if (!process.env.SECRET) {
    throw new Error("SECRET environment variable is not defined");
  }
  return jwt.sign(payload, process.env.SECRET, {
    expiresIn: "24h",
  });
};

const stripe = new Stripe(process.env.STRIPE_SECRET!);

export const handlepayment = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"] as string | undefined;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig) {
    console.error("Missing stripe-signature header");
    res.status(400).send("Missing stripe-signature header");
    return;
  }

  let event;
  try {
    const rawBody = req.body as Buffer;
    event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret!);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const { userId, addressId, cartId } = session.metadata || {};

      if (!userId || !addressId || !cartId) {
        console.error("Missing metadata in session");
        res.status(400).json({ status: "failed", message: "Missing metadata" });
        return;
      }

      try {
        await createOrderAfterPayment({
          userId: parseInt(userId),
          addressId: parseInt(addressId),
          cartId: parseInt(cartId),
          paymentEmail: session.customer_email || "",
          sessionId: session.id,
        });
        res.status(200).json({ received: true });
      } catch (error) {
        console.error("Error processing order:", error);
        res.status(500).json({ error: "Failed to process order" });
      }
    } else {
      res.status(200).json({ received: true });
    }
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    res.status(400).send(`Webhook Error: ${err}`);
  }
};
