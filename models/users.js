const mongoose = require("mongoose");
const mongoosePagination = require("mongoose-paginate");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    fname: {
      type: "string",
      required: true
    },
    lname: {
      type: "string",
      required: false
    },
    email: {
      type: "string",
      required: true
    },
    role: {
      type: "string",
      required: true,
      enum: ["Admin", "Buyer", "Seller"],
    },
    password: {
        type: "string",
        required: true
    }
  },
  { timestamps: true }
);

userSchema.plugin(mongoosePagination);
const User = mongoose.model("User", userSchema);

module.exports = User;
