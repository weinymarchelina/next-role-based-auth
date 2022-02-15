const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    orders: [
      {
        orderDate: String,
        finishDate: String,
        itemList: Array,
        totalPrice: Number,
        paymentMethod: String,
        customer: String,
      },
    ],

    businessId: String,
  },
  { timestamps: true }
);

let Order = mongoose.models.orders || mongoose.model("orders", OrderSchema);

module.exports = Order;
