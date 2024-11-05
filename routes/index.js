const router = require("express").Router();
const clothingItems = require("./clothingItems");
const userRouter = require("./users");
const { err404 } = require("../utils/errors");

router.use("/items", clothingItems);
router.use("/users", userRouter);

router.use((req, res) => {
  res.status(err404.status).send({ message: "Router not found" });
});

module.exports = router;
