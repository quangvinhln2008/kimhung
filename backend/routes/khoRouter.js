const express = require("express");

const khoController = require("../controllers/khoController");

const khoRouter = express.Router();

khoRouter.get("/", khoController.getKho);
khoRouter.get("/:id", khoController.getKhoById);
khoRouter.post("/create", khoController.create);
khoRouter.post("/:id", khoController.update);
khoRouter.post("/delete/:id", khoController.deleteKho);

module.exports = khoRouter;
