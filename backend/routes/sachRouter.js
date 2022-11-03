const express = require("express");

const sachController = require("../controllers/sachController");

const sachRouter = express.Router();

sachRouter.get("/", sachController.getSach);
sachRouter.get("/:id", sachController.getSachById);
sachRouter.post("/create", sachController.create);
sachRouter.post("/:id", sachController.update);
sachRouter.post("/delete/:id", sachController.deleteSach);

module.exports = sachRouter;
