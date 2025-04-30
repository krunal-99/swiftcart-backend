import { Request, Response } from "express";
import {
  addressRepo,
  cartRepo,
  orderItemRepo,
  orderRepo,
  userRepo,
} from "../utils/services";
import { OrderData } from "../utils/types";
import { Order } from "../entities/Order";
import { OrderItem } from "../entities/OrderItem";

export const getOrderByUsers = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  try {
    const orders = await orderRepo.find({
      where: { users: { id: parseInt(userId!) } },
      relations: ["items"],
    });

    res.status(201).json({ status: "success", data: orders });
  } catch (error) {
    res
      .status(500)
      .json({ status: "failed", message: "Internal Server Error" });
  }
};

export const createOrderAfterPayment = async (data: OrderData) => {
  const { userId, addressId, cartId, payment_email, sessionId } = data;

  const user = await userRepo.findOne({ where: { id: userId } });
  const cart = await cartRepo.findOne({
    where: { id: cartId },
    relations: ["items", "items.product"],
  });
  const address = await addressRepo.findOne({ where: { id: addressId } });

  if (!user || !cart || !address) {
    throw new Error("User, cart, or address not found");
  }

  if (!cart.items || cart.items.length === 0) {
    throw new Error("Cart is empty");
  }

  const order = new Order();
  order.users = user;
  order.date = new Date().toISOString().split("T")[0];
  order.status = "processing";
  order.shipping_address = `${address.street_address}, ${address.city}, ${address.state}, ${address.pincode}, ${address.country}`;
  order.estimated_delivery = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];
  order.payment_method = "card";
  order.payment_status = "Completed";
  order.payment_email = payment_email;
  order.sessionId = sessionId;
  order.items = [];

  for (const cartItem of cart.items) {
    const orderItem = new OrderItem();
    orderItem.name = cartItem.product.title;
    orderItem.price = cartItem.product.sale_price;
    orderItem.quantity = cartItem.quantity;
    orderItem.image = cartItem.product.imageUrls[0];
    orderItem.order = order;
    order.items.push(orderItem);
  }

  await orderRepo.save(order);
  await orderItemRepo.save(order.items);
  await cartRepo.remove(cart);
  return order;
};

export const getOrderById = async (req: Request, res: Response) => {
  const { orderId } = req.params;
  try {
    const order = await orderRepo.findOne({
      where: { id: parseInt(orderId) },
      relations: ["users", "items"],
    });
    if (!order) {
      res.status(404).json({ status: "failed", message: "Order not found" });
      return;
    }
    res.status(200).json({ status: "success", data: order });
  } catch (error) {
    res
      .status(500)
      .json({ status: "failed", message: "Internal Server Error" });
  }
};

export const getOrderBySessionId = async (req: Request, res: Response) => {
  const { sessionId } = req.params;
  try {
    const order = await orderRepo.findOne({
      where: { sessionId },
      relations: ["users", "items"],
    });
    if (!order) {
      res.status(404).json({ status: "failed", message: "Order not found" });
      return;
    }
    res.status(200).json({ status: "success", data: order });
  } catch (error) {
    res
      .status(500)
      .json({ status: "failed", message: "Internal Server Error" });
  }
};
