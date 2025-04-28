import { Request, Response } from "express";
import { cartItemRepo, cartRepo } from "../utils/services";

export const getAllCartItems = async (req: Request, res: Response) => {
  try {
    const cartItems = await cartRepo.find({
      relations: ["items", "user"],
    });
    res.status(201).json({ status: "success", data: cartItems });
  } catch (error) {
    res.status(500).json({ status: "failed", data: "Internal server error." });
  }
};

export const addToCart = async (req: Request, res: Response) => {
  const { userId, productId, quantity, selectedColor } = req.body;
  try {
    let cart = await cartRepo.findOne({
      where: { user: { id: userId } },
      relations: ["items", "items.product"],
    });

    if (!cart) {
      cart = cartRepo.create({ user: { id: userId }, items: [] });
      await cartRepo.save(cart);
    }

    const existingItem = cart.items.find(
      (item) =>
        item.product.id === productId && item.selected_color === selectedColor
    );

    if (existingItem) {
      existingItem.quantity += quantity;
      await cartItemRepo.save(existingItem);
    } else {
      const newItem = cartItemRepo.create({
        product: { id: productId },
        quantity,
        selected_color: selectedColor,
        cart,
      });
      await cartItemRepo.save(newItem);
      cart.items.push(newItem);
      await cartRepo.save(cart);
    }
    const updatedCart = await cartRepo.findOne({
      where: { id: cart.id },
      relations: ["items", "items.product"],
    });
    res.status(201).json({
      status: "success",
      data: updatedCart,
      message: "Item added to cart successfully",
    });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res
      .status(500)
      .json({ status: "failed", message: "Internal server error" });
  }
};

export const getCartByUser = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const [cartItems, totalCount] = await cartRepo.findAndCount({
      where: { user: { id: Number(userId) } },
      relations: ["items", "items.product"],
      order: {
        items: {
          id: "ASC",
        },
      },
    });
    res.status(201).json({ status: "success", data: cartItems, totalCount });
  } catch (error) {
    res.status(500).json({ status: "failed", data: "Internal server error." });
  }
};

export const removeFromCart = async (req: Request, res: Response) => {
  const { itemId } = req.params;
  try {
    const itemToDelete = await cartItemRepo.findOne({
      where: { id: Number(itemId) },
      relations: ["product"],
    });
    if (!itemToDelete) {
      res.status(404).json({
        status: "failed",
        data: null,
        message: "Item not found in cart.",
      });
      return;
    }

    await cartItemRepo.delete(itemToDelete.id);

    res.status(201).json({
      status: "success",
      data: itemToDelete,
      message: `Item removed from cart successfully`,
    });
  } catch (error) {
    res.status(500).json({
      status: "failed",
      data: null,
      message: "Internal server error",
    });
  }
};

export const clearCart = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const cart = await cartRepo.findOne({
      where: { user: { id: Number(userId) } },
      relations: ["items"],
    });
    if (!cart) {
      res.status(404).json({
        status: "failed",
        message: "Cart not found",
      });
      return;
    }
    await cartItemRepo.delete({ cart: { id: cart.id } });
    res.status(200).json({
      status: "success",
      message: "Cart cleared successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: "failed", message: "Internal server error" });
  }
};

export const updateCartItem = async (req: Request, res: Response) => {
  const { itemId } = req.params;
  const { quantity } = req.body;
  try {
    const item = await cartItemRepo.findOne({
      where: { id: Number(itemId) },
      relations: ["product", "cart"],
    });
    if (!item) {
      res.status(404).json({
        status: "failed",
        message: "Cart item not found",
      });
      return;
    }

    if (quantity > 5) {
      res.status(500).json({
        status: "failed",
        data: item,
        message: "Cart quantity limit is 5.",
      });
      return;
    }

    if (quantity <= 0) {
      await cartItemRepo.delete(item.id);
      res.status(200).json({
        status: "success",
        data: item,
        message: "Item removed from cart",
      });
      return;
    }
    item.quantity = quantity;
    await cartItemRepo.save(item);
    res.status(200).json({
      status: "success",
      data: item,
      message: "Cart item updated successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: "failed", message: "Internal server error" });
  }
};
