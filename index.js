const express = require("express");
require('dotenv').config();
const {userrouter} = require("./routes/user");
const {messagerouter} = require("./routes/message");
const {authorise} = require("./authorise");


const app = express();
const port = 3000;


app.use(express.json());

app.use("/user", userrouter);
app.use("/message", authorise, messagerouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log("Listening on port "+port);
});