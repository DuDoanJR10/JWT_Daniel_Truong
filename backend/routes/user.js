const userController = require("../controllers/userController");

const router = require("express").Router();

router.get("/", userController.getAllUsers);

router.delete("/:id", userController.deleteUser);

module.exports = router;
