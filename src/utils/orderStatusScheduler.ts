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
    console.log(
      `Order statuses updated successfully at ${new Date().toISOString()}`
    );
  } catch (error) {
    console.error("Error updating order statuses:", error);
  }
};

export const scheduleOrderStatusUpdate = () => {
  cron.schedule("0 0 * * *", () => {
    console.log("Running daily order status updates...");
    updateOrderStatuses();
  });
};
