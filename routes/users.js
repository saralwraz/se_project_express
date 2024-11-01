const router = require("express").Router();
const { getUsers, getUserByID, createUser } = require("../controllers/users");

// GET /users
router.get("/", getUsers);

// GET /users/:userId
router.get("/:userId", getUserByID);

// POST /users - create new user
router.post("/", createUser);

module.exports = router;
