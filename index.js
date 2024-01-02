const express = require("express");

const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/user/:id", (req, res) => {
    res.send(req.params.id);
})



app.listen(port, () => {
  console.log("Listening on port "+port);
});