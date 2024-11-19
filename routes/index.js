const router = require("express").Router();
const clothingItems = require("./clothingItems");
const userRouter = require("./users");
const auth = require("../middlewares/auth");
const { err404 } = require("../utils/errors");
const { login, createUser } = require("../controllers/users");

router.use("/items", clothingItems);
router.use("/users", auth, userRouter);
router.post("/signin", login);
router.post("/signup", createUser);

router.use((req, res) => {
  res.status(err404.status).send({ message: "Router not found" });
});

module.exports = router;
