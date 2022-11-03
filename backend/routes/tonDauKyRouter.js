const express = require("express");

const tonDauKyController = require("../controllers/tonDauKyController");

const tonDauKyRouter = express.Router();

tonDauKyRouter.get("/", tonDauKyController.getTonDauKy);
tonDauKyRouter.get("/:id", tonDauKyController.getTonDauKyById);
tonDauKyRouter.post("/create", tonDauKyController.create);
tonDauKyRouter.post("/:id", tonDauKyController.update);
tonDauKyRouter.post("/delete/:id", tonDauKyController.deleteTonDauKy);

module.exports = tonDauKyRouter;
