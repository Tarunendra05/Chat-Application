const express = require("express");

const router = express.Router();

router.get("/:id", (req, res) => {
    res.send(req.params.id);
})

router.post("/register", (req, res) => {
    const email = req.body.email;
    password = req.body.password;
    username = req.body.username;
})

exports.userrouter = router;