const express = require("express");
const router = express.Router();
const db = require("../db/index.js");

router.get("/", function(req, res, next) {
   res.send("GROUPS");
});

module.exports = router;