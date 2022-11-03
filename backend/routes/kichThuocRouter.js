const express = require("express");

const kichThuocController = require("../controllers/KichThuocController");

const kichThuocRouter = express.Router();

kichThuocRouter.get("/", kichThuocController.getKichThuoc);
kichThuocRouter.get("/:id", kichThuocController.getKichThuocById);
kichThuocRouter.post("/create", kichTkichThuocControllerhuocController.create);
kichThuocRouter.post("/:id", kichThuocController.update);
kichThuocRouter.post("/delete/:id", kichThuocController.deleteKichThuoc);

module.exports = kichThuocRouter;
