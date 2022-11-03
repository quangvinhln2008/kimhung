const express = require("express");

const nhanVienController = require("../controllers/NhanVienController");

const nhanVienRouter = express.Router();

nhanVienRouter.get("/", nhanVienController.getNhanVien);
nhanVienRouter.get("/:id", nhanVienController.getNhanVienById);
nhanVienRouter.post("/create", nhanVienController.create);
nhanVienRouter.post("/:id", nhanVienController.update);
nhanVienRouter.post("/delete/:id", nhanVienController.deleteNhanVien);

module.exports = nhanVienRouter;
