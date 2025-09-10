const express = require("express");
const app = express();
const cors = require("cors");
const corsOptions = require("./config/cors");
const cookieParser = require("cookie-parser");
const credentials = require("./middlewares/credentials");
require("dotenv").config();
const PORT = process.env.PORT || 8080;

//middleware
app.use(credentials);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(corsOptions));

//app
app.use("/api", require("./routes/convertRoutes"));
app.use("/", require("./routes/Auth"));

app.get("/", (req, res) => {
  res.send("Welcome to conversion Backend Server");
});

app.listen(PORT, () => {
  console.log(`Your conversion backend is running on PORT no : ${PORT}`);
});
