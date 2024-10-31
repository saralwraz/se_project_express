const router = require("express").Router();
const { getUsers, getUser, createUser } = require("../controllers/users");

// GET /users
router.get("/", getUsers);

// GET /users/:userId
router.get("/:userId", getUser);

// POST /users - create new user
router.post("/", createUser);

module.exports = router;
