const router = require("express").Router();
const clothingItems = require("./clothingItems");
const userRouter = require("./users");
const { createUser, login } = require("../controllers/users");
const { NOT_FOUND_CODE } = require("../utils/errors");

router.post("/signin", login);
router.post("/signup", createUser);
router.use("/items", clothingItems);
router.use("/users", userRouter);
router.use((req, res) => {
  res.status(NOT_FOUND_CODE).send({ message: "Router not found" });
});

module.exports = router;
