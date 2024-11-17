const router = require("express").Router();
const clothingItems = require("./clothingItems");
const userRouter = require("./users");
const auth = require("../middlewares/auth");
const { err404 } = require("../utils/errors");

router.use("/items", clothingItems);
router.use("/users", userRouter, auth);

router.use((req, res) => {
  res.status(err404.status).send({ message: "Router not found" });
});

module.exports = router;
