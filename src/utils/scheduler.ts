import { orderRepo } from "./services";
import * as cron from "node-cron";

export const updateOrderStatuses = async () => {
  try {
    const orders = await orderRepo.find({
      where: [{ status: "processing" }, { status: "shipped" }],
    });
    for (const order of orders) {
      if (order.status === "processing") {
        order.status = "shipped";
      } else if (order.status === "shipped") {
        order.status = "delivered";
      }
    }

    await orderRepo.save(orders);
  } catch (error) {
    console.error("Error updating order statuses:", error);
  }
};

export const scheduleOrderStatusUpdate = () => {
  cron.schedule("* * * * *", () => {
    updateOrderStatuses();
  });
};
