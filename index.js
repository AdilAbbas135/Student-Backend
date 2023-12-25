const express = require("express");
const app = express();
var cors = require("cors");
// const bodyParser = require("body-parser");
const connect_to_db = require("./db");
connect_to_db();

// MIDDLEWEAR
// app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

// PORT
app.listen(5000, () => {
  console.log("Bacend server is running at port 5000");
});

// ROUTES
app.use("/api/auth", require("./Routes/auth"));
app.use("/api/user", require("./Routes/user"));
app.use("/api/products", require("./Routes/product"));
app.use("/api/checkout", require("./Routes/stripe"));
app.use("/api/categories", require("./Routes/categories"));
