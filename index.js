const express = require("express");
const userRoute = require("./routes/user");
const adminRoute = require("./routes/admin");
const mongoose = require("mongoose");

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

mongoose
  .connect("mongodb://localhost:27017/practical")
  .then(() => {
    console.log("Monodb connected successfully");
  })
  .catch((error) => console.log(` There is a problem connecting : ${error}`));

mongoose.set("debug", true);

const port = 3000;

app.use("/user", userRoute);
app.use("/admin", adminRoute);

app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});
