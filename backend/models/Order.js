const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    image: {
      type: String,
      default: ""
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
      trim: true
    },
    customerEmail: {
      type: String,
      required: true,
      trim: true
    },
    customerPhone: {
      type: String,
      default: "",
      trim: true
    },
    deliveryAddress: {
      type: String,
      required: true,
      trim: true
    },
    items: {
      type: [orderItemSchema],
      validate: {
        validator(items) {
          return items.length > 0;
        },
        message: "Order must include at least one item."
      }
    },
    total: {
      type: Number,
      required: true,
      min: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
