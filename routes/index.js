const express = require("express");
const routes = require("./routes");
const apis = require("./apis");
const router = express.Router();

router.use("/", routes);
router.use("/apis", apis);

module.exports = router;
