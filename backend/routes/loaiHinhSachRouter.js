const express = require("express");

const loaiHinhSachController = require("../controllers/loaiHinhSachController");

const loaiHinhSachRouter = express.Router();

loaiHinhSachRouter.get("/", loaiHinhSachController.getLoaiHinhSach);
loaiHinhSachRouter.get("/:id", loaiHinhSachController.getLoaiHinhSachById);
loaiHinhSachRouter.post("/create", loaiHinhSachController.create);
loaiHinhSachRouter.post("/:id", loaiHinhSachController.update);
loaiHinhSachRouter.post("/delete/:id", loaiHinhSachController.deleteLoaiHinhSach);

module.exports = loaiHinhSachRouter;
