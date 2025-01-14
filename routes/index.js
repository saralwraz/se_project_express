const router = require("express").Router();
const clothingItems = require("./clothingItems");
const userRouter = require("./users");
const NotFoundError = require("../utils/errors/NotFoundError");
const { login, createUser } = require("../controllers/users");
const {
  validateCreateUser,
  validateLogin,
} = require("../middlewares/validation");

router.use("/items", clothingItems);
router.use("/users", userRouter);
router.post("/signin", validateLogin, login);
router.post("/signup", validateCreateUser, createUser);

router.use((req, res) => {
  router.use((req, res, next) => {
    next(new NotFoundError("Router not found"));
  });
});

module.exports = router;
