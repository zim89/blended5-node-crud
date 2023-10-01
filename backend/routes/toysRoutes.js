const toysController = require("../controllers/ToysController");
const isValidId = require("../middlewares/isValidId");
const authMiddelware = require("../middlewares/authMiddelware");
const rolesMiddelware = require("../middlewares/rolesMiddelware");

const toysRoutes = require("express").Router();

// Add
toysRoutes.post(
  "/toys",
  (req, res, next) => {
    console.log("Joi");
    next();
  },
  authMiddelware,
  toysController.create
);

// Get All
toysRoutes.get(
  "/toys",
  authMiddelware,
  rolesMiddelware(["ADMIN", "MODERATOR", "CTO", "USER"]),
  toysController.findAll
);

// Get One
toysRoutes.get("/toys/:id", isValidId, toysController.findOne);

// Update
toysRoutes.put("/toys/:id", authMiddelware, isValidId, toysController.update);
// Remove
toysRoutes.delete("/toys/:id", isValidId, toysController.remove);

module.exports = toysRoutes;
