const express = require("express");

const phieuNhapController = require("../controllers/phieuNhapController");

const phieuNhapRouter = express.Router();

phieuNhapRouter.get("/", phieuNhapController.getPhieuNhap);
phieuNhapRouter.get("/:id", phieuNhapController.getPhieuNhapById);
phieuNhapRouter.post("/create", phieuNhapController.create);
phieuNhapRouter.post("/:id", phieuNhapController.update);
phieuNhapRouter.post("/delete/:id", phieuNhapController.deletePhieuNhap);

module.exports = phieuNhapRouter;
