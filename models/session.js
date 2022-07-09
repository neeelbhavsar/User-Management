const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const sessionSchema = new Schema(
  {
    email: {
      type: "string",
      required: true,
    },
    token: {
      type: "string",
      required: true,
    },
    role: {
      type: "string",
      required: true,
      enum: ["Admin", "Buyer", "Seller"],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Session = mongoose.model("Session", sessionSchema);

module.exports = Session;
